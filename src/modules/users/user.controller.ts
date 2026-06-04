import { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "./user.service";

import { createUserSchema, loginSchema, registerInputSchema, setPasswordSchema } from "./user.validation";
import { Business } from "../../database/models/business.model";

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

  static async approveKyc(request: FastifyRequest<{ Params: { id: string; }; Body: { tier: string; credit_limit: string; }; }>, reply: FastifyReply) {
    const business = await Business.findByPk(Number(request.params.id));

    if (!business) {
      return reply.status(404).send({
        success: false,
        message: "Business not found",
      });
    }

    await business.update({
      tier: request.body.tier,
      credit_limit: request.body.credit_limit,
      status: "active",
    });

    return reply.status(200).send({
      success: true,
      message: "Kyc approved successfully",
      data: business,
    });
  }

  static async rejectKyc(request: FastifyRequest<{ Params: { id: string; }; Body: { reasons: string[]; }; }>, reply: FastifyReply) {
    const business = await Business.findByPk(Number(request.params.id));

    if (!business) {
      return reply.status(404).send({
        success: false,
        message: "Business not found",
      });
    }

    return reply.status(200).send({
      success: true,
      message: "KYC rejected successfully",
      data: business,
    });
  }
}
