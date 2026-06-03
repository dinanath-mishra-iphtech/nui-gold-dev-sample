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


 user_id?: number;


 business_id?: number;


 /**
  * Example:
  * 1 = Ship To Me
  * 2 = Drop Ship
  * 3 = Hold Shipping
  * 4 = Pick Up
  * 5 = Store At Depository
  */
 type: number;


 address_line_1: string;


 address_line_2?: string;


 landmark?: string;


 city: string;


 state: string;


 postal_code: string;


 country: string;


 contact_number?: string;


 is_default?: boolean;


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


 // ─── Primary Key ───────────────────────────────


 @PrimaryKey
 @AutoIncrement
 @Column({
   type: DataType.INTEGER,
   allowNull: false,
 })
 declare id: number;


 // ─── User Relation ─────────────────────────────


 @ForeignKey(() => User)
 @Column({
   type: DataType.INTEGER,
   allowNull: true,
 })
 declare user_id?: number;


 @BelongsTo(() => User)
 declare user?: User;


 // ─── Business Relation ─────────────────────────


 @ForeignKey(() => Business)
 @Column({
   type: DataType.INTEGER,
   allowNull: true,
 })
 declare business_id?: number;


 @BelongsTo(() => Business)
 declare business?: Business;


 // ─── Address Type ──────────────────────────────


 @Column({
   type: DataType.INTEGER,
   allowNull: false,
 })
 declare type: number;


 // ─── Address Fields ────────────────────────────


 @Column({
   type: DataType.STRING,
   allowNull: false,
 })
 declare address_line_1: string;


 @Column({
   type: DataType.STRING,
   allowNull: true,
 })
 declare address_line_2?: string;


 @Column({
   type: DataType.STRING,
   allowNull: true,
 })
 declare landmark?: string;


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


 @Column({
   type: DataType.STRING,
   allowNull: true,
 })
 declare contact_number?: string;


 @Column({
   type: DataType.BOOLEAN,
   allowNull: false,
   defaultValue: false,
 })
 declare is_default: boolean;


 // ─── Timestamps ────────────────────────────────


 declare readonly createdAt: Date;


 declare readonly updatedAt: Date;
}
