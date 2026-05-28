import bcrypt from "bcrypt";
import crypto from "crypto";
import { sequelize } from "../../config/database";
import { UserRepository } from "./user.repository";
import { RegisterInput, SetPasswordInput } from "./user.types";
import { emailProvider } from "../../common/utils/email.provider";
import { buildSetPasswordTemplate } from "../../common/templates/setPassword.template";
import { buildKycApprovedTemplate } from "../../common/templates/kyc-approved.template";
import { buildKycRejectedTemplate } from "../../common/templates/kyc-rejected.template";
import { buildPdfEmailTemplate } from "../../common/templates/pdfEmail.template";
import { buildVerifyOtpTemplate } from "../../common/templates/verifyOtp.templates";


export class UserService {
  static async registerTrader(data: RegisterInput) {
    const transaction = await sequelize.transaction();


    try {
      const {
        business_info,
        employees,
      } = data;

      // Check business email
      const existingBusiness =
        await UserRepository.findBusinessByEmail(
          business_info.email
        );

      if (existingBusiness) {
        throw new Error(
          "Business email already exists",
        );
      }

      // Check employee emails
      for (const employee of employees) {
        const existingUser =
          await UserRepository.findUserByEmail(
            employee.email
          );

        if (existingUser) {
          throw new Error(
            `Employee email already exists: ${employee.email}`,
          );
        }
      }

      // Create Business
      const business =
        await UserRepository.createBusiness(
          business_info,
          transaction
        );

      // Create Owner/Trader User
      const traderUser =
        await UserRepository.createUser(
          {
            business_id: business.id,

            first_name:
              business.first_name,

            last_name:
              business.last_name,

            email: business.email,

            password: "",

            status: "active",

            token: "",

            expires_at: null,

            role: "trader",
          },
          transaction
        );

      // Generate token
      const traderRawToken =
        crypto.randomBytes(32).toString(
          "hex"
        );

      const traderHashedToken =
        crypto
          .createHash("sha256")
          .update(traderRawToken)
          .digest("hex");

      const traderTokenExpiry =
        new Date(
          Date.now() +
          24 * 60 * 60 * 1000
        );

      // Save token
      const updatedUser = await UserRepository.update(
        traderUser.id,
        {
          token: traderHashedToken,
          expires_at: traderTokenExpiry
        },
        transaction
      );

      //send email to traider 
      const traderHtml =
        buildSetPasswordTemplate(
          traderRawToken
        );

      await emailProvider.sendEmail(
        traderUser.email,
        "Set Your Password",
        traderHtml
      );

      // Employees array
      const createdEmployees =
        [];

      // Create Employees
      for (const employee of employees) {
        const createdEmployee =
          await UserRepository.createUser(
            {
              business_id:
                business.id,

              first_name:
                employee.first_name,

              last_name:
                employee.last_name,

              email:
                employee.email,

              password: "",

              status: "active",

              token: "",

              expires_at: null,

              role:
                employee.role,
            },
            transaction
          );

        // Employee token
        const employeeRawToken =
          crypto
            .randomBytes(32)
            .toString("hex");

        const employeeHashedToken =
          crypto
            .createHash("sha256")
            .update(
              employeeRawToken
            )
            .digest("hex");

        const employeeTokenExpiry =
          new Date(
            Date.now() +
            24 *
            60 *
            60 *
            1000
          );

        // Save token
        const updatedEmployee = await UserRepository.update(
          createdEmployee.id,
          {
            token: employeeHashedToken,
            expires_at: employeeTokenExpiry,
          },
          transaction
        );

        //send email to all user's
        const employeeHtml =
          buildSetPasswordTemplate(
            employeeRawToken
          );

        await emailProvider.sendEmail(
          createdEmployee.email,
          "Set Your Password",
          employeeHtml
        );


        createdEmployees.push(
          updatedEmployee
        );
      }

      await transaction.commit();

      return {
        message:
          "Registration successful",

        business,

        updatedUser,

        employees:
          createdEmployees,
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

  static async login(email: string, password: string) {

    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {

      throw new Error("Please set your password first");
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isPasswordValid) {

      throw new Error("Invalid password");
    }


    return {
      id: user.id,
      name: user.first_name + " " + user.last_name,
      email: user.email,
      role: user.role,
    };
  }

  static async getUsers() {
    return UserRepository.getUsers();
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

  // kyc email functions
  static async sendKycEmail(
    email: string,
    name: string,
    status: string,
    tier?: string,
    creditLimit?: number,
    rejectionReasons?: string[],
  ): Promise<void> {

    if (status.toUpperCase() === "APPROVED") {

      if (!tier || !creditLimit) {
        throw new Error("Tier and credit limit required");
      }

      const html = buildKycApprovedTemplate(name, tier, creditLimit);

      await emailProvider.sendEmail(
        email,
        "Welcome to Numismatics Unlimited! Your Account is Approved",
        html,
      );

    } else if (status.toUpperCase() === "REJECTED") {

      if (!rejectionReasons || rejectionReasons.length === 0) {
        throw new Error("Rejection reasons required");
      }

      const formattedReasons = rejectionReasons.map((reason) => {
        switch (reason) {
          case "AML":
            return "The AML Questionnaire submitted with your application is incomplete. Certain mandatory compliance-related fields and supporting details are missing and require clarification.";
          case "RESALE_CERTIFICATE":
            return "The uploaded Resale Certificate could not be verified because the document provided was either incomplete, unclear, or missing required information.";
          case "IDENTITY_MISMATCH":
            return "Some personal/business identification details submitted during registration do not match the supporting documentation attached with your application.";
          case "DOCUMENT_VERIFICATION":
            return "Additional document verification could not be completed because some required supporting documents were missing, invalid, or could not be authenticated successfully.";
          default:
            return reason;
        }
      });

      const html = buildKycRejectedTemplate(name, formattedReasons);

      await emailProvider.sendEmail(
        email,
        "Action Required: Update to your KYC Verification",
        html,
      );

    } else {
      throw new Error("Invalid status");
    }
  }



  static async sendPdfEmail(
    email: string,
    pdfBuffer: Buffer,
    pdfFilename: string,
  ): Promise<void> {
    const html = buildPdfEmailTemplate(pdfFilename);

    await emailProvider.sendEmail(
      email,
      "Your Document from Numismatics Unlimited Inc.",
      html,
      [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],

    );
  }

  // otp email function
  static async sendOtpEmail(
    email: string,
    name: string,
    otp: string,
  ): Promise<void> {

    if (!email || !name || !otp) {
      throw new Error("email, name and otp are required");
    }

    const html = buildVerifyOtpTemplate(name, otp);

    await emailProvider.sendEmail(
      email,
      "Your OTP for Numismatics Unlimited Inc.",
      html,
    );
  }




}