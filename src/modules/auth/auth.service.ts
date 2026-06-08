import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { ApiError } from "../../common/utils/ApiError";
import { smsProvider } from "../../common/utils/sms.provider";
import { emailProvider } from "../../common/utils/email.provider";
import { getResetPasswordEmailTemplate } from "../../common/templates/reset-password.template";
import { getOtpEmailTemplate } from "../../common/templates/otp.template";
import {
  setOtpOnUser,
  clearOtpOnUser,
  incrementOtpAttempts,
  findUserByEmail,
  updateUserPassword,
} from "./auth.repository";
import { User } from "../../database/models/user.model";

export interface LoginSessionPayload {
  id: number;
  email: string;
  role: string;
  purpose: "login-otp";
}

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Send a 6-digit OTP to the user identified by email.
 *
 * Delivery channel depends on the user's role:
 * - Admin: OTP sent via email only
 * - Trader / Trading: OTP sent via both email and SMS
 *
 * Flow:
 * 1. Find the user by email
 * 2. Generate a cryptographically secure 6-digit OTP
 * 3. Hash the OTP (bcrypt) and store it on the user record
 * 4. Send the OTP via email (all roles) and SMS (trader roles only)
 * 5. Return masked email, optional masked phone, and expiry info
 */
export const sendOtp = async (email: string, is_email: boolean) => {

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError("No account found for this email address.", 404);
  }

  // Rate-limit: if user already has an active OTP, check expiry cooldown
  if (user.otp && user.otp_expires_at && new Date() < user.otp_expires_at) {
    // Allow re-send only if less than half the expiry time has passed
    const elapsed = Date.now() - (user.otp_expires_at.getTime() - env.OTP_EXPIRY_MINUTES * 60 * 1000);
    if (elapsed < 60 * 1000) {
      throw new ApiError(
        "OTP was sent recently. Please wait before requesting a new one.",
        429,
      );
    }
  }

  const otpPlain = generateOtp();

  const otpHash = await bcrypt.hash(otpPlain, BCRYPT_SALT_ROUNDS);
  const expiresAt = new Date(
    Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000,
  );

  await setOtpOnUser(user.id, otpHash, expiresAt);

  // ── Send OTP via email (all roles) ──────────────────────────────────
  const emailHtml = getOtpEmailTemplate(otpPlain, env.OTP_EXPIRY_MINUTES);

  if (is_email) {
    try {
      await emailProvider.sendEmail(
        user.email,
        "Your Verification Code — NUI Gold",
        emailHtml,
      );
    } catch (error) {
      logger.error({ error, email }, "Failed to send OTP via email");
      throw new ApiError("Failed to send OTP. Please try again later.", 500);
    }
  }
  else {
    if (!user.phone) {
      logger.warn({ email, role: user.role }, "Trader user has no phone number — skipping SMS delivery");
    } else {
      const smsMessage = `Your NUI Gold verification code is: ${otpPlain}. Valid for ${env.OTP_EXPIRY_MINUTES} minutes. Do not share this code with anyone.`;

      try {
        await smsProvider.sendSms(user.phone, smsMessage);
      } catch (error) {
        // Log the SMS failure but don't throw — email OTP was already sent
        logger.error({ error, phone: user.phone }, "Failed to send OTP via SMS (email OTP was sent successfully)");
      }
    }
  }

  const result: Record<string, unknown> = {
    expiresInSeconds: env.OTP_EXPIRY_MINUTES * 60,
  };

  if (user.email) {
    result.email = maskEmail(user.email);
  }

  if (user.phone) {
    result.phone = maskPhone(user.phone);
  }

  return result;
};

/**
 * Verify a 6-digit OTP for the user identified by email.
 *
 * Flow:
 * 1. Find the user by email
 * 2. Check if an OTP exists and hasn't expired
 * 3. Check if maximum verification attempts have been reached
 * 4. Compare the provided OTP against the stored hash (bcrypt)
 * 5. If valid — clear OTP fields and return success
 * 6. If invalid — increment attempt counter and throw error
 */
