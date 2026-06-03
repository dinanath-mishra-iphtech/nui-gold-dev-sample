import { Transaction } from "sequelize";
import { Business } from "../../database/models/business.model";
import { CreateUserInput, User } from "../../database/models/user.model";
import { Address } from "../../database/models/address.model";
import { CreateAddressInput, CreateBusinessInput } from "./user.types";

export class UserRepository {
  static async createUser(data: CreateUserInput, transaction: Transaction) {
    return User.create(data, {
      transaction
    });
  }

  static async createBusiness(data: CreateBusinessInput, transaction: Transaction) {
    return Business.create(data, {
      transaction
    });
  }

  static async findUserByEmail(email: string) {
    return User.findOne({
      where: { email },
    });
  }

  static async findBusinessByEmail(email: string) {
    return Business.findOne({
      where: { email },
    });
  }

  static async findById(id: number) {
    return User.findByPk(id);
  }

  static async findAll() {
    return User.findAll();
  }

  static async update(id: number, data: Partial<CreateUserInput>, transaction?: any) {
    console.log("Data: ", data);
    await User.update(data, {
      where: { id },
      transaction,
    });
    return User.findOne({
      where: { id },
      transaction,
      raw: true,
    });
  }

  static async delete(id: number) {
    return User.destroy({
      where: { id },
    });
  }

  static async findPasswordToken(
    token: string
  ) {

    return User.findOne({
      where: { token },
    });
  }

  static async updateUserPassword(
    userId: number,
    hashedPassword: string
  ) {

    return User.update(
      {
        password: hashedPassword,

        is_email_verified: true,
      },
      {
        where: {
          id: userId,
        },
      }
    );
  }

  static async updatePasswordToken(id: number) {
    return User.update(
      {
        token: null,
        expires_at: null,
      },
      {
        where: { id },
      }
    );
  }

  static async getUsers() {
    return User.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "status",
      ],

      include: [
        {
          model: Address,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
            ],
          },
        },

        {
          model: Business,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });
  }

  static async getUserById(id: number) {
    return User.findOne({
      where: { id },

      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "status",
        "role",
        "is_email_verified",
      ],

      include: [
        {
          model: Address,

          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
            ],
          },
        },

        {
          model: Business,

          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });
  }

  // ─── OTP Methods ──────────────────────────────────────────

  static async setOtp(id: number, otpHash: string, expiresAt: Date) {
    return User.update(
      {
        otp: otpHash,
        otp_expires_at: expiresAt,
        otp_attempts: 0,
      },
      {
        where: { id },
      }
    );
  }

  static async clearOtp(id: number) {
    return User.update(
      {
        otp: null,
        otp_expires_at: null,
        otp_attempts: 0,
      },
      {
        where: { id },
      }
    );
  }

  static async incrementOtpAttempts(id: number) {
    return User.increment("otp_attempts", {
      where: { id },
    });
  }

  // ─── Address Methods ───────────────────────────

  static async createAddress(data: CreateAddressInput,) {

    return Address.create(data);
  }

  static async removeDefaultAddresses(user_id: number,) {

    return Address.update(
      {
        is_default: false,
      },
      {
        where: {
          user_id,
        },
      },
    );
  }

  static async getUserAddresses(user_id: number,) {

    return Address.findAll({
      where: {
        user_id,
      },

      order: [
        ["is_default", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  static async getAddressById(id: number,) {

    return Address.findByPk(id);
  }

  static async updateAddress(id: number, data: Partial<CreateAddressInput>,) {

    await Address.update(
      data,
      {
        where: { id },
      },
    );

    return Address.findByPk(id);
  }

  static async deleteAddress(id: number,) {

    return Address.destroy({
      where: { id },
    });
  }


}
