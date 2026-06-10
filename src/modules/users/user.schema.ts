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


// ── GET /getBusinessProfile ───────────────────────────────────────────
export const getBusinessProfileSchema = {
  description: "Get business profile of the logged-in user",
  tags: ["Users"],
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: { type: "object", additionalProperties: true },
      },
    },
    404: errorResponse("User not found"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── PATCH /profile ────────────────────────────────────────────────────
export const updateProfileSwaggerSchema = {
  description: "Update profile of the logged-in user",
  tags: ["Users"],
  body: {
    type: "object",
    properties: {
      first_name: { type: "string" },
      last_name: { type: "string" },
      email: { type: "string", format: "email" },
      phone: { type: "string", nullable: true },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: { type: "object", additionalProperties: true },
      },
    },
    400: errorResponse("Bad Request"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── PATCH /updatePassword ─────────────────────────────────────────────
export const changePasswordSwaggerSchema = {
  description: "Change password of the logged-in user",
  tags: ["Users"],
  body: {
    type: "object",
    required: ["currentPassword", "newPassword"],
    properties: {
      currentPassword: { type: "string", minLength: 1 },
      newPassword: { type: "string", minLength: 8 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
      },
    },
    400: errorResponse("Invalid current password"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── POST /add-user ────────────────────────────────────────────────────
export const addUserSwaggerSchema = {
  description: "Add a new employee under the logged-in trader's business",
  tags: ["Users"],
  body: {
    type: "object",
    required: ["first_name", "last_name", "email", "role", "phone"],
    properties: {
      first_name: { type: "string", minLength: 2 },
      last_name: { type: "string", minLength: 2 },
      email: { type: "string", format: "email" },
      role: { type: "string", enum: ["trading", "viewer"] },
      phone: { type: "string" },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
      },
    },
    400: validationErrorResponse,
    409: errorResponse("User already exists"),
    500: errorResponse("Internal Server Error"),
  },
};


// ── DELETE /remove-user/:userId ───────────────────────────────────────
export const removeUserSchema = {
  description: "Remove an employee from the logged-in trader's business",
  tags: ["Users"],
  params: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: { type: "integer" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
      },
    },
    404: errorResponse("User not found"),
    500: errorResponse("Internal Server Error"),
  },
};