import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { routes } from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { logger } from "./config/logger";
import fastifyJwt from "@fastify/jwt";
import { env } from "./config/env";

export const app = Fastify({
  loggerInstance: logger,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(swagger, {
  openapi: {
    info: {
      title: "NUI Gold API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
});

app.register(swaggerUi, {
  routePrefix: "/documentation",
});

app.register(cors);
app.register(helmet, {
  contentSecurityPolicy: false,
});
app.register(routes);
app.setErrorHandler(errorHandler);