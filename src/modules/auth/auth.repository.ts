import { Op } from "sequelize";
import { User } from "../../database/models/user.model";

/**
 * Store a hashed OTP on the user record.
 */
export const setOtpOnUser = async (
  userId: number,
  otpHash: string,
  expiresAt: Date,
): Promise<void> => {
  await User.update(
    { otp: otpHash, otp_expires_at: expiresAt, otp_attempts: 0 },
    { where: { id: userId } },
  );
};

/**
 * Clear OTP fields on a user (after successful verification or invalidation).
 */
export const clearOtpOnUser = async (userId: number): Promise<void> => {
  await User.update(
    { otp: null, otp_expires_at: null, otp_attempts: 0 },
    { where: { id: userId } },
  );
};

/**
 * Increment the OTP attempt counter for a user.
 */
export const incrementOtpAttempts = async (userId: number): Promise<void> => {
  await User.increment("otp_attempts", {
    where: { id: userId },
  });
};

/**
 * Find a user by their email address.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return User.findOne({
    where: { email },
  });
};

/**
 * Update a user's password.
 */
export const updateUserPassword = async (
  userId: string,
  hashedPassword: string,
): Promise<void> => {
  await User.update(
    { password: hashedPassword },
    {
      where: { id: userId },
    },
  );
};
