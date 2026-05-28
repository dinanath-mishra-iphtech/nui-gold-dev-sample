import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

import { User } from "./user.model";

export interface BusinessAttributes {
  id: number;

  business_name: string;

  first_name: string;

  last_name: string;

  physical_street_address: string;

  city: string;

  state: string;

  postal: string;

  country: string;

  email: string;

  resale_certificate?: Record<
    string,
    any
  >;

  aml_plan_exists: boolean;

  independent_audit_conducted: boolean;

  aml_training_provided: boolean;

  audit_details?: Record<
    string,
    any
  >;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface CreateBusinessInput
  extends Omit<
    BusinessAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

@Table({
  tableName: "businesses",
  timestamps: true,
})
export class Business extends Model<
  BusinessAttributes,
  CreateBusinessInput
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
  })
  declare business_name: string;

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
  declare physical_street_address: string;

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
  declare postal: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare country: string;

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
    type: DataType.JSONB,
    allowNull: true,
  })
  declare resale_certificate: Record<
    string,
    any
  >;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare aml_plan_exists: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare independent_audit_conducted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare aml_training_provided: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare audit_details: Record<
    string,
    any
  >;

  @HasMany(() => User)
  declare users: User[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}