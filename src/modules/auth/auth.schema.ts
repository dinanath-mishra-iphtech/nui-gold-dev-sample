// ── Shared response schemas ──────────────────────────────────────────
const errorResponse = (description: string) => ({
  description,
  type: "object" as const,
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string" },
  },
});

const validationErrorResponse = {
  description: "Validation failed",
  type: "object" as const,
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed" },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

// ── Schema: POST /send-otp ───────────────────────────────────────────
export const sendOtpSchema = {
  description: "Resend a 6-digit OTP using a login session token (issued after credential validation). Admin users receive OTP via email only; trader users receive OTP via both email and SMS.",
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["login_session_token"],
    properties: {
      login_session_token: {
        type: "string",
        description: "Short-lived JWT issued after successful login credential validation",
      },
    },
  },
  response: {
    200: {
      description: "OTP sent successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "OTP sent successfully" },
        data: {
          type: "object",
          properties: {
            email: { type: "string", description: "Masked email address", example: "jo***@example.com" },
            phone: { type: "string", description: "Masked phone number (trader only)", example: "+91XXXXX3210" },
            expiresInSeconds: { type: "integer", description: "OTP validity in seconds", example: 300 },
          },
        },
      },
    },
    400: validationErrorResponse,
    401: errorResponse("Invalid or expired login session token"),
    404: errorResponse("No account found"),
    429: errorResponse("Too many OTP requests"),
    500: errorResponse("Failed to send OTP"),
  },
};

// ── Schema: POST /verify-otp ─────────────────────────────────────────
export const verifyOtpRouteSchema = {
  description: "Verify email, phone, or login OTP",
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["otp", "is_email"],
    properties: {
      login_session_token: { type: "string" },

      email: {
        type: "string",
        format: "email",
      },
      otp: {
        type: "string",
        minLength: 6,
        maxLength: 6,
        pattern: "^\\d{6}$",
      },

      is_email: {
        type: "boolean",
        description: "true=email OTP, false=phone OTP",
      },
    },
  },
  response: {
    200: {
      description: "OTP verified successfully",
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                first_name: { type: "string" },
                last_name: { type: "string" },
                email: { type: "string", format: "email" },
                phone: { type: "string" },
                role: {
                  type: "string",
                  enum: ["trader", "trading", "viewer", "admin"],
                },
                status: { type: "string" },
                is_email_verified: { type: "boolean" },
                is_contact_number_verified: { type: "boolean" },
              },
            },
          },
        },
      },
    },
    400: validationErrorResponse,
    401: errorResponse("Invalid OTP or session token"),
    404: errorResponse("User not found"),
    429: errorResponse("Too many failed attempts"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: POST /forgot-password ────────────────────────────────────
export const forgotPasswordRouteSchema = {
  description: "Send a password reset email. Returns a generic success message regardless of whether the email exists (prevents enumeration).",
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email", description: "Registered email address" },
    },
  },
  response: {
    200: {
      description: "Reset email sent (or silently ignored if email not found)",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "If an account exists with this email, a password reset link has been sent.",
        },
      },
    },
    400: validationErrorResponse,
    500: errorResponse("Failed to send reset email"),
  },
};

// ── Schema: POST /reset-password ─────────────────────────────────────
export const resetPasswordRouteSchema = {
  description: "Reset the user password using a JWT reset token",
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["token", "new_password"],
    properties: {
      token: { type: "string", minLength: 1, description: "JWT reset token from the email link" },
      new_password: { type: "string", minLength: 6, description: "New password (min 6 characters)" },
    },
  },
  response: {
    200: {
      description: "Password reset successful",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Password has been reset successfully." },
      },
    },
    400: errorResponse("Invalid or expired reset token"),
    500: errorResponse("Internal Server Error"),
  },
};
