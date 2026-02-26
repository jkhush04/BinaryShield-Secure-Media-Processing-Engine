import { convertImage } from "../workers/imageWorker.js";

export const convertHandler = async (req, res) => {
  
  try {
    const { width, height, format, quality } = req.query;

    const outputBuffer = await convertImage(req.file.buffer, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      format: format || "webp",
      quality: quality ? parseInt(quality) : 80,
    });

    res.set("Content-Type", `image/${format || "webp"}`);
    res.send(outputBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: "Conversion failed" });
  }
};