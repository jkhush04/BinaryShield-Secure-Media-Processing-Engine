import express from "express";
import { upload } from "../middlewares/upload.js";
import { validateFileType } from "../middlewares/fileValidation.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  validateFileType,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "File validated successfully",
      detectedType: {
        mime: req.verifiedFileType.mime,
        ext: req.verifiedFileType.ext
      },
    });
  }
);

export default router;