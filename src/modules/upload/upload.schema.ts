export const uploadFileSchema = {
  summary: "Upload a file",
  description:
    "Send a file as `multipart/form-data` with two fields: `type` and `file`.\n\n" +
    "**Supported types:**\n\n" +
    "| Type | Accepted formats | Max size | Store returned `fileUrl` in |\n" +
    "|------|-----------------|----------|--------------------------|\n" +
    "| `signature_image` | PNG, JPEG, WEBP | 1 MB | `resale_certificate.signature_url` |\n" +
    "| `product_image` | PNG, JPEG, WEBP | 1 MB | `products.image_url` |\n" +
    "| `trading_document` | PDF | 5 MB | `signed_trading_document_url` |",
  tags: ["Upload"],
  consumes: ["multipart/form-data"],
  response: {
    200: {
      description: "File uploaded successfully",
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "File uploaded successfully." },
        data: {
          type: "object",
          properties: {
            type: { type: "string", example: "signature_image" },
            originalName: { type: "string", example: "signature.png" },
            fileName: {
              type: "string",
              example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.png",
            },
            fileUrl: {
              type: "string",
              example:
                "/uploads/signatures/a1b2c3d4-e5f6-7890-abcd-ef1234567890.png",
            },
            mimeType: { type: "string", example: "image/png" },
          },
        },
      },
    },
    400: {
      description: "Validation error",
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string" },
      },
    },
  },
};