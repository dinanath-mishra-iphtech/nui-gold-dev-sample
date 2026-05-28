import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "dd mmm, yyyy - HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
