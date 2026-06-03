import { Wishlist } from "../../database/models/wishlist.model";
import { Product } from "../../database/models/product.model";
import { AddWishlistInput } from "./product.types";

export class ProductRepository {
    
  static async addToWishlist(data: AddWishlistInput) {
    return Wishlist.findOrCreate({
      where: {
        business_id: data.business_id,
        product_id: data.product_id,
      },
      defaults: data,
    });
  }

  static async removeFromWishlist(
    business_id: number,
    product_id: number
  ) {
    return Wishlist.destroy({
      where: { business_id, product_id },
    });
  }

  static async getWishlistByBusinessId(business_id: number) {
    return Wishlist.findAll({
      where: { business_id },
      include: [
        {
          model: Product,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
  }

  static async findWishlistItem(
    business_id: number,
    product_id: number
  ) {
    return Wishlist.findOne({
      where: { business_id, product_id },
    });
  }
}