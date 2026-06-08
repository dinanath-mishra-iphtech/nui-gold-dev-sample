import { ProductRepository } from "./product.repository";
import { AddWishlistInput } from "./product.types";

export class ProductService {

  static async addToWishlist(data: AddWishlistInput) {
    const [wishlistItem, created] = await ProductRepository.addToWishlist(data);

    if (!created) {
      throw new Error("Product is already in wishlist");
    }

    return wishlistItem.toJSON();
  }

  static async removeFromWishlist(business_id: number, product_id: number) {
    const existing = await ProductRepository.findWishlistItem(business_id, product_id);

    if (!existing) {
      throw new Error("Wishlist item not found");
    }

    await ProductRepository.removeFromWishlist(business_id, product_id);

    return { message: "Product removed from wishlist" };
  }

  static async getWishlist(business_id: number) {
    const wishlist = await ProductRepository.getWishlistByBusinessId(business_id);
    return wishlist.map(item => item.toJSON());
  }
  
  
}