import { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "./user.service";

import { createAddressSchema, loginSchema, registerInputSchema, sendOtpSchema, setPasswordSchema, verifyOtpSchema } from "./user.validation";


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

  // ── Step 1: verify password + send OTP ──────────────────
  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = loginSchema.parse(request.body);

    const result = await UserService.login(email, password);

    return reply.status(200).send({
      success: true,
      message: "OTP sent to your email",
      email: result.email,
    });
  }

  // ── Step 2: resend OTP ───────────────────────────────────
  static async sendOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email } = sendOtpSchema.parse(request.body);

    const result = await UserService.sendOtp(email);

    return reply.status(200).send({
      success: true,
      message: "OTP sent successfully",
      email: result.email,
    });
  }


  // ── Step 3: verify OTP + issue JWT (actual login) ────────
  static async verifyOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email, otp } = verifyOtpSchema.parse(request.body);

    const user = await UserService.verifyOtp(email, otp);

    const accessToken = await reply.jwtSign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    const refreshToken = await reply.jwtSign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
    );

    return reply.status(200).send({
      success: true,
      message: "Login successful",
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



  static async sendShipOrTransferNotification(request: FastifyRequest, reply: FastifyReply,) {

    try {
      const parts = request.parts();

      let email: string | null = null;
      let customerName: string | null = null;
      let salesOrderNumber: string | null = null;
      let transferOrShip: string | null = null;
      let dropShipName: string | null = null;
      let trackingNumber: string | null = null;
      let totalAmount: string | null = null;
      let date: string | null = null;

      let pdfBuffer: Buffer | null = null;
      let pdfFilename: string;

      for await (const part of parts) {

        // ─── Handle form fields ─────────────────────────────
        if (part.type === "field") {

          if (part.fieldname === "email") email = part.value as string;
          if (part.fieldname === "customerName") customerName = part.value as string;
          if (part.fieldname === "salesOrderNumber") salesOrderNumber = part.value as string;
          if (part.fieldname === "transferOrShip") transferOrShip = part.value as string;
          if (part.fieldname === "dropShipName") dropShipName = part.value as string;
          if (part.fieldname === "trackingNumber") trackingNumber = part.value as string;
          if (part.fieldname === "totalAmount") totalAmount = part.value as string;
          if (part.fieldname === "date") date = part.value as string;
        }

        // ─── Handle PDF file ───────────────────────────────
        if (part.type === "file" && part.fieldname === "pdf") {

          if (part.mimetype !== "application/pdf") {
            return reply.status(400).send({
              success: false,
              message: "Only PDF files are accepted.",
            });
          }

          pdfBuffer = await part.toBuffer();
        }
      }

      // ─── Build filename after loop ───────────────────────
      pdfFilename = salesOrderNumber
        ? `Sales-Order-${salesOrderNumber}.pdf`
        : "Sales-Order.pdf";

      // ─── Required field validation ───────────────────────
      if (!email) {
        return reply.status(400).send({ success: false, message: "email is required." });
      }

      if (!customerName) {
        return reply.status(400).send({ success: false, message: "customerName is required." });
      }

      if (!salesOrderNumber) {
        return reply.status(400).send({ success: false, message: "salesOrderNumber is required." });
      }

      if (!transferOrShip) {
        return reply.status(400).send({ success: false, message: "transferOrShip is required." });
      }

      if (!totalAmount) {
        return reply.status(400).send({ success: false, message: "totalAmount is required." });
      }

      if (!date) {
        return reply.status(400).send({ success: false, message: "date is required." });
      }

      if (!pdfBuffer) {
        return reply.status(400).send({ success: false, message: "pdf file is required." });
      }

      // ─── Send notification email ─────────────────────────
      await UserService.sendShipOrTransferNotificationEmail({
        email,
        customerName,
        salesOrderNumber,
        transferOrShip: transferOrShip as any,
        dropShipName: dropShipName ?? undefined,
        trackingNumber: trackingNumber ?? undefined,
        totalAmount,
        date,
        pdfBuffer,
        pdfFilename,
      });

      return reply.status(200).send({
        success: true,
        message: `Ship/transfer notification sent successfully to ${email}`,
      });

    } catch (error: any) {

      request.log.error(error);

      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to send ship/transfer notification.",
      });
    }
  }

  static async sendSalesOrderConfirmation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parts = request.parts();

      let email: string | null = null;
      let customerName: string | null = null;
      let salesOrderNumber: string | null = null;
      let totalAmount: string | null = null;

      let pdfBuffer: Buffer | null = null;
      let pdfFilename: string;

      for await (const part of parts) {

        // ─── Handle form fields ─────────────────────────────
        if (part.type === "field") {

          if (part.fieldname === "email") email = part.value as string;
          if (part.fieldname === "customerName") customerName = part.value as string;
          if (part.fieldname === "salesOrderNumber") salesOrderNumber = part.value as string;
          if (part.fieldname === "totalAmount") totalAmount = part.value as string;
        }

        // ─── Handle PDF file ───────────────────────────────
        if (part.type === "file" && part.fieldname === "pdf") {

          if (part.mimetype !== "application/pdf") {
            return reply.status(400).send({
              success: false,
              message: "Only PDF files are accepted.",
            });
          }

          pdfBuffer = await part.toBuffer();
        }
      }

      // ─── Build filename after loop ───────────────────────
      pdfFilename = salesOrderNumber
        ? `Sales-Order-${salesOrderNumber}.pdf`
        : "Sales-Order.pdf";

      // ─── Required field validation ───────────────────────
      if (!email) {
        return reply.status(400).send({ success: false, message: "email is required." });
      }

      if (!customerName) {
        return reply.status(400).send({ success: false, message: "customerName is required." });
      }

      if (!salesOrderNumber) {
        return reply.status(400).send({ success: false, message: "salesOrderNumber is required." });
      }

      if (!totalAmount) {
        return reply.status(400).send({ success: false, message: "totalAmount is required." });
      }

      if (!pdfBuffer) {
        return reply.status(400).send({ success: false, message: "pdf file is required." });
      }

      // ─── Send confirmation email ─────────────────────────
      await UserService.sendSalesOrderConfirmationEmail({
        email,
        customerName,
        salesOrderNumber,
        totalAmount,
        pdfBuffer,
        pdfFilename,
      });

      return reply.status(200).send({
        success: true,
        message: `Sales order confirmation sent successfully to ${email}`,
      });

    } catch (error: any) {

      request.log.error(error);

      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to send sales order confirmation.",
      });
    }
  }


  static async sendPurchaseOrderConfirmation(request: FastifyRequest, reply: FastifyReply,) {

    try {
      const parts = request.parts();

      let email: string | null = null;
      let vendorName: string | null = null;
      let purchaseOrderNumber: string | null = null;

      let pdfBuffer: Buffer | null = null;
      let pdfFilename: string;

      for await (const part of parts) {

        // ─── Handle form fields ─────────────────────────────
        if (part.type === "field") {

          if (part.fieldname === "email") email = part.value as string;
          if (part.fieldname === "vendorName") vendorName = part.value as string;
          if (part.fieldname === "purchaseOrderNumber") purchaseOrderNumber = part.value as string;
        }

        // ─── Handle PDF file ───────────────────────────────
        if (part.type === "file" && part.fieldname === "pdf") {

          if (part.mimetype !== "application/pdf") {
            return reply.status(400).send({
              success: false,
              message: "Only PDF files are accepted.",
            });
          }

          pdfBuffer = await part.toBuffer();
        }
      }

      // ─── Build filename after loop ───────────────────────
      pdfFilename = purchaseOrderNumber
        ? `Purchase-Order-${purchaseOrderNumber}.pdf`
        : "Purchase-Order.pdf";

      // ─── Required field validation ───────────────────────
      if (!email) {
        return reply.status(400).send({ success: false, message: "email is required." });
      }

      if (!vendorName) {
        return reply.status(400).send({ success: false, message: "vendorName is required." });
      }

      if (!purchaseOrderNumber) {
        return reply.status(400).send({ success: false, message: "purchaseOrderNumber is required." });
      }

      if (!pdfBuffer) {
        return reply.status(400).send({ success: false, message: "pdf file is required." });
      }

      // ─── Send confirmation email ─────────────────────────
      await UserService.sendPurchaseOrderConfirmationEmail({
        email,
        vendorName,
        purchaseOrderNumber,
        pdfBuffer,
        pdfFilename,
      });

      return reply.status(200).send({
        success: true,
        message: `Purchase order confirmation sent successfully to ${email}`,
      });

    } catch (error: any) {

      request.log.error(error);

      return reply.status(500).send({
        success: false,
        message: error.message || "Failed to send purchase order confirmation.",
      });
    }
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