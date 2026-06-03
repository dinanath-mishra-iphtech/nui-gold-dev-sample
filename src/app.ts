import Fastify, { fastify } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { routes } from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { logger } from "./config/logger";
import fastifyJwt from "@fastify/jwt";
import multipart from '@fastify/multipart';
import { env } from "./config/env";

import fastifyStatic from "@fastify/static";
import path from "path";

export const app = Fastify({
  loggerInstance: logger,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});


app.register(
  fastifyStatic,
  {
    root: path.join(
      process.cwd(),
      "uploads"
    ),
    prefix:
      "/uploads/",
  }
);



app.register(cors);
app.register(helmet);
app.register(routes);
app.setErrorHandler(errorHandler);
