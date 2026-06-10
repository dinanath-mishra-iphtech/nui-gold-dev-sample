import { Transaction } from "sequelize";
import { Business } from "../../database/models/business.model";
import { CreateUserInput, User } from "../../database/models/user.model";
import { CreateBusinessInput } from "./user.types";

export class UserRepository {

  static async create(data: CreateUserInput) {
    return User.create(data);
  }

  static async createUser(data: CreateUserInput, transaction: Transaction) {
    return User.create(data, { transaction });
  }

  static async createBusiness(data: CreateBusinessInput, transaction: Transaction) {
    return Business.create(data, { transaction });
  }

  static async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  static async findUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  static async findBusinessByEmail(email: string) {
    return Business.findOne({ where: { email } });
  }

  static async findById(id: number) {
    return User.findByPk(id);
  }

  //for sending limited attributes of user
  static async findByIdLimitedAttribute(id: number) {
    return User.findByPk(id, {
      attributes: [
        "id", "business_id", "first_name", "last_name",
        "email", "phone", "role", "status",
        "is_email_verified", "is_contact_number_verified",
        "createdAt", "updatedAt"
      ],
    });
  }



  static async findAll() {
    return User.findAll();
  }



  static async update(id: number, data: Partial<CreateUserInput>, transaction?: Transaction) {
    await User.update(data, { where: { id }, transaction });
    return User.findOne({ where: { id }, transaction, raw: true });
  }

  static async delete(id: number) {
    return User.destroy({ where: { id } });
  }

  static async findPasswordToken(token: string) {
    return User.findOne({ where: { token } });
  }

  static async updateUserPassword(userId: number, hashedPassword: string) {
    return User.update({ password: hashedPassword }, { where: { id: userId } });
  }

  static async updatePasswordToken(id: number) {
    return User.update({ token: null, expires_at: null }, { where: { id } });
  }


  static async setOtp(userId: number, otpHash: string, expiresAt: Date) {
    return User.update(
      {
        otp: otpHash,
        otp_expires_at: expiresAt,
        otp_attempts: 0,
      },
      { where: { id: userId } }
    );
  }

  // NEW: get business with all its users
  static async getBusinessWithUsers(businessId: number) {
    return Business.findOne({
      where: { id: businessId },
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email", "phone", "role", "status"],
        },
      ],
    });
  }



  static async updateProfile(id: number, data: { first_name?: string; last_name?: string; email?: string; phone?: string | null }) {
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");

    await User.update(data, { where: { id } });
    if (user.business_id) {
      const businessData: any = {};
      if (data.first_name) businessData.first_name = data.first_name;
      if (data.last_name) businessData.last_name = data.last_name;
      if (data.email) businessData.email = data.email;
      if (data.phone) businessData.contact_number = data.phone;

      await Business.update(businessData, { where: { id: user.business_id } });
    }
    return this.findByIdLimitedAttribute(id);
  }

  

  static async updatePassword(id: number, hashedPassword: string) {
    await User.update({ password: hashedPassword }, { where: { id } });
  }





}