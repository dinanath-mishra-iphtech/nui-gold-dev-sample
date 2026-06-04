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
      .max(15, "Contact number cannot exceed 15 digits").nullable().optional(),

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

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

});