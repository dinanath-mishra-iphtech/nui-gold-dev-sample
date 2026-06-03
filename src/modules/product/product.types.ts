import { z } from "zod";

import { addWishlistSchema, removeWishlistSchema } from "./product.validation";

export type AddWishlistInput = z.infer<typeof addWishlistSchema>;
export type RemoveWishlistInput = z.infer<typeof removeWishlistSchema>;

