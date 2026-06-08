import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

import { User } from "./user.model";
import { Business } from "./business.model";

export interface AddressAttributes {
  id: number;

  user_id: number;

  business_id: number;

  address_line_1: string;

  address_line_2: string;

  landmark: string;

  city: string;

  state: string;

  pin_code: string;

  country: string;

  type: number;

  contact_number: string;

  is_default: boolean;

  created_at?: Date;

  updated_at?: Date;
}

export interface CreateAddressInput
  extends Omit<
    AddressAttributes,
    "id" | "created_at" | "updated_at"
  > { }

@Table({
  tableName: "addresses",
  timestamps: true,
  underscored: true,
})
export class Address extends Model<
  AddressAttributes,
  CreateAddressInput
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare business_id: number;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare address_line_1: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare address_line_2: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare landmark: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare pin_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contact_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare country: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare type: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_default: boolean;

  declare readonly created_at: Date;

  declare readonly updated_at: Date;
}