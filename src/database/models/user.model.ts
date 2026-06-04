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

  is_email_verified: boolean;

  status: string;

  role: string;

  token: string | null;

  expires_at: Date | null;

  created_at?: Date;

  updated_at?: Date;
}

export interface CreateUserInput
  extends Omit<
    UserAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "is_email_verified"
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

  @HasMany(() => Address)
  declare addresses: Address[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}