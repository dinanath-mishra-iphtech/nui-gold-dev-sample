import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../config/logger";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {

  logger.error(error);

  // Custom App Errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }

  // Zod Validation Errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  // Default Errors
  return reply.status(500).send({
    success: false,
    message: error.message,
  });
}
