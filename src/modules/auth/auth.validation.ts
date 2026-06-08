import { z } from "zod";

/**
 * Schema for the Send OTP request.
 *
 * Requires a login_session_token (issued after successful credential validation)
 * to prove the user's identity before sending/resending an OTP.
 * OTP delivery channel is determined by the user's role:
 * - Admin: email only
 * - Trader: email + SMS
 */
export const sendOtpSchema = z.object({
  login_session_token: z
    .string("Login session token is required")
    .min(1, "Login session token is required"),
  is_email: z.boolean(),
  email: z.string()
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

/**
 * Schema for the Verify OTP request.
 *
 * Requires a login_session_token (issued after successful credential validation)
 * and a 6-digit numeric OTP string.
 */
export const verifyOtpSchema = z.object({
  login_session_token: z
    .string().optional(),
  otp: z
    .string("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
  is_email: z.boolean(),
  email: z.string()
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

/**
 * Schema for the Forgot Password request.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string("Email is required")
    .email("Invalid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema for the Reset Password request.
 */
export const resetPasswordSchema = z.object({
  token: z
    .string("Reset token is required")
    .min(1, "Reset token is required"),
  new_password: z
    .string("New password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
