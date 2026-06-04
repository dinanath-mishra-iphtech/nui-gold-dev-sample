"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "addresses",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        street_address: {
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

        postal_code: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        country: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue:
            Sequelize.literal(
              "CURRENT_TIMESTAMP"
            ),
        },

        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue:
            Sequelize.literal(
              "CURRENT_TIMESTAMP"
            ),
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "addresses"
    );
  },
};