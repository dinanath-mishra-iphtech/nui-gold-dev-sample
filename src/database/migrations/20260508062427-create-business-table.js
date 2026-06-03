'use strict';


/** @type {import('sequelize-cli').Migration} */


module.exports = {


 async up(queryInterface, Sequelize) {


   await queryInterface.createTable(
     'businesses',
     {


       id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
       },


       business_name: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       first_name: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       last_name: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       contact_number: {
         type: Sequelize.STRING,
         allowNull: true,
       },


       physical_street_address: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       city: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       state: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       postal: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       country: {
         type: Sequelize.STRING,
         allowNull: false,
       },


       email: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
       },


       resale_certificate: {
         type: Sequelize.JSONB,
         allowNull: true,
       },


       aml_plan_exists: {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
       },


       independent_audit_conducted: {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
       },


       aml_training_provided: {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
       },


       audit_details: {
         type: Sequelize.JSONB,
         allowNull: true,
       },


       uploaded_documents: {
         type: Sequelize.JSONB,
         allowNull: true,
         defaultValue: [],
       },


       createdAt: {
         allowNull: false,
         type: Sequelize.DATE,
         defaultValue: Sequelize.literal(
           'CURRENT_TIMESTAMP'
         ),
       },


       updatedAt: {
         allowNull: false,
         type: Sequelize.DATE,
         defaultValue: Sequelize.literal(
           'CURRENT_TIMESTAMP'
         ),
       },


     }
   );


 },


 async down(queryInterface) {


   await queryInterface.dropTable(
     'businesses'
   );


 },


};

