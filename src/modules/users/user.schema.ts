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

// ── Schema: POST / (Register Trader) ─────────────────────────────────
export const createUserSchema = {
  description: "Register a new trader with business info and employees",
  tags: ["Users"],
  body: {
    type: "object",
    required: ["business_info", "employees"],
    properties: {
      business_info: {
        type: "object",
        required: [
          "business_name",
          "first_name",
          "last_name",
          "physical_street_address",
          "city",
          "state",
          "postal",
          "country",
          "email",
          "aml_plan_exists",
          "independent_audit_conducted",
          "aml_training_provided",
        ],
        properties: {
          business_name: { type: "string", minLength: 2 },
          first_name: { type: "string", minLength: 2 },
          last_name: { type: "string", minLength: 2 },
          contact_number: { type: "string", minLength: 10, maxLength: 15, nullable: true },
          physical_street_address: { type: "string", minLength: 5 },
          city: { type: "string", minLength: 2 },
          state: { type: "string", minLength: 2 },
          postal: { type: "string", minLength: 2 },
          country: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          resale_certificate: {
            type: "object",
            description: "Resale certificate details including the signature URL",
            properties: {
              certificate_number: { type: "string", description: "Resale certificate number" },
              state: { type: "string", description: "State of issuance" },
              expiry_date: { type: "string", format: "date", description: "Certificate expiry date" },
              signature_url: {
                type: "string",
                description: "URL of the uploaded signature image (from POST /api/upload with type=signature_image)",
                example: "/uploads/signatures/a1b2c3d4.png",
              },
            },
            additionalProperties: true,
          },
          aml_plan_exists: { type: "boolean" },
          independent_audit_conducted: { type: "boolean" },
          aml_training_provided: { type: "boolean" },
          audit_details: { type: "object", additionalProperties: true },
          signed_trading_document_url: {
            type: "string",
            nullable: true,
            description: "URL of the uploaded signed trading document (from POST /api/upload with type=trading_document)",
            example: "/uploads/signed-trading-documents/e5f6g7h8.pdf",
          },
          status: { type: "string", default: "pending" },
          tier: { type: "string", default: "" },
          credit_limit: { type: "string", default: "0" },
        },
      },
      employees: {
        type: "array",
        items: {
          type: "object",
          required: ["first_name", "last_name", "email", "role", "phone"],
          properties: {
            first_name: { type: "string", minLength: 2 },
            last_name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["trading", "viewer", "admin", "trader"] },
            phone: { type: "string" },
          },
        },
      },
    },
  },
  response: {
    201: {
      description: "Registration successful",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            message: { type: "string" },
            business: { type: "object", additionalProperties: true },
            updatedUser: { type: "object", additionalProperties: true },
            employees: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
    },
    400: validationErrorResponse,
    409: errorResponse("Business or employee email already exists"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: POST /set-password ───────────────────────────────────────
export const setPasswordRouteSchema = {
  description: "Set password using the registration token",
  tags: ["Users"],
  body: {
    type: "object",
    required: ["token", "new_password"],
    properties: {
      token: { type: "string", minLength: 1, nullable: true, description: "Password-set token received via email" },
      new_password: { type: "string", minLength: 6, description: "New password (min 6 characters)" },
    },
  },
  response: {
    200: {
      description: "Password set successfully",
      type: "object",
      properties: {
        message: { type: "string", example: "Password set successfully" },
      },
    },
    400: validationErrorResponse,
    404: errorResponse("Invalid or expired token"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: POST /login ──────────────────────────────────────────────
export const loginRouteSchema = {
  description: "Authenticate a user with email and password. On success, sends an OTP and returns a login session token (no auth tokens yet — those are issued after OTP verification via POST /api/auth/verify-otp).",
  tags: ["Users"],
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
  response: {
    200: {
      description: "Credentials verified, OTP sent",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Credentials verified. OTP sent for verification." },
        data: {
          type: "object",
          properties: {
            accessToken: { type: "string", description: "JWT access token" },
            login_session_token: { type: "string", description: "Short-lived JWT proving credential validation — required for verify-otp and send-otp (resend)" },
            email: { type: "string", description: "Masked email address", example: "jo***@example.com" },
            phone: { type: "string", description: "Masked phone number (trader only)", example: "+91XXXXX3210" },
            expiresInSeconds: { type: "integer", description: "OTP validity in seconds", example: 300 },
          },
        },
      },
    },
    400: validationErrorResponse,
    401: errorResponse("Invalid credentials"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: GET / (List Users) ───────────────────────────────────────
export const getAllUsersSchema = {
  description: "Retrieve all users with their addresses and businesses",
  tags: ["Users"],
  response: {
    200: {
      description: "List of users",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string", format: "email" },
              status: { type: "string" },
              addresses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    user_id: { type: "integer" },
                    street_address: { type: "string" },
                    city: { type: "string" },
                    state: { type: "string" },
                    postal_code: { type: "string" },
                    country: { type: "string" },
                  },
                },
              },
              business: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  business_name: { type: "string" },
                  email: { type: "string" },
                  status: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    500: errorResponse("Internal Server Error"),
  },
};

export const getAllVendorsSchema = {
  description: "Retrieve all vendors with their addresses",
  tags: ["Users"],
  response: {
    200: {
      description: "List of vendors",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string", format: "email" },
              contact_number: { type: "string" },
              physical_street_address: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              country: { type: "string" },
              postal: { type: "string" },
              status: { type: "string" },
            },
          },
        },
      },
    },
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: GET /:id (Get User By ID) ────────────────────────────────
export const getUserByIdSchema = {
  description: "Retrieve a single user by ID with addresses and business",
  tags: ["Users"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", description: "User ID" },
    },
  },
  response: {
    200: {
      description: "User found",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string", format: "email" },
            status: { type: "string" },
            role: { type: "string" },
            is_email_verified: { type: "boolean" },
            addresses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  user_id: { type: "integer" },
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  postal_code: { type: "string" },
                  country: { type: "string" },
                },
              },
            },
            business: {
              type: "object",
              properties: {
                id: { type: "integer" },
                business_name: { type: "string" },
                email: { type: "string" },
                status: { type: "string" },
              },
            },
          },
        },
      },
    },
    404: errorResponse("User not found"),
    500: errorResponse("Internal Server Error"),
  },
};

