import app from "./app.js";
import { config } from "./src/config/env.js";
import { logger } from "./src/utils/logger.js";

 app.listen(config.port, () => {
  logger.info(`BinaryShield running on port ${config.port}`);
}); 
