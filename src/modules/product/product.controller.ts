import { FastifyReply, FastifyRequest } from "fastify";

import { ProductService } from "./product.service";
import { addWishlistSchema } from "./product.validation";

export class ProductController {

  static async addToWishlist(request: FastifyRequest,reply: FastifyReply) {
    try {
      const body = addWishlistSchema.parse(request.body);

      const wishlistItem =
        await ProductService.addToWishlist(body);

      return reply.status(201).send({   
        success: true,
        data: wishlistItem,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to add to wishlist",
      });
    }
  }

  static async removeFromWishlist(request: FastifyRequest<{Params: { business_id: string; product_id: string };}>,reply: FastifyReply) {
    try {
      const { business_id, product_id } = request.params;

      const result = await ProductService.removeFromWishlist(Number(business_id),Number(product_id));

      return reply.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to remove from wishlist",
      });
    }
  }

  static async getWishlist(request: FastifyRequest<{Params: { business_id: string };}>,reply: FastifyReply) {
    try {
      const wishlist = await ProductService.getWishlist(Number(request.params.business_id));
      
      return reply.status(200).send({
        success: true,
        data: wishlist,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to fetch wishlist",
      });
    }
  }


}