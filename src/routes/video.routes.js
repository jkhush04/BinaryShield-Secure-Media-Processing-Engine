import express from "express";
import multer from "multer";
import path from "path";
import { handleVideoConvert } from "../controllers/video.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

router.post("/convert", upload.single("file"), handleVideoConvert);

export default router;