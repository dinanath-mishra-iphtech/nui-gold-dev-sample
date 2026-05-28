import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {

  console.log("Enter in user routes");

  
  app.post("/", UserController.create);
  app.post("/set-password",UserController.setPassword);
  app.post("/login",UserController.login);
  app.get("/",UserController.getAll);
  app.get("/:id",UserController.getUserById);

  app.post('/test-kyc-email' , UserController.testKycEmail);
  app.post("/test-pdfSend-email" , UserController.sendPdfMail);
  app.post("test-verifyOtp" , UserController.verifyOtp);
  
  
  

}
