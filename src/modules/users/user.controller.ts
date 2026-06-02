import { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "./user.service";

import { createAddressSchema, createUserSchema, loginSchema, registerInputSchema, setPasswordSchema } from "./user.validation";

export class UserController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = registerInputSchema.parse(request.body);

    const user = await UserService.registerTrader(body);

    return reply.status(201).send({
      success: true,
      data: user,
    });
  }

  static async setPassword(request: FastifyRequest, reply: FastifyReply) {

    const parsedData = setPasswordSchema.parse(request.body);

    const result = await UserService.setPassword(parsedData);

    return reply.status(200).send(result);

  }

  static async login(request: FastifyRequest, reply: FastifyReply,) {

    const body = loginSchema.parse(
      request.body
    );

    const user =
      await UserService.login(
        body.email,
        body.password,
      );

    const accessToken = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN,
      },
    );

    const refreshToken = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn:
          process.env.REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    return reply.send({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  }

  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await UserService.getUsers();

    return reply.status(200).send({
      success: true,
      data: users,
    });
  }

  static async getUserById(request: FastifyRequest<{ Params: { id: string; }; }>, reply: FastifyReply) {
    const user = await UserService.getUserById(Number(request.params.id));

    return reply.status(200).send({
      success: true,
      data: user,
    });
  }

  static async createAddress(request: FastifyRequest, reply: FastifyReply) {

    try {

      // ─── Validate Request Body ────────────────────
      const body = createAddressSchema.parse(request.body);

      const address = await UserService.createAddress(body);

      // ─── Success Response ─────────────────────────
      return reply.status(201).send({
        success: true,
        message: "Address created successfully.",
        data: {
          address_id: address.id,
          ...address.toJSON(),
        },
      });

    } catch (error: any) {
      request.log.error(error);
      // ─── Zod Validation Errors ────────────────────
      if (error.name === "ZodError") {

        return reply.status(400).send({
          success: false,
          message: "Validation failed.",
          errors: error.errors,
        });
      }
      // ─── Generic Errors ───────────────────────────
      return reply.status(500).send({
        success: false,
        message:
          error.message ||
          "Failed to create address.",
      });
    }
  }

}
