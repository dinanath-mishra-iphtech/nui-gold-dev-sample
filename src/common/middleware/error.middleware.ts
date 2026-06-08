import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError, ZodIssue } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../../config/logger";

/**
 * Global error handler for the Fastify application.
 *
 * Handles:
 * - ApiError      → returns the custom statusCode + message
 * - ZodError      → returns 400 with structured validation errors
 * - FastifyError  → uses statusCode from Fastify (e.g. 404 for unknown routes)
 * - Unknown Error → returns generic 500 Internal Server Error
 */
export async function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // ── Structured Business Errors ────────────────────────────────────
  if (error instanceof ApiError) {
    logger.warn(
      { statusCode: error.statusCode, message: error.message, url: request.url },
      "ApiError",
    );

    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }

  // ── Zod Validation Errors ─────────────────────────────────────────
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((e: ZodIssue) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    logger.warn(
      { errors: formattedErrors, url: request.url },
      "Validation error",
    );

    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  // ── Fastify-native Errors (e.g. 404 Not Found, JSON parse errors) ─
  if ("statusCode" in error && typeof (error as FastifyError).statusCode === "number") {
    const fastifyError = error as FastifyError;

    logger.warn(
      { statusCode: fastifyError.statusCode, message: fastifyError.message, url: request.url },
      "Fastify error",
    );

    return reply.status(fastifyError.statusCode ?? 500).send({
      success: false,
      message: fastifyError.message,
    });
  }

  // ── Unexpected / Unknown Errors ───────────────────────────────────
  logger.error(
    { error, url: request.url, method: request.method },
    "Unhandled error",
  );

  return reply.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
}
