import { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "./user.service";

import { createUserSchema, loginSchema, registerInputSchema, setPasswordSchema } from "./user.validation";
import { emailProvider } from "../../common/utils/email.provider";
import { buildKycApprovedTemplate } from "../../common/templates/kyc-approved.template";
import { buildKycRejectedTemplate } from "../../common/templates/kyc-rejected.template";

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




  static async testKycEmail(request: FastifyRequest, reply: FastifyReply) {

    const { email, name, status, tier, creditLimit, rejectionReasons } =
      request.body as {
        email: string;
        name: string;
        status: string;
        tier?: string;
        creditLimit?: number;
        rejectionReasons?: string[];
      };

    try {
      await UserService.sendKycEmail(email, name, status, tier, creditLimit, rejectionReasons,);

      return reply.status(200).send({
        success: true,
        message: "Check your mail",
      });


    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }



  static async sendPdfMail(request: FastifyRequest, reply: FastifyReply) {

    const parts = request.parts();

    let email: string | null = null;
    let pdfBuffer: Buffer | null = null;
    let pdfFilename = "document.pdf";

    for await (const part of parts) {
      if (part.type === "field" && part.fieldname === "email") {
        email = part.value as string;
      }

      if (part.type === "file" && part.fieldname === "pdf") {
        if (part.mimetype !== "application/pdf") {
          return reply.status(400).send({
            success: false,
            message: "Only PDF files are accepted.",
          });
        }
        pdfFilename = part.filename || pdfFilename;
        pdfBuffer = await part.toBuffer();
      }
    }

    if (!email) {
      return reply.status(400).send({
        success: false,
        message: "email field is required.",
      });
    }

    if (!pdfBuffer) {
      return reply.status(400).send({
        success: false,
        message: "pdf file is required.",
      });
    }

    await UserService.sendPdfEmail(email, pdfBuffer, pdfFilename);

    return reply.status(200).send({
      success: true,
      message: `PDF sent successfully to ${email}`,
    });
  }


  static async verifyOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, otp } = request.body as {
      email: string;
      name: string;
      otp: string;
    };

    try {
      await UserService.sendOtpEmail(email, name, otp);

      return reply.status(200).send({
        success: true,
        message: "OTP sent successfully, check your mail",
      });

    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }




}