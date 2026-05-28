import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

// import { AuthService } from "./auth.service";
import { emailProvider } from "../../common/utils/email.provider";
import { buildKycApprovedTemplate } from "../../common/templates/kyc-approved.template";
import { buildKycRejectedTemplate } from "../../common/templates/kyc-rejected.template";
// import {
//   registerSchema,
//   setPasswordSchema,
//   loginSchema,
//   refreshTokenSchema,
// } from "./auth.validation";
// import { EmailService } from "../../common/services/email.service";
// import { success } from "zod";


 export class AuthController {

//   static async registerTrader(
//     request: FastifyRequest,
//     reply: FastifyReply
//   ) {

//     const parsedData =
//       registerSchema.parse(
//         request.body
//       );

//     const result =
//       await AuthService.registerTrader(
//         parsedData
//       );

//     return reply
//       .status(201)
//       .send(result);
//   }



//   static async setPassword(
//     request: FastifyRequest,
//     reply: FastifyReply
//   ) {

//     const parsedData =
//       setPasswordSchema.parse(
//         request.body
//       );

//     const result = await AuthService.setPassword(parsedData);

//     return reply
//       .status(200)
//       .send(result);

//   }

//   static async login(request: FastifyRequest, reply: FastifyReply,) {

//     const body = loginSchema.parse(
//       request.body
//     );

//     const user =
//       await AuthService.login(
//         body.email,
//         body.password,
//       );

//     const accessToken = await reply.jwtSign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       {
//         expiresIn:
//           process.env.JWT_EXPIRES_IN,
//       },
//     );

//     const refreshToken = await reply.jwtSign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       {
//         expiresIn:
//           process.env.REFRESH_TOKEN_EXPIRES_IN,
//       },
//     );

//     return reply.send({
//       success: true,
//       accessToken,
//       refreshToken,
//       user,
//     });
//   }



//   static async refreshToken(request: FastifyRequest, reply: FastifyReply) {

//     const { refreshToken } = refreshTokenSchema.parse(
//       request.body
//     );

//     const result =
//       await AuthService.refreshToken(
//         refreshToken
//       );

//     return reply
//       .status(200)
//       .send({
//         success: true,
//         data: result,
//       });
//   }


  static async testKycEmail(request: FastifyRequest, reply: FastifyReply) {

    const { email, name, status, tier, creditLimit, rejectionReasons } = request.body as {
      email: string;
      name: string;
      status: string;
      tier?: string;
      creditLimit?: number;
      rejectionReasons?: string[];
    };



    if (status.toUpperCase() === "APPROVED") {
      if (!tier || !creditLimit) {
        return reply.status(400).send({
          success: false,
          message:
            "Tier and credit limit required",
        });
      }

    const html = buildKycApprovedTemplate(name, tier, creditLimit);

    await emailProvider.sendEmail(
      email,
      "Welcome to Numismatics Unlimited! Your Account is Approved",
      html
    );

    return reply.status(200).send({
      success: true,

      message:
        "Check your mail, KYC approved email sent",
    });
    }
    else if (status.toUpperCase() === "REJECTED") {
      if (!rejectionReasons || rejectionReasons.length === 0) {
        return reply.status(400).send({
          success: false,
          message:
            "Rejection reasons required",
        });
      }
      const html = buildKycRejectedTemplate( name , rejectionReasons);

    await emailProvider.sendEmail(
      email,
      "Action Required: Update to your KYC Verification",
      html
    );


        return reply.status(400).send({
        success: false,

        message:
            "Invalid status",
        });
    }
  }

//   {
//   "email": "dinanath.mishra@iphtechnologies.com",
//   "name": "Dinanath",
//   "status": "REJECTED",
//   "rejectionReasons": [
//     "Incomplete Personal Details",
//     "Incomplete Resale Certificate"
//   ]
// }







}


