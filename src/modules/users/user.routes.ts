import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import { authenticate } from "./user.middleware";
import {
  getBusinessProfileSchema,
  updateProfileSwaggerSchema,
  changePasswordSwaggerSchema,
  addUserSwaggerSchema,
  removeUserSchema,
} from "./user.schema";


export async function userRoutes(app: FastifyInstance) {

  app.post("/", UserController.create);
  app.post("/set-password", UserController.setPassword);
  app.post("/send-set-password-link", UserController.sendSetPasswordLink);


  // ── Trader Dashboard User Management ──
  app.get("/getBusinessProfile", { preHandler: [authenticate], schema: getBusinessProfileSchema }, UserController.getBusinessProfile);
  app.patch("/profile", { preHandler: [authenticate], schema: updateProfileSwaggerSchema }, UserController.updateProfile);
  app.patch("/updatePassword", { preHandler: [authenticate], schema: changePasswordSwaggerSchema }, UserController.changePassword);

  app.post("/add-user", { preHandler: [authenticate], schema: addUserSwaggerSchema }, UserController.addUser);
  app.delete<{ Params: { userId: string } }>("/remove-user/:userId", { preHandler: [authenticate], schema: removeUserSchema }, UserController.removeUser);




}