export const createAddressSchema = {
  description: "Create address",
  tags: ["Addresses"],

  body: {
    type: "object",
    required: [
      "address_line_1",
      "address_line_2",
      "city",
      "state",
      "pin_code",
      "country",
      "type",
      "contact_number",
      "is_default",
    ],
    properties: {
      address_line_1: { type: "string" },
      address_line_2: { type: "string" },
      landmark: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      pin_code: { type: "string" },
      country: { type: "string" },
      type: {
        type: "integer",
        enum: [1, 2, 3, 4],
        description:
          "1=Ship To Me, 2=Drop Ship, 3=Hold Until I Provide Shipping Instructions, 4=Pick Up, 5=Store at Depository",
      },
      contact_number: { type: "string" },
      is_default: { type: "boolean", default: false }
    },
  },

  response: {
    201: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            user_id: { type: "integer" },
            business_id: { type: "integer" },
            address_line_1: { type: "string" },
            address_line_2: { type: "string" },
            landmark: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            pin_code: { type: "string" },
            country: { type: "string" },
            type: { type: "integer" },
            contact_number: { type: "string" },
            is_default: { type: "boolean" },
          },
        },
      },
    },
    400: errorResponse("Bad Request"),
    404: errorResponse("User not found"),
    500: errorResponse("Internal Server Error"),
  },
};

export const updateAddressSchema = {
  description: "Update address",
  tags: ["Addresses"],

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },

  body: {
    type: "object",
    properties: {
      address_line_1: { type: "string" },
      address_line_2: { type: "string" },
      landmark: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      pin_code: { type: "string" },
      country: { type: "string" },
      type: { type: "integer", default: 1 },
      contact_number: { type: "string" },
      is_default: { type: "boolean" },
    },
  },
};

export const deleteAddressSchema = {
  description: "Delete address",
  tags: ["Addresses"],

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },
};

export const getAddressesSchema = {
  description:
    "Get all addresses of a user",
  tags: ["Addresses"],

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "integer",
      },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              user_id: { type: "integer" },
              business_id: { type: "integer" },
              address_line_1: { type: "string" },
              address_line_2: { type: "string" },
              landmark: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              pin_code: { type: "string" },
              country: { type: "string" },
              type: { type: "integer" },
              contact_number: { type: "string" },
              is_default: { type: "boolean"}
            },
          },
        },
      },
    },

    404: errorResponse("User not found"),
    500: errorResponse("Internal Server Error"),
  },
};
