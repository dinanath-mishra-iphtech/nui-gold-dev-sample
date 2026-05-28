import { FastifyInstance } from "fastify";

import { AuthController } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {

    console.log("auth routes loaded");

//   app.post("/register", AuthController.registerTrader);

//   app.post("/set-password", AuthController.setPassword);

//   app.post("/login", AuthController.login);

//   app.post("/refresh-token",AuthController.refreshToken);

    app.post('/test-kyc-email' , AuthController.testKycEmail);

  
  
  



}