export const verifyOtp = async (email: string, otp: string, is_email: boolean) => {

  const user = await findUserByEmail(email);

  if (!user || !user.otp || !user.otp_expires_at) {
    throw new ApiError(
      "No OTP found for this email address. Please request a new OTP.",
      400,
    );
  }

  if (new Date() > user.otp_expires_at) {
    await clearOtpOnUser(user.id);
    throw new ApiError(
      "OTP has expired. Please request a new OTP.",
      400,
    );
  }

  if (user.otp_attempts >= env.OTP_MAX_ATTEMPTS) {
    await clearOtpOnUser(user.id);
    throw new ApiError(
      "Too many failed attempts. Please request a new OTP.",
      429,
    );
  }

  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    await incrementOtpAttempts(user.id);

    const remainingAttempts =
      env.OTP_MAX_ATTEMPTS - (user.otp_attempts + 1);

    throw new ApiError(
      `Invalid OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : "Please request a new OTP."}`,
      400,
    );
  }

  if (is_email) {
    await User.update(
      {
        is_email_verified: true,
      },
      {
        where: {
          id: user.id,
        },
      },
    );
  } else {
    await User.update(
      {
        is_contact_number_verified: true,
      },
      {
        where: {
          id: user.id,
        },
      },
    );
  }

  await clearOtpOnUser(user.id);

  const updatedUser = await findUserByEmail(email);

  if (!updatedUser) {
    throw new ApiError(
      "User not found after OTP verification",
      404,
    );
  }

  if ( is_email && updatedUser && !updatedUser.is_contact_number_verified ) {
    await sendOtp( updatedUser.email, false);
  }

  return {
    verified: true,
    verification_type: is_email
      ? "email"
      : "phone",
    user: updatedUser,
  };
};

/**
 * Forgot Password — sends a password reset email with a JWT-based reset link.
 *
 * Flow:
 * 1. Find user by email (silently succeed even if not found — no email enumeration)
 * 2. Generate a short-lived JWT containing the userId
 * 3. Build the reset link and send the email
 */
export const forgotPassword = async (email: string) => {

  const user = await findUserByEmail(email);

  if (!user) {
    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  const resetToken = jwt.sign(
    { userId: user.id, purpose: "password-reset" },
    env.JWT_SECRET,
    { expiresIn: `${env.RESET_TOKEN_EXPIRY_MINUTES}m` },
  );

  const resetLink = `${env.FRONT_END_URL}/reset-password?token=${resetToken}`;
  const emailHtml = getResetPasswordEmailTemplate(
    resetLink,
    env.RESET_TOKEN_EXPIRY_MINUTES,
  );

  try {
    await emailProvider.sendEmail(
      user.email,
      "Reset Your Password — NUI Gold",
      emailHtml,
    );
  } catch (error) {
    logger.error({ error, email }, "Failed to send password reset email");
    throw new ApiError(
      "Failed to send reset email. Please try again later.",
      500,
    );
  }

  return {
    message:
      "If an account exists with this email, a password reset link has been sent.",
  };
};

/**
 * Reset Password — validates the JWT token and sets a new password.
 *
 * Flow:
 * 1. Verify the JWT token (checks signature + expiry)
 * 2. Validate the purpose claim
 * 3. Hash the new password with bcrypt
 * 4. Update the user's password
 */
export const resetPassword = async (token: string, newPassword: string) => {

  let payload: { userId: string; purpose: string };

  try {
    payload = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      purpose: string;
    };
  } catch (error) {
    throw new ApiError(
      "Invalid or expired reset link. Please request a new one.",
      400,
    );
  }

  if (payload.purpose !== "password-reset") {
    throw new ApiError(
      "Invalid reset link. Please request a new one.",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

  await updateUserPassword(payload.userId, hashedPassword);

  return {
    message: "Password has been reset successfully.",
  };
};

/**
 * Verify a login session token (issued after credential validation).
 *
 * Checks:
 * 1. JWT signature and expiry
 * 2. `purpose` claim must be "login-otp"
 *
 * Returns the decoded payload containing user identity.
 */
export const verifyLoginSessionToken = (
  token: string,
): LoginSessionPayload => {
  let payload: LoginSessionPayload;

  try {
    payload = jwt.verify(token, env.JWT_SECRET) as LoginSessionPayload;
  } catch {
    throw new ApiError(
      "Login session has expired. Please log in again.",
      401,
    );
  }

  if (payload.purpose !== "login-otp") {
    throw new ApiError(
      "Invalid login session token.",
      401,
    );
  }

  return payload;
};

/**
 * Generate a cryptographically secure 6-digit OTP.
 * Uses crypto.randomInt() for uniform distribution (no modulo bias).
 */
const generateOtp = (): string => {
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
};

/**
 * Mask an email address for safe display in API responses.
 * Example: john.doe@example.com → jo***@example.com
 */
const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");

  if (!domain || local.length <= 2) {
    return `***@${domain || "***"}`;
  }

  const visibleChars = Math.min(2, local.length);
  return `${local.slice(0, visibleChars)}${"*".repeat(local.length - visibleChars)}@${domain}`;
};

/**
 * Mask a phone number for safe display in API responses.
 * Example: +919876543210 → +91XXXXX3210
 */
const maskPhone = (phone: string): string => {
  if (phone.length <= 4) {
    return "XXXX";
  }

  const visiblePrefix = phone.startsWith("+") ? phone.slice(0, 3) : "";
  const visibleSuffix = phone.slice(-4);
  const maskedLength =
    phone.length - visiblePrefix.length - visibleSuffix.length;

  return `${visiblePrefix}${"X".repeat(maskedLength)}${visibleSuffix}`;
};
