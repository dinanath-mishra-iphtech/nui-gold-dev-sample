import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
} from "sequelize-typescript";

import { Business } from "./business.model";
import { Product } from "./product.model";

export interface WishlistAttributes {
  id: number;
  business_id: number;
  product_id: number;
  createdAt?: Date;
}

export interface CreateWishlistInput
  extends Omit<
    WishlistAttributes,
    "id" | "createdAt"
  > {}

@Table({
  tableName: "wishlist",
  timestamps: true,
  updatedAt: false,
  underscored:true,
})
export class Wishlist extends Model<
  WishlistAttributes,
  CreateWishlistInput
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare business_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare product_id: number;

  @CreatedAt
  declare readonly createdAt: Date;

  @BelongsTo(() => Business)
  declare business: Business;

  @BelongsTo(() => Product)
  declare product: Product;
}