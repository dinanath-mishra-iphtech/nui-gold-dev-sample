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

// ── Shared product properties ────────────────────────────────────────
const productProperties = {
  id: { type: "integer" },
  name: { type: "string" },
  grade: { type: "string", nullable: true },
  assetType: {
    type: "string",
    enum: ["Gold", "Silver", "Platinum", "Palladium", "Specials"],
    nullable: true,
  },
  sku: { type: "string" },
  weight: { type: "number", nullable: true },
  productFamilyId: {
    type: "integer",
    nullable: true,
    description: "Foreign key referencing product_families table",
  },
  availability: {
    type: "string",
    enum: ["Live", "Limited", "Delayed"],
    nullable: true,
  },
  qtyAllowToOversell: { type: "integer", nullable: true },
  allowSellingOnPortal: { type: "boolean" },
  iraAcceptable: { type: "boolean" },
  description: { type: "string", nullable: true },
  images: { type: "array", items: { type: "string", format: "uri" } },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
};

// ── Schema: GET / (List Products for Dropdown) ──────────────────────
export const listProductsRouteSchema = {
  description: "Retrieve all products (id, name, sku) for dropdown population",
  tags: ["Products"],
  response: {
    200: {
      description: "List of products",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              sku: { type: "string" },
            },
          },
        },
      },
    },
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: POST / (Create Product) ──────────────────────────────────
export const createProductRouteSchema = {
  description: "Create a new product. SKU must be unique.",
  tags: ["Products"],
  body: {
    type: "object",
    required: ["name", "sku"],
    properties: {
      name: { type: "string", minLength: 1, description: "Product name" },
      grade: { type: "string", description: "Product grade" },
      assetType: {
        type: "string",
        enum: ["Gold", "Silver", "Platinum", "Palladium", "Specials"],
      },
      sku: { type: "string", minLength: 1, description: "Unique Stock Keeping Unit" },
      weight: { type: "number", exclusiveMinimum: 0, description: "Weight in oz" },
      productFamilyId: {
        type: "integer",
        description: "Product family ID (reference to product_families table)",
      },
      availability: {
        type: "string",
        enum: ["Live", "Limited", "Delayed"],
      },
      qtyAllowToOversell: { type: "integer", minimum: 0 },
      allowSellingOnPortal: { type: "boolean", default: false },
      iraAcceptable: { type: "boolean", default: false },
      description: { type: "string" },
      images: {
        type: "array",
        items: { type: "string" },
        default: [],
      },
    },
  },
  response: {
    201: {
      description: "Product created successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: { type: "object", properties: productProperties },
      },
    },
    400: validationErrorResponse,
    409: errorResponse("A product with this SKU already exists"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: GET /:id (Get Product) ───────────────────────────────────
export const getProductRouteSchema = {
  description: "Retrieve a single product by ID",
  tags: ["Products"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", description: "Product ID (positive integer)" },
    },
  },
  response: {
    200: {
      description: "Product found",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: { type: "object", properties: productProperties },
      },
    },
    400: errorResponse("Invalid product ID"),
    404: errorResponse("Product not found"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: PUT /:id (Update Product) ────────────────────────────────
export const updateProductRouteSchema = {
  description: "Update an existing product. All body fields are optional. If SKU is changed, it must be unique.",
  tags: ["Products"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", description: "Product ID (positive integer)" },
    },
  },
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      grade: { type: "string" },
      assetType: {
        type: "string",
        enum: ["Gold", "Silver", "Platinum", "Palladium", "Specials"],
      },
      sku: { type: "string", minLength: 1 },
      weight: { type: "number", exclusiveMinimum: 0 },
      productFamilyId: {
        type: "integer",
        description: "Product family ID (reference to product_families table)",
      },
      availability: {
        type: "string",
        enum: ["Live", "Limited", "Delayed"],
      },
      qtyAllowToOversell: { type: "integer", minimum: 0 },
      allowSellingOnPortal: { type: "boolean" },
      iraAcceptable: { type: "boolean" },
      description: { type: "string" },
      images: {
        type: "array",
        items: { type: "string", format: "uri" },
      },
    },
  },
  response: {
    200: {
      description: "Product updated successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: { type: "object", properties: productProperties },
      },
    },
    400: validationErrorResponse,
    404: errorResponse("Product not found"),
    409: errorResponse("A product with this SKU already exists"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: GET /pricing (Product Pricing for Frontend) ──────────────

const pricingProperties = {
  priceId: { type: "integer", description: "Price entry ID" },
  type: {
    type: "string",
    enum: ["relative", "fixed"],
    description: "Pricing type. Frontend uses this to decide how to calculate prices.",
  },
  bidRelativeValue: {
    type: "number",
    nullable: true,
    description: "Bid premium percentage (e.g. -2 means Spot - 2%). Use for calculation: spot + (spot × value / 100)",
  },
  askRelativeValue: {
    type: "number",
    nullable: true,
    description: "Ask premium percentage (e.g. 3 means Spot + 3%). Use for calculation: spot + (spot × value / 100)",
  },
  bidFixedValue: {
    type: "number",
    nullable: true,
    description: "Fixed bid price. When type is 'fixed', this is the final bid price.",
  },
  askFixedValue: {
    type: "number",
    nullable: true,
    description: "Fixed ask price. When type is 'fixed', this is the final ask price.",
  },
  notes: { type: "string", nullable: true },
};

const productPricingItemProperties = {
  productId: { type: "integer" },
  productName: { type: "string" },
  productSku: { type: "string" },
  weight: { type: "number", nullable: true, description: "Weight in oz" },
  assetType: {
    type: "string",
    enum: ["Gold", "Silver", "Platinum", "Palladium", "Specials"],
    nullable: true,
    description: "Determines which spot price to use for calculation",
  },
  productFamilyId: { type: "integer", nullable: true, description: "Product family FK" },
  pricing: {
    type: "object",
    properties: pricingProperties,
    description: "Pricing formula configuration for this product in the requested tier",
  },
};

export const getProductPricingRouteSchema = {
  description:
    "Get all products with their pricing formulas for a given tier. " +
    "The frontend uses these formulas combined with live spot prices " +
    "(from the WebSocket) to calculate and display bid/ask values. " +
    "For relative pricing: compute price = spot + (spot × relativeValue / 100). " +
    "For fixed pricing: the fixed values are the final prices.",
  tags: ["Products"],
  querystring: {
    type: "object",
    required: ["tier"],
    properties: {
      tier: {
        type: "string",
        enum: ["Tier 1", "Tier 2", "Tier 3"],
        description: "Pricing tier to filter by",
      },
    },
  },
  response: {
    200: {
      description: "Products with pricing formulas",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        tier: { type: "string", enum: ["Tier 1", "Tier 2", "Tier 3"] },
        data: {
          type: "array",
          items: { type: "object", properties: productPricingItemProperties },
        },
      },
    },
    400: errorResponse("Invalid or missing tier"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: GET /inventory (Inventory Dashboard Products) ────────────

export const getInventoryProductsRouteSchema = {
  description:
    "Get products for the inventory dashboard, filtered by product family. " +
    "Returns product card details (name, images, availability, IRA eligibility, etc.). " +
    "Live rates are fetched from a separate API.",
  tags: ["Products"],
  body: {
    type: "object",
    required: ["productFamilyId"],
    properties: {
      productFamilyId: {
        type: "integer",
        description: "Product family ID to filter by",
      },
    },
  },
  response: {
    200: {
      description: "Products for the inventory dashboard",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        productFamily: {
          type: "object",
          nullable: true,
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
        },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              sku: { type: "string" },
              weight: { type: "number", nullable: true },
              assetType: {
                type: "string",
                enum: ["Gold", "Silver", "Platinum", "Palladium", "Specials"],
                nullable: true,
              },
              availability: {
                type: "string",
                enum: ["Live", "Limited", "Delayed"],
                nullable: true,
              },
              iraAcceptable: { type: "boolean" },
              description: { type: "string", nullable: true },
              images: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
    400: errorResponse("Invalid or missing productFamilyId"),
    500: errorResponse("Internal Server Error"),
  },
};

// ── Schema: POST /wishlist ──────────────────────────────────────────
export const addToWishlistRouteSchema = {
  description: "Add a product to a business wishlist",
  tags: ["Wishlist"],
  body: {
    type: "object",
    required: ["business_id", "product_id"],
    properties: {
      business_id: {
        type: "integer",
        description: "Business ID",
        example: 2,
      },
      product_id: {
        type: "integer",
        description: "Product ID",
        example: 1,
      },
    },
    example: {
      business_id: 2,
      product_id: 1,
    },
  },
  response: {
    201: {
      description: "Product added to wishlist successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Product added to wishlist successfully",
        },
      },
    },
    400: validationErrorResponse,
    404: errorResponse("Business or Product not found"),
    409: errorResponse("Product already exists in wishlist"),
    500: errorResponse("Internal Server Error"),
  },
};

export const removeFromWishlistRouteSchema = {
  description: "Remove a product from a business wishlist",
  tags: ["Wishlist"],
  params: {
    type: "object",
    required: ["business_id", "product_id"],
    properties: {
      business_id: {
        type: "integer",
        description: "Business ID",
        example: 2,
      },
      product_id: {
        type: "integer",
        description: "Product ID",
        example: 1,
      },
    },
  },
  response: {
    200: {
      description: "Product removed from wishlist successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Product removed from wishlist successfully",
        },
      },
    },
    400: errorResponse("Invalid business_id or product_id"),
    404: errorResponse("Wishlist item not found"),
    500: errorResponse("Internal Server Error"),
  },
};

export const getWishlistRouteSchema = {
  description: "Retrieve all wishlist products for a business",
  tags: ["Wishlist"],
  params: {
    type: "object",
    required: ["business_id"],
    properties: {
      business_id: {
        type: "integer",
        description: "Business ID",
        example: 2,
      },
    },
  },
  response: {
    200: {
      description: "Wishlist retrieved successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: productProperties,
          },
        },
      },
    },
    400: errorResponse("Invalid business_id"),
    404: errorResponse("Business not found"),
    500: errorResponse("Internal Server Error"),
  },
};
