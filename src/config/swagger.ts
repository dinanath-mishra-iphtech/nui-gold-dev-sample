import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

/**
 * @fastify/swagger — OpenAPI spec generation options.
 */
export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "NUI Gold API",
      description:
        "REST API for the NUI Gold platform — products, inventory, warehouses, users & authentication.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://192.168.1.146:3000",
        description: "Local development server",
      },
      {
        url: "http://192.168.1.122:3000",
        description: "Local development server II",
      },
    ],
    tags: [
      { name: "Products", description: "Product catalog management" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
    },
  },
};

/**
 * @fastify/swagger-ui — Swagger UI rendering options.
 */
export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
    persistAuthorization: true,
  },
  staticCSP: false,
};
