import { z } from "zod";

export const addWishlistSchema =
  z.object({
    business_id: z
      .number()
      .int()
      .positive({
        message: "business_id must be positive",
      }),

    product_id: z
      .number()
      .int()
      .positive({
        message: "product_id must be positive",
      }),
  });

export const removeWishlistSchema =
  z.object({
    business_id: z
      .number()
      .int()
      .positive(),

    product_id: z
      .number()
      .int()
      .positive(),
  });