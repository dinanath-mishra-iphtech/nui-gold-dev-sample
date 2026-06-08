import { FastifyInstance } from "fastify";
import {
  sendOtpHandler,
  verifyOtpHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./auth.controller";
import {
  sendOtpSchema,
  verifyOtpRouteSchema,
  forgotPasswordRouteSchema,
  resetPasswordRouteSchema,
} from "./auth.schema";

export async function authRoutes(app: FastifyInstance) {
  // OTP routes
  app.post("/send-otp", { schema: sendOtpSchema }, sendOtpHandler);
  app.post("/verify-otp", { schema: verifyOtpRouteSchema }, verifyOtpHandler);

  // Password reset routes
  app.post("/forgot-password", { schema: forgotPasswordRouteSchema }, forgotPasswordHandler);
  app.post("/reset-password", { schema: resetPasswordRouteSchema }, resetPasswordHandler);
}
