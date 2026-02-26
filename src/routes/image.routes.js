import express from "express";
import { upload } from "../middlewares/upload.js";
import { convertHandler } from "../controllers/image.controller.js";
import { validateFileType } from "../middlewares/fileValidation.js";
import { validateQuery } from "../middlewares/queryValidation.js";
import { convertLimiter } from "../middlewares/rateLimiter.js";
import { requestTimeout,haltOnTimedout } from "../middlewares/timeout.js";
const router = express.Router();

router.post("/convert",convertLimiter,requestTimeout, upload.single("file"),validateFileType,validateQuery,haltOnTimedout,convertHandler);

export default router;