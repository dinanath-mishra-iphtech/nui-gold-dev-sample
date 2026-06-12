import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service";
import { addUserSchema, changePasswordSchema, needHelpSchema, registerInputSchema, setPasswordSchema, updateProfileSchema } from "./user.validation";

export class UserController {

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerInputSchema.parse(request.body);
      const user = await UserService.registerTrader(body);
      return reply.status(201).send({ success: true, data: user });
    } catch (error: any) {
      const isDuplicate = error.message.includes("already exists");
      return reply.status(isDuplicate ? 409 : 400).send({ success: false, message: error.message });
    }
  }

  static async setPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedData = setPasswordSchema.parse(request.body);
      const result = await UserService.setPassword(parsedData);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  }

  static async sendSetPasswordLink(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = request.body as { email: string };
      const result = await UserService.sendSetPasswordLink(email);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  }

  static async getBusinessProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const business = await UserService.getBusinessProfile(userId);
      return reply.status(200).send({
        success: true,
        data: business
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message
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


  static async addUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const traderId = request.user.id;
      const body = addUserSchema.parse(request.body);
      const result = await UserService.addUser(traderId, body);
      return reply.status(201).send({
        success: true,
        ...result
      });

    } catch (error: any) {
      const isDuplicate = error.message.includes("already exists");
      return reply.status(isDuplicate ? 409 : 400).send({
        success: false,
        message: error.message,
      });
    }
  }


  static async removeUser(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    try {
      const traderId = request.user.id;
      const targetUserId = Number(request.params.userId);
      const result = await UserService.removeUser(traderId, targetUserId);
      return reply.status(200).send({ success: true, ...result });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  }

  static async needHelp(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const { subject, description } = needHelpSchema.parse(request.body);

      await UserService.needHelp(userId, subject, description);

      return reply.status(200).send({
        success: true,
        message: "Your query has been submitted successfully.",
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }



}