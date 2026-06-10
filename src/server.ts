import { app } from "./app";
import { logger } from "./config/logger";
import { sequelize } from "./config/database";

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected");
    await sequelize.sync({
      alter: true,
    });
    logger.info("Database synced");
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    logger.info(`Server running on port ${process.env.PORT}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

start();
