// import { z } from "zod";

// export const businessInfoSchema = z.object({
//   business_name: z
//     .string()
//     .min(2, "Business name is required"),

//   owner_first_name: z
//     .string()
//     .min(2, "Owner first name is required"),

//   owner_last_name: z
//     .string()
//     .min(2, "Owner last name is required"),

//   street_address: z
//     .string()
//     .min(3, "Street address is required"),

//   city: z
//     .string()
//     .min(2, "City is required"),

//   state: z
//     .string()
//     .min(2, "State is required"),

//   postal_code: z
//     .string()
//     .min(3, "Postal code is required"),

//   country: z
//     .string()
//     .min(2, "Country is required"),

//   email: z
//     .string()
//     .email("Invalid business email"),
// });

// export const employeeSchema = z.object({
//   first_name: z
//     .string()
//     .min(2, "First name is required"),

//   last_name: z
//     .string()
//     .min(2, "Last name is required"),

//   email: z
//     .string()
//     .email("Invalid employee email"),

//   role: z.enum(
//     ["trading", "view_only"],
//     {
//       message: "Invalid role",
//     }
//   ),
// });

// export const resaleCertificateSchema = z.object({
//   certificate_number: z
//     .string()
//     .min(3, "Certificate number is required"),

//   signature: z
//     .string()
//     .min(2, "Signature is required"),

//   print_name: z
//     .string()
//     .min(2, "Print name is required"),

//   title: z
//     .string()
//     .min(2, "Title is required"),

//   signed_date: z.coerce.date(),
// });

// export const amlQuestionnaireSchema = z.object({
//   aml_policy: z.boolean(),

//   independent_audit: z.boolean(),

//   aml_training_program: z.boolean(),

//   auditor_name: z
//     .string()
//     .min(2, "Auditor name is required"),

//   auditor_contact: z
//     .string()
//     .min(2, "Auditor contact is required"),

//   auditor_details: z
//     .string()
//     .min(2, "Auditor details are required"),
// });

// export const registerSchema = z.object({
//   business_info: businessInfoSchema,

//   employees: z.array(employeeSchema),

//   resale_certificate:
//     resaleCertificateSchema.optional(),

//   aml_questionnaire:
//     amlQuestionnaireSchema,
// });

// //for set-password validation
// export const setPasswordSchema =
//   z.object({

//     token: z
//       .string()
//       .min(1, "Token is required"),

//     new_password: z
//       .string()
//       .min(
//         6,
//         "Password must be at least 6 characters"
//       ),
//   });

// export const loginSchema = z.object({
//   email: z
//     .string()
//     .email("Invalid email"),
    
//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters"),
    
// });  


// export const refreshTokenSchema =
//   z.object({

//     refreshToken: z
//       .string()
//       .min(
//         1,
//         "Refresh token is required"
//       ),
//   });