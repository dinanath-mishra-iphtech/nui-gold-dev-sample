import { FastifyInstance } from "fastify";

import { ProductController } from "./product.controller";

export async function productRoutes(app: FastifyInstance) {

  app.post("/", ProductController.addToWishlist);

  app.delete("/:business_id/:product_id", ProductController.removeFromWishlist);

  app.get("/:business_id", ProductController.getWishlist);
  
}