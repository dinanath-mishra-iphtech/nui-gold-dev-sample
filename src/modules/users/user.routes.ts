import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", UserController.create);
  app.post("/set-password",UserController.setPassword);
  app.post("/login",UserController.login);
  app.get("/",UserController.getAll);
  app.get("/:id",UserController.getUserById);

  
  app.patch("/:id/approve-kyc",UserController.approveKyc);
  app.patch("/:id/reject-kyc",UserController.rejectKyc);
}
