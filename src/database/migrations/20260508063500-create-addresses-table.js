"use strict";


module.exports = {
 async up(queryInterface, Sequelize) {


   await queryInterface.createTable("addresses", {


     id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       allowNull: false,
     },


     user_id: {
       type: Sequelize.INTEGER,
       allowNull: true,
       references: {
         model: "users",
         key: "id",
       },
       onUpdate: "CASCADE",
       onDelete: "CASCADE",
     },


     business_id: {
       type: Sequelize.INTEGER,
       allowNull: true,
       references: {
         model: "businesses",
         key: "id",
       },
       onUpdate: "CASCADE",
       onDelete: "CASCADE",
     },


     /**
      * Example:
      * 1 = Ship To Me
      * 2 = Drop Ship
      * 3 = Hold Shipping
      * 4 = Pick Up
      * 5 = Store At Depository
      */
     type: {
       type: Sequelize.INTEGER,
       allowNull: false,
     },


     address_line_1: {
       type: Sequelize.STRING,
       allowNull: false,
     },


     address_line_2: {
       type: Sequelize.STRING,
       allowNull: true,
     },


     landmark: {
       type: Sequelize.STRING,
       allowNull: true,
     },


     city: {
       type: Sequelize.STRING,
       allowNull: false,
     },


     state: {
       type: Sequelize.STRING,
       allowNull: false,
     },


     postal_code: {
       type: Sequelize.STRING,
       allowNull: false,
     },


     country: {
       type: Sequelize.STRING,
       allowNull: false,
     },


     contact_number: {
       type: Sequelize.STRING,
       allowNull: true,
     },


     is_default: {
       type: Sequelize.BOOLEAN,
       allowNull: false,
       defaultValue: false,
     },


     createdAt: {
       allowNull: false,
       type: Sequelize.DATE,
       defaultValue:
         Sequelize.literal("CURRENT_TIMESTAMP"),
     },


     updatedAt: {
       allowNull: false,
       type: Sequelize.DATE,
       defaultValue:
         Sequelize.literal("CURRENT_TIMESTAMP"),
     },


   });
 },


 async down(queryInterface) {


   await queryInterface.dropTable("addresses");


 },
};

