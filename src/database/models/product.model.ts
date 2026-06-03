import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

import { Wishlist } from "./wishlist.model";

export interface ProductAttributes {
  id: number;
  sku: string;
  name: string;
  grade?: string;
  asset?: "gold" | "silver" | "platinum" | "palladium";
  weight?: number;
  product_family?: "coin" | "bar" | "round" | "other";
  availability?: "in_stock" | "out_of_stock" | "pre_order";
  qty_allow_to_oversell?: number;
  allow_selling_on_portal: boolean;
  ira_acceptable: boolean;
  description?: string;
  images?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductInput
  extends Omit<
    ProductAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

@Table({
  tableName: "products",
  timestamps: true,
})
export class Product extends Model<
  ProductAttributes,
  CreateProductInput
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare sku: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare grade: string;

  @Column({
    type: DataType.ENUM(
      "gold",
      "silver",
      "platinum",
      "palladium"
    ),
    allowNull: true,
  })
  declare asset: "gold" | "silver" | "platinum" | "palladium";

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  declare weight: number;

  @Column({
    type: DataType.ENUM(
      "coin",
      "bar",
      "round",
      "other"
    ),
    allowNull: true,
  })
  declare product_family: "coin" | "bar" | "round" | "other";

  @Column({
    type: DataType.ENUM(
      "in_stock",
      "out_of_stock",
      "pre_order"
    ),
    allowNull: true,
  })
  declare availability: "in_stock" | "out_of_stock" | "pre_order";

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare qty_allow_to_oversell: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare allow_selling_on_portal: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare ira_acceptable: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare images: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes: string;

  @HasMany(() => Wishlist)
  declare wishlists: Wishlist[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}