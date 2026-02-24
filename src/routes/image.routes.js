import express from "express";
import { upload } from "../middlewares/upload.js";
import { convertHandler } from "../controllers/image.controller.js";
import { validateFileType } from "../middlewares/fileValidation.js";
import { validateQuery } from "../middlewares/queryValidation.js";
import { convertLimiter } from "../middlewares/rateLimiter.js";
const router = express.Router();

router.post("/convert",  convertLimiter,upload.single("file"),validateFileType,validateQuery,convertHandler);

export default router;