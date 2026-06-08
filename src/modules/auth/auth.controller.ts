import { FastifyReply, FastifyRequest } from "fastify";

import { sendOtp, verifyOtp, forgotPassword, resetPassword, verifyLoginSessionToken } from "./auth.service";
import {
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { findUserByEmail } from "./auth.repository";

/**
 * POST /api/auth/send-otp
 *
 * Requires a login_session_token (proof of prior credential validation).
 * Extracts the user's email from the token and resends a 6-digit OTP
 * via email (all roles) and SMS (trader only).
 */
export const sendOtpHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {

  const { login_session_token, is_email, email } = sendOtpSchema.parse(request.body);
  
  const user = await findUserByEmail(email);

  if(!user){
    throw new Error(
      "User not found"
    );
  }

  if(!user.is_email_verified || !user.is_contact_number_verified){
    const result = await sendOtp(user.email,is_email);
    return reply.status(200).send({
      success: true,
      message: "OTP verified successfully",
      data: {
        user: result.user,
      },
    });
  }

  const payload = verifyLoginSessionToken(login_session_token);

  const result = await sendOtp(payload.email,true);

  return reply.status(200).send({
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
};

/**
 * POST /api/auth/verify-otp
 *
 * Requires a login_session_token (proof of prior credential validation)
 * and a 6-digit OTP. On success, generates and returns JWT access and
 * refresh tokens to complete the login flow.
 */
export const verifyOtpHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { login_session_token, otp, is_email, email } = verifyOtpSchema.parse(request.body);
  
  const user = await findUserByEmail(email);

  if(!user){
    throw new Error(
      "User not found"
    );
  }

  if(!user.is_email_verified || !user.is_contact_number_verified){
    const result = await verifyOtp(email, otp, is_email);
    return reply.status(200).send({
      success: true,
      message: "OTP verified successfully",
      data: {
        user: result.user,
      },
    });
  }

  const payload = verifyLoginSessionToken(login_session_token || "");

  const result = await verifyOtp(payload.email, otp, is_email);

  const accessToken = await reply.jwtSign(
    {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    },
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  const refreshToken = await reply.jwtSign(
    {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    },
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
  );

  return reply.status(200).send({
    success: true,
    message: "OTP verified successfully",
    data: {
      accessToken,
      refreshToken,
      user: result.user,
    },
  });
};

/**
 * POST /api/auth/forgot-password
 *
 * Sends a password reset email to the user's registered email address.
 * Returns a generic success message regardless of whether the email exists
 * (prevents email enumeration).
 */
export const forgotPasswordHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email } = forgotPasswordSchema.parse(request.body);

  const result = await forgotPassword(email);

  return reply.status(200).send({
    success: true,
    message: result.message,
  });
};

/**
 * POST /api/auth/reset-password
 *
 * Validates the reset token and sets the new password.
 */
export const resetPasswordHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { token, new_password } = resetPasswordSchema.parse(request.body);

  const result = await resetPassword(token, new_password);

  return reply.status(200).send({
    success: true,
    message: result.message,
  });
};
