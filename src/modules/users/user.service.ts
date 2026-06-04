import bcrypt from "bcrypt";
import crypto from "crypto";
import { sequelize } from "../../config/database";
import { UserRepository } from "./user.repository";
import { RegisterInput, SetPasswordInput } from "./user.types";
import { emailProvider } from "../../common/utils/email.provider";
import { getResetPasswordEmailTemplate } from "../../common/templates/resetPassword.template";

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

      // Send Email
      await emailProvider.sendEmail(
        traderUser.email,
        "Reset Your Password — NUI Gold",
        getResetPasswordEmailTemplate(traderRawToken,traderTokenExpiry),
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

        // Send email
        await emailProvider.sendEmail(
          createdEmployee.email,
          "Reset Your Password — NUI Gold",
          getResetPasswordEmailTemplate(employeeRawToken,employeeTokenExpiry),
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
}
