import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

export async function userRoutes(app: FastifyInstance) {

  
  app.post("/", UserController.create);
  app.post("/set-password",UserController.setPassword);
  app.post("/login",UserController.login);
  app.post("/send-otp", UserController.sendOtp);
  app.post("/verify-otp", UserController.verifyOtp);
  
  app.get("/",UserController.getAll);
  app.get("/:id",UserController.getUserById);
  app.post("/address" , UserController.createAddress);

  app.post('/test-kyc-email' , UserController.testKycEmail);
  app.post("/test-pdfSend-email" , UserController.sendPdfMail);
  app.post("/test-verifyOtp" , UserController.verifyOtp);
  app.post("/test-shipOrTransfer-email" , UserController.sendShipOrTransferNotification);
  app.post("/test-salesOrder-email" , UserController.sendSalesOrderConfirmation);
  app.post("/test-purchaseOrder-email" , UserController.sendPurchaseOrderConfirmation);


  
  




  
  
  

}
