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

        business_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "businesses",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        address_line_1: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        address_line_2: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        landmark: {
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

        pin_code: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        country: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        contact_number: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        is_default: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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