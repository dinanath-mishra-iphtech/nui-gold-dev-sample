"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "products",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        sku: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        grade: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        asset: {
          type: Sequelize.ENUM(
            "gold",
            "silver",
            "platinum",
            "palladium"
          ),
          allowNull: true,
        },

        weight: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },

        product_family: {
          type: Sequelize.ENUM(
            "coin",
            "bar",
            "round",
            "other"
          ),
          allowNull: true,
        },

        availability: {
          type: Sequelize.ENUM(
            "in_stock",
            "out_of_stock",
            "pre_order"
          ),
          allowNull: true,
        },

        qty_allow_to_oversell: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },

        allow_selling_on_portal: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        ira_acceptable: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        images: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue:
            Sequelize.literal(
              "CURRENT_TIMESTAMP"
            ),
        },

        updatedAt: {
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
    await queryInterface.dropTable("products");
  },
};