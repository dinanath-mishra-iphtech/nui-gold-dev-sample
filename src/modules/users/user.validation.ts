import { z } from "zod";

export const createUserSchema =
  z.object({
    first_name:
      z.string().min(2),

    last_name:
      z.string().min(2),

    email:
      z.string().email(),

    phone:
      z.string().optional(),

    is_email_verified:
      z.boolean().optional(),

    status:
      z.string().default("active"),

    token:
      z.string().optional(),

    expires_at:
      z.any().nullable().optional(),

    otp:
      z.string().nullable().optional(),

    otp_expires_at:
      z.any().nullable().optional(),

    otp_attempts:
      z.number().optional(),

    role: z.enum([
      "trading",
      "viewer",
      "admin",
      "trader",
    ]),
  });


export const createBusinessSchema =
  z.object({

    business_name: z
      .string()
      .min(2),

    first_name: z
      .string()
      .min(2),

    last_name: z
      .string()
      .min(2),

    contact_number: z
      .string()
      .min(10),

    physical_street_address:
      z.string().min(5),

    city: z.string().min(2),

    state: z.string().min(2),

    postal: z.string().min(2),

    country: z.string().min(2),

    email: z.string().email(),

    resale_certificate:
      z
        .record(
          z.string(),
          z.any()
        )
        .optional(),

    aml_plan_exists:
      z.boolean(),

    independent_audit_conducted:
      z.boolean(),

    aml_training_provided:
      z.boolean(),

    audit_details: z
      .record(
        z.string(),
        z.any()
      )
      .optional(),

    uploaded_documents:
      z.array(
        z.record(
          z.string(),
          z.any()
        )
      )
      .optional(),

  });
  

export const registerInputSchema =
  z.object({
    business_info:
      createBusinessSchema,

    employees:
      z.array(
        createUserSchema
      ),
  });

//for set-password validation
export const setPasswordSchema =
  z.object({

    token: z
      .string()
      .min(1, "Token is required")
      .nullable(),

    new_password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters"
      ),
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

});

export const sendOtpSchema =
  z.object({
    email: z
      .string()
      .email("Invalid email"),
  });

export const verifyOtpSchema =
  z.object({
    email: z
      .string()
      .email("Invalid email"),

    otp: z
      .string()
      .min(4)
      .max(6),
  });
    


export const createAddressSchema =
  z.object({
     

    user_id: z
      .number()
      .int()
      .positive(),
    /**
     * Example:
     * 1 = Ship To Me
     * 2 = Drop Ship
     * 3 = Hold Shipping
     * 4 = Pick Up
     * 5 = Store At Depository
     */
    type: z
      .number()
      .int()
      .positive(),

    address_line_1: z
      .string()
      .min(
        3,
        "Address line 1 is required",
      ),

    address_line_2: z
      .string()
      .optional(),

    landmark: z
      .string()
      .optional(),

    city: z
      .string()
      .min(
        2,
        "City is required",
      ),

    state: z
      .string()
      .min(
        2,
        "State is required",
      ),

    postal_code: z
      .string()
      .min(
        3,
        "Postal code is required",
      ),

    country: z
      .string()
      .min(
        2,
        "Country is required",
      ),

    contact_number: z
      .string()
      .min(
        10,
        "Contact number must be at least 10 digits",
      ),

    is_default: z
      .boolean()
      .optional(),

  });
