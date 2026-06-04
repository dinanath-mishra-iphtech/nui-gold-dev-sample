"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
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

        first_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        last_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },

        is_email_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        status: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        role: {
          type: Sequelize.ENUM(
            "trading",
            "viewer",
            "admin",
            "trader"
          ),
          allowNull: false,
        },

        token: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        expires_at: {
          type: Sequelize.DATE,
          allowNull: true,
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
      "users"
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_accessibility";'
    );
  },
};