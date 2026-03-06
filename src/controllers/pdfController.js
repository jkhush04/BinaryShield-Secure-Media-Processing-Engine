import {imagesToPDF } from "../workers/pdfWorker.js";

export const imagesToPDFController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const pdfBuffer = await imagesToPDF(req.files);

    console.log(`Sending PDF with ${pdfBuffer.length} bytes`);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=output.pdf"
    });

    res.send(pdfBuffer);

  } catch (err) {
   
    console.error("PDF ERROR →", err);

    res.status(500).json({
      success: false,
      message: "PDF creation failed"
    });

  }

};
