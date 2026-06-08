import Fastify  from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import path from "path";
import { routes } from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { logger } from "./config/logger";
import fastifyJwt from "@fastify/jwt";
import { env } from "./config/env";

export const app = Fastify({
  loggerInstance: logger,
  //logger: logger,
  ajv: {
    customOptions: {
      // Allow OpenAPI keywords (example, nullable, etc.) that are not
      // part of the JSON Schema standard but used by Swagger / OpenAPI.
      keywords: ["example"],
    },
  },
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(cors, {
  origin: true,
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
  ],
});

app.register(helmet, {
  contentSecurityPolicy: false,
});


// ── File upload (multipart) support ──────────────────────────────────
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB global max
  },
});

// ── Serve uploaded files statically ──────────────────────────────────
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
  decorateReply: false,
});


app.register(routes);
app.setErrorHandler(errorHandler);
