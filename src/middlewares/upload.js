import multer from "multer";
import { config } from "../config/env.js";

const storage = multer.memoryStorage();
console.log("Upload middleware loaded");
console.log("MAX FILE SIZE:", config.maxFileSize);
export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
    files: 1,
  },
});