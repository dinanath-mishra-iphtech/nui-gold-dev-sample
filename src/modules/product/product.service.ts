import { ProductRepository } from "./product.repository";
import { AddWishlistInput } from "./product.types";

export class ProductService {
  static async addToWishlist(data: AddWishlistInput) {
    try {
      const [wishlistItem, created] =
        await ProductRepository.addToWishlist(data);

      if (!created) {
        throw new Error("Product is already in wishlist");
      }

      return wishlistItem;
    } catch (error) {
      throw error;
    }
  }

  static async removeFromWishlist(
    business_id: number,
    product_id: number
  ) {
    try {
      const existing =
        await ProductRepository.findWishlistItem(
          business_id,
          product_id
        );

      if (!existing) {
        throw new Error("Wishlist item not found");
      }

      await ProductRepository.removeFromWishlist(
        business_id,
        product_id
      );

      return { message: "Product removed from wishlist" };
    } catch (error) {
      throw error;
    }
  }

  static async getWishlist(business_id: number) {
    try {
      return await ProductRepository.getWishlistByBusinessId(
        business_id
      );
    } catch (error) {
      throw error;
    }
  }
}