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

  contact_number: string | null;

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

  signed_trading_document_url: string | null;

  status: string;

  tier: string;

  credit_limit: string;

  created_at?: Date;

  updated_at?: Date;
}

export interface CreateBusinessInput
  extends Omit<
    BusinessAttributes,
    "id" | "created_at" | "updated_at"
  > { }

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
    allowNull: true,
  })
  declare contact_number: string;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "pending",
  })
  declare status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  declare tier: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "0",
  })
  declare credit_limit: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare signed_trading_document_url: string | null;

  @HasMany(() => User)
  declare users: User[];

  declare readonly created_at: Date;

  declare readonly updated_at: Date;
}