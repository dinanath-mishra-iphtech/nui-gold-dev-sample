import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import {
  createUserSchema,
  setPasswordRouteSchema,
  loginRouteSchema,
  getAllUsersSchema,
  getUserByIdSchema,
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
  getAddressesSchema,
  getAllVendorsSchema,
} from "./user.schema";
import { authenticate } from "./user.middleware";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", { schema: createUserSchema }, UserController.create);
  app.post("/set-password", { schema: setPasswordRouteSchema }, UserController.setPassword);
  app.post("/send-set-password-link", UserController.sendSetPasswordLink);
  app.post("/login", { schema: loginRouteSchema }, UserController.login);
  app.get("/", { schema: getAllUsersSchema }, UserController.getAll);
  app.get("/get-vendors", { schema: getAllVendorsSchema }, UserController.getVendors);
  app.get("/:id", { schema: getUserByIdSchema }, UserController.getUserById);
  app.post("/addresses", { preHandler: [authenticate], schema: createAddressSchema }, UserController.createAddress);
  app.put("/addresses/:id", { preHandler: [authenticate], schema: updateAddressSchema }, UserController.updateAddress);
  app.delete("/addresses/:id", { preHandler: [authenticate], schema: deleteAddressSchema }, UserController.deleteAddress);
  app.get("/addresses/:id", { preHandler: [authenticate], schema: getAddressesSchema }, UserController.getAddresses);

  //update profile of trader
  app.patch("/profile", { preHandler: [authenticate] }, UserController.updateProfile);
  app.patch("/change-password", { preHandler: [authenticate] }, UserController.changePassword);
  

}
