import express from "express";

import { imagesToPDFController } from "../controllers/pdfController.js";
import { uploadImagesForPDF } from "../middlewares/pdfValidation.js";
const router = express.Router();



router.post(
  "/images-to-pdf",
  uploadImagesForPDF.array("images", 10), // Expecting 'images' field with up to 10 files
  imagesToPDFController
);

export default router;