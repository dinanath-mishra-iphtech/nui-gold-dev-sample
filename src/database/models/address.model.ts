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

export interface AddressAttributes {
  id: number;

  user_id: number;

  street_address: string;

  city: string;

  state: string;

  postal_code: string;

  country: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface CreateAddressInput
  extends Omit<
    AddressAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

@Table({
  tableName: "addresses",
  timestamps: true,
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

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare street_address: string;

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
  declare postal_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare country: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}