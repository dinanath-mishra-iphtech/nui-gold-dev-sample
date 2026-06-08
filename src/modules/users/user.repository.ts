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

  static async update(id: number, data: Partial<CreateUserInput>, transaction?: Transaction) {
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
              "created_at",
              "updated_at",
            ],
          },
        },

        {
          model: Business,
          attributes: {
            exclude: [
              "created_at",
              "updated_at",
            ],
          },
        },
      ],
    });
  }

  static async getVendors() {
    return Business.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "contact_number",
        "physical_street_address",
        "city",
        "state",
        "country",
        "postal",
        "status",
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
              "created_at",
              "updated_at",
            ],
          },
        },

        {
          model: Business,

          attributes: {
            exclude: [
              "created_at",
              "updated_at",
            ],
          },
        },
      ],
    });
  }

  static async createAddress(
    payload: CreateAddressInput & {
      user_id: number,
      business_id: number;
    }
  ) {
    return Address.create(payload);
  }

  static async getAddresses(
    user_id: number,
    type: number,
  ) {
    return Address.findAll({
      where: {
        user_id,
        type
      },
      order: [
        ["is_default", "DESC"],
        ["updated_at", "DESC"],
      ],
    });
  }

  static async resetDefaultAddress(
    user_id: number
  ) {
    return Address.update(
      { is_default: false },
      {
        where: {
          user_id,
        },
      }
    );
  }

  static async updateProfile(id: number, data: { name?: string; email?: string; phone?: string | null }) {
    await User.update(data, { where: { id } });
    return this.findById(id);
  }


  static async updatePassword(id: number, hashedPassword: string) {
    await User.update({ password: hashedPassword }, { where: { id } });
  }


}
