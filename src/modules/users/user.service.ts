import bcrypt from "bcrypt";
import crypto from "crypto";
import { sequelize } from "../../config/database";
import { UserRepository } from "./user.repository";
import { CreateAddressInput, RegisterInput, SetPasswordInput, UpdateAddressInput } from "./user.types";
import { emailProvider } from "../../common/utils/email.provider";
import { getResetPasswordEmailTemplate } from "../../common/templates/resetPassword.template";
import { User } from "../../database/models/user.model";
import { Address } from "../../database/models/address.model";
import { sendOtp } from "../auth/auth.service";
import { logger } from "../../config/logger";


export class UserService {

  static async registerTrader(data: RegisterInput) {
  const transaction = await sequelize.transaction();

  // collect email jobs to send after commit
  const emailJobs: Array<() => Promise<void | boolean>> = [];

  try {
    const { business_info, employees } = data;

    // Check business email
    const existingBusiness = await UserRepository.findBusinessByEmail(business_info.email);
    if (existingBusiness) {
      throw new Error("Business email already exists");
    }

    const existingBusinessAsEmployee = await UserRepository.findUserByEmail(business_info.email);
    if (existingBusinessAsEmployee) {
      throw new Error("Business email already exists as employee");
    }

    // Check employee emails
    for (const employee of employees) {
      const existingUser = await UserRepository.findUserByEmail(employee.email);
      if (existingUser) {
        throw new Error(`Employee email already exists: ${employee.email}`);
      }
    }

    /*** STEP 1: Create Business */
    const business = await UserRepository.createBusiness(business_info, transaction);

    /*** STEP 2: Create Employees */
    const createdEmployees = [];

    for (const employee of employees) {
      const createdEmployee = await UserRepository.createUser(
        {
          business_id: business.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          password: null,        // fix: null instead of ""
          status: "pending",
          token: null,           // fix: null instead of ""
          expires_at: null,
          role: employee.role,
          phone: employee.phone,
        },
        transaction
      );

      const employeeRawToken = crypto.randomBytes(32).toString("hex");
      const employeeHashedToken = crypto.createHash("sha256").update(employeeRawToken).digest("hex");
      const employeeTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const updatedEmployee = await UserRepository.update(
        createdEmployee.id,
        {
          token: employeeHashedToken,
          expires_at: employeeTokenExpiry,
        },
        transaction
      );

      // fix: queue email instead of sending inside transaction
      emailJobs.push(() =>
        emailProvider.sendEmail(
          createdEmployee.email,
          "Reset Your Password — NUI Gold",
          getResetPasswordEmailTemplate(employeeRawToken, employeeTokenExpiry)
        )
      );

      createdEmployees.push(updatedEmployee);
    }

    /*** STEP 3: Create Trader User */
    const traderUser = await UserRepository.createUser(
      {
        business_id: business.id,
        first_name: business.first_name,
        last_name: business.last_name,
        email: business.email,
        password: null,          // fix: null instead of ""
        role: "trader",
        phone: business_info.contact_number,
        status: "pending",
        token: null,             // fix: null instead of ""
        expires_at: null,
      },
      transaction
    );

    await transaction.commit();

    /*** STEP 4: Send emails after commit */
    for (const job of emailJobs) {
      try {
        await job();
      } catch (error) {
        logger.error({ error }, "Failed to send employee setup email");
      }
    }

    /*** STEP 5: Send OTP to trader */
    try {
      await sendOtp(traderUser.email, true);
    } catch (error) {
      logger.error({ error }, "Failed to send OTP after registration");
      // don't throw — business is saved, trader can request OTP resend
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


  //set-password after registration
  static async setPassword(data: SetPasswordInput) {

    const { token, new_password } = data;

    //hash incoming token
    const hashedToken =
      crypto.createHash("sha256")
        .update(token!)
        .digest("hex");

    //find token in Db
    const tokenRecord =
      await UserRepository.findPasswordToken(
        hashedToken
      );

    if (!tokenRecord) {
      throw new Error("Invalid token");
    }

    // Check expiry
    if (tokenRecord.expires_at && tokenRecord.expires_at < new Date()) {
      throw new Error("Token expired");
    }

    //Hash Password 
    const hashedPassword =
      await bcrypt.hash(
        new_password, 10
      );

    //set user password
    await UserRepository.updateUserPassword(
      tokenRecord.id,
      hashedPassword
    );

    // Delete used token
    await UserRepository.updatePasswordToken(
      tokenRecord.id
    );

    return {
      message:
        "Password set successfully",
    };

  }

  static async sendSetPasswordLink(email: string,) {
    const user =
      await UserRepository.findUserByEmail(
        email,
      );

    if (!user) {
      throw new Error(
        "User not found",
      );
    }

    const rawToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiry =
      new Date(
        Date.now() +
        24 *
        60 *
        60 *
        1000,
      );

    await UserRepository.update(
      user.id,
      {
        token: hashedToken,
        expires_at: expiry,
      },
    );

    await emailProvider.sendEmail(
      user.email,
      "Set Your Password — NUI Gold",
      getResetPasswordEmailTemplate(
        rawToken,
        expiry,
      ),
    );

    return {
      success: true,
      message:
        "Password setup link sent successfully",
    };
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.password) {
      throw new Error("Please set your password first");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.is_email_verified) {
      throw new Error("Please verify your email before logging in");
    }

    if (!user.is_contact_number_verified) {
      throw new Error("Please verify your phone number before logging in");
    }

    return {
      id: user.id,
      name: user.first_name + " " + user.last_name,
      email: user.email,
      role: user.role,
      is_email_verified: user.is_email_verified,
      is_contact_number_verified: user.is_contact_number_verified,
    };
  }

  static async getUsers() {
    return UserRepository.getUsers();
  }

  static async getVendors() {
    return UserRepository.getVendors();
  }

  static async getUserById(id: number) {
    const user =
      await UserRepository.getUserById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return user;
  }

  static async createAddress(
    userId: number,
    payload: Omit<
      CreateAddressInput,
      "user_id" | "business_id"
    >
  ) {
    const user = await User.findByPk(
      userId
    );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (payload.is_default) {
      await UserRepository.resetDefaultAddress(userId);
    }

    return UserRepository.createAddress({
      ...payload,
      user_id: userId,
      business_id:
        user.business_id,
    });
  }

  static async updateAddress(
    addressId: number,
    userId: number,
    payload: UpdateAddressInput
  ) {
    const address =
      await Address.findOne({
        where: {
          id: addressId,
          user_id: userId,
        },
      });

    if (!address) {
      throw new Error(
        "Address not found"
      );
    }

    if (payload.is_default) {
      await UserRepository.resetDefaultAddress(userId);
    }

    await address.update(payload);

    return address;
  }

  static async deleteAddress(
    addressId: number,
    userId: number
  ) {
    const address =
      await Address.findOne({
        where: {
          id: addressId,
          user_id: userId,
        },
      });

    if (!address) {
      throw new Error(
        "Address not found"
      );
    }

    await address.destroy();

    return true;
  }

  static async getAddresses(
    user_id: number,
    type: number
  ) {
    const user = await User.findByPk(
      user_id
    );

    if (!user) {
      throw new Error("User not found");
    }

    return UserRepository.getAddresses(
      user_id,
      type
    );
  }


  static async updateProfile(id: number, data: { name?: string; email?: string; phone?: string | null }) {
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






}
