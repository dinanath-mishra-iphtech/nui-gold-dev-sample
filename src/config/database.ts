import { Sequelize } from "sequelize-typescript";
const config = require("./config.json")[process.env.NODE_ENV || "development"];
import { User } from "../database/models/user.model";
import { Business } from "../database/models/business.model";
import { Address } from "../database/models/address.model";

export const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  logging: true,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: config.dialectOptions,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [User,Business,Address],
});
