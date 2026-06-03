import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";

import { Business } from "./business.model";
import { Address } from "./address.model";

export interface UserAttributes {
  id: number;

  business_id: number;

  first_name: string;

  last_name: string;

  password: string | null;

  email: string;

  phone: string | null;

  is_email_verified: boolean;

  status: string;

  role: string;

  token: string | null;

  expires_at: Date | null;

  otp: string | null;

  otp_expires_at: Date | null;

  otp_attempts: number;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface CreateUserInput
  extends Omit<
    UserAttributes,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "is_email_verified"
    | "otp"
    | "otp_expires_at"
    | "otp_attempts"
    | "phone"
  > {}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model<
  UserAttributes,
  CreateUserInput
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

  @BelongsTo(() => Business)
  declare business: Business;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_email_verified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare token: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare expires_at: Date | null;

  @Column({
    type: DataType.ENUM(
      "trading",
      "viewer",
      "admin",
      "trader"
    ),
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare otp: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare otp_expires_at: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare otp_attempts: number;

  @HasMany(() => Address)
  declare addresses: Address[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}