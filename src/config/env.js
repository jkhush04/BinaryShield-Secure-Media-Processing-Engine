import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX),
};