import bcrypt from "bcrypt";
import crypto from "crypto";
import { sequelize } from "../../config/database";
import { UserRepository } from "./user.repository";
import { AddUserInput, RegisterInput, SetPasswordInput } from "./user.types";
import { emailProvider } from "../../common/utils/email.provider";
import { getResetPasswordEmailTemplate } from "../../common/templates/resetPassword.template";
import { getOtpEmailTemplate } from "../../common/templates/otp.template";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { buildNeedHelpTemplate } from "../../common/templates/needHelp.template";

export class UserService {

  // ── Private: Send OTP to trader after registration ──────────────────
  private static async sendRegistrationOtp(email: string) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) return;

    const otpPlain = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otpPlain, 10);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    // save OTP on user via UserRepository
    await UserRepository.setOtp(user.id, otpHash, expiresAt);

    const emailHtml = getOtpEmailTemplate(otpPlain, env.OTP_EXPIRY_MINUTES);

    await emailProvider.sendEmail(
      email,
      "Your Verification Code — NUI Gold",
      emailHtml
    );
  }

  static async registerTrader(data: RegisterInput) {
    const transaction = await sequelize.transaction();
    const emailJobs: Array<() => Promise<void | boolean>> = [];

    try {
      const { business_info, employees } = data;

      const existingBusiness = await UserRepository.findBusinessByEmail(business_info.email);
      if (existingBusiness) throw new Error("Business email already exists");

      const existingBusinessAsEmployee = await UserRepository.findUserByEmail(business_info.email);
      if (existingBusinessAsEmployee) throw new Error("Business email already exists as employee");

      for (const employee of employees) {
        const existingUser = await UserRepository.findUserByEmail(employee.email);
        if (existingUser) throw new Error(`Employee email already exists: ${employee.email}`);
      }

      /*** STEP 1: Create Business */
      const business = await UserRepository.createBusiness(business_info, transaction);

      /*** STEP 2: Create Trader */
      const traderUser = await UserRepository.createUser(
        {
          business_id: business.id,
          first_name: business.first_name,
          last_name: business.last_name,
          email: business.email,
          password: null,
          role: "trader",
          phone: business_info.contact_number,
          status: "pending",
          token: null,
          expires_at: null,
        },
        transaction
      );

      /*** STEP 3: Create Employees */
      const createdEmployees = [];

      for (const employee of employees) {
        const createdEmployee = await UserRepository.createUser(
          {
            business_id: business.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            password: null,
            status: "pending",
            token: null,
            expires_at: null,
            role: employee.role,
            phone: employee.phone,
          },
          transaction
        );

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await UserRepository.update(
          createdEmployee.id,
          { token: hashedToken, expires_at: tokenExpiry },
          transaction
        );

        emailJobs.push(() =>
          emailProvider.sendEmail(
            createdEmployee.email,
            "Reset Your Password — NUI Gold",
            getResetPasswordEmailTemplate(rawToken)
          )
        );

        createdEmployees.push(createdEmployee);
      }

      await transaction.commit();

      /*** STEP 4: Send employee emails */
      for (const job of emailJobs) {
        try { await job(); } catch (e) {
          logger.error({ e }, "Failed to send employee setup email");
        }
      }

      /*** STEP 5: Send OTP to trader */
      try {
        await UserService.sendRegistrationOtp(traderUser.email);
      } catch (e) {
        logger.error({ e }, "Failed to send OTP after registration");
      }

      return {
        message: "Business registered successfully. OTP sent to business email.",
        business,
        employees: createdEmployees,
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async setPassword(data: SetPasswordInput) {
    const { token, new_password } = data;

    const hashedToken = crypto.createHash("sha256").update(token!).digest("hex");
    const tokenRecord = await UserRepository.findPasswordToken(hashedToken);

    if (!tokenRecord) throw new Error("Invalid token");
    if (tokenRecord.expires_at && tokenRecord.expires_at < new Date()) throw new Error("Token expired");

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await UserRepository.updateUserPassword(tokenRecord.id, hashedPassword);
    await UserRepository.updatePasswordToken(tokenRecord.id);

    return { message: "Password set successfully" };
  }

  static async sendSetPasswordLink(email: string) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await UserRepository.update(user.id, { token: hashedToken, expires_at: expiry });

    await emailProvider.sendEmail(
      user.email,
      "Set Your Password — NUI Gold",
      getResetPasswordEmailTemplate(rawToken)
    );

    return { success: true, message: "Password setup link sent successfully" };
  }

  static async getBusinessProfile(userId: number) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const business = await UserRepository.getBusinessWithUsers(user.business_id);
    if (!business) {
      throw new Error("Business not found");
    }

    const allUsers = (business as any).users ?? [];
    const employees = allUsers.filter((u: any) => u.id !== userId);

    return {
      business_name: business.business_name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      employees,
    };
  }


  static async updateProfile(id: number, data: { first_name?: string; last_name?: string; email?: string; phone?: string | null }) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return UserRepository.updateProfile(id, data);
  }


  static async changePassword(id: number, currentPassword: string, newPassword: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    if (!user.password) throw new Error("Please set your password first");


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");
    const hashed = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePassword(id, hashed);
  }


  static async addUser(traderId: number, data: AddUserInput) {

    // Get trader to find business_id 
    const trader = await UserRepository.findById(traderId);
    if (!trader) throw new Error("Trader not found");

    // Check email already exists 
    const existingUser = await UserRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error(`Email already exists: ${data.email}`);
    }


    // Create user under same business 
    const newUser = await UserRepository.create({
      business_id: trader.business_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
      phone: data.phone ?? null,
      password: null,
      status: "pending",
      token: null,
      expires_at: null,
    });

    //STEP 4: Generate setup token 
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await UserRepository.update(newUser.id, {
      token: hashedToken,
      expires_at: expiry,
    });

    // STEP 5: Send set password email 
    await emailProvider.sendEmail(
      newUser.email,
      "Set Your Password — NUI Gold",
      getResetPasswordEmailTemplate(rawToken)
    );

    return {
      message: "User added successfully. Setup email sent.",
    };
  }

  static async removeUser(traderId: number, targetUserId: number) {
    const trader = await UserRepository.findById(traderId);
    if (!trader) {
      throw new Error("Trader not found");
    }

    const targetUser = await UserRepository.findById(targetUserId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    if (targetUser.business_id !== trader.business_id) {
      throw new Error("Unauthorized: User does not belong to your business");
    }

    if (targetUser.role === "trader") {
      throw new Error("Cannot remove the trader account");
    }

    await UserRepository.delete(targetUserId);
    return {
      message: "User removed successfully"
    };
  }

  //for sending user query details to admin's email
  static async needHelp(userId: number, subject: string, description: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("User not found");
    
    const html = buildNeedHelpTemplate(subject, description, user.email);
    const ADMIN_EMAIL = "dinanath.mishra@iphtechnologies.com";

    await emailProvider.sendEmail(ADMIN_EMAIL, subject, html);
    return {
      message: "Query submitted successfully"
    }
  }
  




}