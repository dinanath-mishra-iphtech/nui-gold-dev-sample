import "dotenv/config";

export const env = {
  /** Maximum OTP requests allowed per phone per hour */
  OTP_RATE_LIMIT_PER_HOUR: Number(process.env.OTP_RATE_LIMIT_PER_HOUR) || 5,

  /** OTP validity duration in minutes */
  OTP_EXPIRY_MINUTES: Number(process.env.OTP_EXPIRY_MINUTES) || 5,

  /** Maximum incorrect OTP verification attempts before lockout */
  OTP_MAX_ATTEMPTS: Number(process.env.OTP_MAX_ATTEMPTS) || 5,

  /** Secret key for signing JWTs */
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",

  /** Password-reset token validity in minutes */
  RESET_TOKEN_EXPIRY_MINUTES:
    Number(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 15,

  /** Frontend base URL used in reset-password links */
  FRONT_END_URL: process.env.FRONT_END_URL || "http://localhost:3000",

  /** Twilio Account SID */
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",

  /** Twilio Auth Token */
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",

  /** Twilio phone number (E.164 format, e.g., +1234567890) */
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",

  /** SMTP user for email provider (Gmail address) */
  SMTP_USER: process.env.SMTP_USER || "",

  /** SMTP password for email provider (Gmail app password) */
  SMTP_PASS: process.env.SMTP_PASS || "",

  /** AWS S3 region (e.g., us-east-1) */
  AWS_S3_REGION: process.env.AWS_S3_REGION || "us-east-1",

  /** AWS S3 bucket name for file uploads */
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "",

  /** AWS IAM access key ID */
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",

  /** AWS IAM secret access key */
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
};
