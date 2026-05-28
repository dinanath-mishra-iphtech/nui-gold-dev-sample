// import { sequelize } from "../../config/database";
// import { AuthRepository } from "./auth.repository";

// import {
//   RegisterInput,
//   SetPasswordInput
// } from "./auth.types";

// import crypto from "crypto";
// import bcrypt from 'bcrypt';
// import { AppError } from "../../common/errors/app-error";
// import { EmailService } from "../../common/services/email.service";


// export class AuthService {

//   static async registerTrader(
//     data: RegisterInput
//   ) {

//     const transaction =
//       await sequelize.transaction();

//     try {

//       const {
//         business_info,
//         employees,
//         aml_questionnaire,
//         resale_certificate,
//       } = data;

//       // Check business email
//       const existingBusiness =
//         await AuthRepository.findBusinessByEmail(
//           business_info.email
//         );

//       if (existingBusiness) {
//         throw new Error(
//           "Business email already exists"
//         );
//       }

//       // Check employee emails
//       for (const employee of employees) {

//         const existingUser =
//           await AuthRepository.findUserByEmail(
//             employee.email
//           );

//         if (existingUser) {
//           throw new Error(
//             `Employee email already exists: ${employee.email}`
//           );
//         }
//       }

//       // Create business
//       const business =
//         await AuthRepository.createBusiness(
//           business_info,
//           transaction
//         );

//       // Create trader(owner) user
//       const traderUser =
//         await AuthRepository.createUser(
//           {
//             business_id: business.id,

//             first_name:
//               business_info.owner_first_name,

//             last_name:
//               business_info.owner_last_name,

//             email:
//               business_info.email,

//             password: null,

//             role: "trader",
//           },
//           transaction
//         );

//       // Generate trader raw token
//       const traderRawToken =
//         crypto.randomBytes(32).toString("hex");

//       // Hash trader token
//       const traderHashedToken =
//         crypto
//           .createHash("sha256")
//           .update(traderRawToken)
//           .digest("hex");

//       // Trader token expiry
//       const traderTokenExpiry =
//         new Date(
//           Date.now() +
//           24 * 60 * 60 * 1000
//         );

//       // Save trader token
//       await PasswordSetToken.create(
//         {
//           user_id:
//             traderUser.id,

//           token:
//             traderHashedToken,

//           expires_at:
//             traderTokenExpiry,
//         },
//         {
//           transaction,
//         }
//       );

//       await EmailService.sendSetPasswordEmail(
//         traderUser.email,
//         traderRawToken
//       );

//       // Store created employees
//       const createdEmployees = [];

//       // Create employees
//       for (const employee of employees) {

//         const createdEmployee =
//           await AuthRepository.createUser(
//             {
//               business_id: business.id,

//               first_name:
//                 employee.first_name,

//               last_name:
//                 employee.last_name,

//               email:
//                 employee.email,

//               password: null,

//               role:
//                 employee.role,
//             },
//             transaction
//           );

//         // Generate employee raw token
//         const employeeRawToken =
//           crypto.randomBytes(32).toString("hex");

//         // Hash employee token
//         const employeeHashedToken =
//           crypto
//             .createHash("sha256")
//             .update(employeeRawToken)
//             .digest("hex");

//         // Employee token expiry
//         const employeeTokenExpiry =
//           new Date(
//             Date.now() +
//             24 * 60 * 60 * 1000
//           );

//         // Save employee token
//         await PasswordSetToken.create(
//           {
//             user_id:
//               createdEmployee.id,

//             token:
//               employeeHashedToken,

//             expires_at:
//               employeeTokenExpiry,
//           },
//           {
//             transaction,
//           }
//         );

//         // FIX: Send email inside the loop using scoped variables
//         await EmailService.sendSetPasswordEmail(
//           createdEmployee.email,
//           employeeRawToken
//         );

//         createdEmployees.push(
//           createdEmployee
//         );
//       }

//       let resale = null;

//       // Create resale certificate (optional)
//       if (resale_certificate) {

//         resale =
//           await ResaleCertificate.create(
//             {
//               business_id: business.id,
//               ...resale_certificate,
//             },
//             {
//               transaction,
//             }
//           );
//       }

//       // Create AML questionnaire
//       const aml =
//         await AMLQuestionnaire.create(
//           {
//             business_id: business.id,
//             ...aml_questionnaire,
//           },
//           {
//             transaction,
//           }
//         );

//       await transaction.commit();

//       return {
//         message:
//           "Registration Successful",

//         business,

//         traderUser,

//         employees: createdEmployees,

//         resale_certificate: resale,

//         aml_questionnaire: aml,
//       };

//     } catch (error) {

//       await transaction.rollback();

//       throw error;
//     }
//   }

//   //set-password after registration
//   static async setPassword(data: SetPasswordInput) {

//     const { token, new_password } = data;

//     //hash incoming token
//     const hashedToken =
//       crypto.createHash("sha256")
//         .update(token)
//         .digest("hex");

//     //find token in Db
//     const tokenRecord =
//       await AuthRepository.findPasswordToken(
//         hashedToken
//       );

//     if (!tokenRecord) {
//       throw new Error("Invalid token");
//     }

//     // Check expiry
//     if (tokenRecord.expires_at < new Date()) {
//       throw new Error("Token expired");
//     }

//     //Hash Password 
//     const hashedPassword =
//       await bcrypt.hash(
//         new_password, 10
//       );

//     //set user password
//     await AuthRepository.updateUserPassword(
//       tokenRecord.user_id,
//       hashedPassword
//     );

//     // Delete used token
//     await AuthRepository.deletePasswordToken(
//       tokenRecord.id
//     );

//     return {
//       message:
//         "Password set successfully",
//     };

//   }


//   static async login(email: string, password: string) {

//     const user = await AuthRepository.findUserByEmail(email);

//     if (!user) {
//       throw new AppError("User not found", 404);
//     }

//     if (!user.password) {

//       throw new AppError(
//         "Please set your password first",
//         401
//       );
//     }

//     const isPasswordValid =
//       await bcrypt.compare(
//         password,
//         user.password,
//       );

//     if (!isPasswordValid) {

//       throw new AppError(
//         "Invalid password",
//         401
//       );
//     }


//     return {
//       id: user.id,
//       name: user.first_name + " " + user.last_name,
//       email: user.email,
//       role: user.role,
//     };
//   }


//   static async refreshToken(refreshToken: string) {

//   // const decoded =
//   //   jwt.verify(
//   //     refreshToken,
//   //     process.env.JWT_SECRET as string
//   //   ) as {
//   //     id: number;
//   //     email: string;
//   //     role: string;
//   //   };

//   // const newAccessToken =
//   //   jwt.sign(
//   //     {
//   //       id: decoded.id,

//   //       email: decoded.email,

//   //       role: decoded.role,
//   //     },
//   //     process.env.JWT_SECRET as string,
//   //     {
//   //       expiresIn:
//   //         process.env.JWT_EXPIRES_IN,
//   //     }
//   //   );

//   // return {
//   //   accessToken:
//   //     newAccessToken,
//   // };
// }



// }