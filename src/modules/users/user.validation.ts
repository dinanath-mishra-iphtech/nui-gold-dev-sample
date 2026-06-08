import { z } from "zod";

export const createUserSchema =
  z.object({
    first_name:
      z.string().min(2),

    last_name:
      z.string().min(2),

    email:
      z.string().email(),

    is_email_verified:
      z.boolean().optional(),

    status:
      z.string().default("active"),

    token:
      z.string().optional(),

    expires_at:
      z.any().nullable().optional(),

    role: z.enum([
      "trading",
      "viewer",
      "admin",
      "trader",
    ]),

    phone: z.string(),
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
      .min(10, "Contact number must be at least 10 digits")
      .max(15, "Contact number cannot exceed 15 digits").nullable(),

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

    status: z
      .string()
      .default("pending"),

    tier: z
      .string()
      .default(""),

    credit_limit: z
      .string()
      .default("0"),
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

export const sendSetPasswordSchema =
  z.object({
    email: z
      .string()
      .email(),
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  is_email: z.boolean()

});

export const createAddressSchema = z.object({
  address_line_1: z.string().min(1),

  address_line_2: z.string().min(1),

  landmark: z.string().min(1),

  city: z.string().min(1),

  state: z.string().min(1),

  pin_code: z.string().min(1),

  country: z.string().min(1),

  type: z.number(),

  contact_number: z.string().min(1),

  is_default: z.boolean(),
});


export const updateAddressSchema =
  z.object({
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pin_code: z.string().optional(),
    country: z.string().optional(),
    type: z.number().optional(),
    contact_number: z.string().optional(),
    is_default: z.boolean().optional(),
  });

export const updateProfileSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});