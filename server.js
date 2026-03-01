import app from "./app.js";
import fs from "fs";
import path from "path";
import { config } from "./src/config/env.js";
import { logger } from "./src/utils/logger.js";
import { isFileActive } from "./utils/jobManager.js";

app.listen(config.port, () => {
  logger.info(`BinaryShield running on port ${config.port}`);
});

setInterval(() => {
  const dir = path.resolve("uploads/videos");
  //console.log("Running cleanup...");
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Stat error:", err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) return;

        const age = Date.now() - stats.mtimeMs;

        if (age > 30 * 60 * 1000 && !isFileActive(filePath)) {
          fs.unlink(filePath, err => {
            if (err) console.log("Delete error:", err);
          });
        }
      });
    });
  });
}, 30 * 60 * 1000);
