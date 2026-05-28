// import { Transaction } from "sequelize";

// import { Business } from "../../database/models/business.model";
// import { User } from "../../database/models/user.model";
// import { AMLQuestionnaire } from "../../database/models/aml-questionnaire.model";
// import { ResaleCertificate } from "../../database/models/resale-certificate.model";
// import { PasswordSetToken }  from "../../database/models/password-set-token.model";

// import {
//   BusinessInfoInput,
//   EmployeeInput,
//   AMLQuestionnaireInput,
//   ResaleCertificateInput,
// } from "./auth.types";

// export class AuthRepository {

//   static async createBusiness(
//     data: BusinessInfoInput,
//     transaction: Transaction
//   ) {
//     return Business.create(data, {
//       transaction,
//     });
//   }

//   static async findBusinessByEmail(
//     email: string
//   ) {
//     return Business.findOne({
//       where: { email },
//     });
//   }

//   static async findUserByEmail(
//     email: string
//   ) {
//     return User.findOne({
//       where: { email },
//     });
//   }

//   static async createUser(
//     data: Partial<User>,
//     transaction: Transaction
//   ) {
//     return User.create(data as any, {
//       transaction,
//     });
//   }


//   static async findPasswordToken(
//   token: string
// ) {

//   return PasswordSetToken.findOne({
//     where: { token },
//   });
// }

// static async updateUserPassword(
//   userId: number,
//   hashedPassword: string
// ) {

//   return User.update(
//     {
//       password: hashedPassword,

//       is_email_verified: true,
//     },
//     {
//       where: {
//         id: userId,
//       },
//     }
//   );
// }

// static async deletePasswordToken(
//   id: number
// ) {

//   return PasswordSetToken.destroy({
//     where: { id },
//   });
// }


// }