import { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "./user.service";
import { sendOtp } from "../auth/auth.service";
import { env } from "../../config/env";

import { changePasswordSchema, createAddressSchema, loginSchema, registerInputSchema, setPasswordSchema, updateAddressSchema, updateProfileSchema } from "./user.validation";

export class UserController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerInputSchema.parse(request.body);

      const user =
        await UserService.registerTrader(body);

      return reply.status(201).send({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async setPassword(request: FastifyRequest, reply: FastifyReply) {

    try {
      const parsedData = setPasswordSchema.parse(request.body);

      const result = await UserService.setPassword(parsedData);

      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }

  }

  static async sendSetPasswordLink(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const { email } = request.body as {
        email: string;
      };

      const result =
        await UserService.sendSetPasswordLink(
          email,
        );

      return reply.status(200).send(
        result,
      );
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply,) {

    try {
      const body = loginSchema.parse(
        request.body
      );

      // Step 1: Validate credentials (throws if invalid)
      const user =
        await UserService.login(
          body.email,
          body.password,
        );

      if (!user.is_email_verified) {
        await sendOtp(user.email, true);
        return reply.send({
          message: "First verify your email",
          data: user
        })
      }

      if (!user.is_contact_number_verified) {
        await sendOtp(user.email, false);
        return reply.send({
          message: "First verify your contact number",
          data: user
        })
      }

      let otpResult = await sendOtp(user.email, body.is_email);

      // Step 2: Send OTP to the user (email + SMS for traders, email-only for admins)
      // const otpResult = await sendOtp(body.email,true);

      // Step 3: Issue a short-lived login session token (proves credentials were validated)
      const loginSessionToken = await reply.jwtSign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          purpose: "login-otp",
        },
        {
          expiresIn: `${env.OTP_EXPIRY_MINUTES}m`,
        },
      );

      return reply.status(200).send({
        success: true,
        message: "Credentials verified. OTP sent for verification.",
        data: {
          login_session_token: loginSessionToken,
          ...otpResult,
        },
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await UserService.getUsers();

      return reply.status(200).send({
        success: true,
        data: users,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async getVendors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await UserService.getVendors();

      return reply.status(200).send({
        success: true,
        data: users,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async getUserById(request: FastifyRequest<{ Params: { id: string; }; }>, reply: FastifyReply) {
    try {
      const user = await UserService.getUserById(Number(request.params.id));

      return reply.status(200).send({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async createAddress(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      const body = createAddressSchema.parse(request.body);

      const address = await UserService.createAddress(userId, body);

      return reply.status(201).send({
        success: true,
        message:
          "Address created successfully",
        data: address,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateAddress(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      const { id } =
        request.params as {
          id: number;
        };

      const body =
        updateAddressSchema.parse(
          request.body
        );

      const address =
        await UserService.updateAddress(
          Number(id),
          userId,
          body
        );

      return reply.send({
        success: true,
        message:
          "Address updated successfully",
        data: address,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteAddress(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      const { id } =
        request.params as {
          id: number;
        };

      await UserService.deleteAddress(
        Number(id),
        userId
      );

      return reply.send({
        success: true,
        message:
          "Address deleted successfully",
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      const { id } = request.params as {
        id: number;
      };

      const addresses =
        await UserService.getAddresses(
          userId,
          Number(id)
        );

      return reply.send({
        success: true,
        data: addresses,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const body = updateProfileSchema.parse(request.body);
      const user = await UserService.updateProfile(userId, body);
      return reply.send({ success: true, data: user });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  }

  static async changePassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const body = changePasswordSchema.parse(request.body);
      await UserService.changePassword(userId, body.currentPassword, body.newPassword);
      return reply.send({ success: true, message: "Password changed successfully" });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  }

}
