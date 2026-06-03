import { FastifyInstance } from "fastify";
import { userRoutes } from "../modules/users/user.routes";
import { productRoutes } from "../modules/product/product.routes";

export async function routes(app: FastifyInstance) {
  app.register(userRoutes, {
    prefix: "/api/users",
  });

  app.register(productRoutes, {
    prefix: "/api/products",
  })
}
