import sharp from "sharp";
import { imageQueue } from "../utils/queueManager.js";

export const convertImage = async (buffer, options) => {
  return imageQueue(async () => {

    const { width, height, format, quality } = options;
    const image = sharp(buffer);

    const metadata = await image.metadata();

    const maxPixels = 20_000_000;

    if (metadata.width * metadata.height > maxPixels) {
      throw new Error("Image dimensions too large");
    }

    let transformer = image;

    if (width || height) {
      transformer = transformer.resize(width, height);
    }

    if (format === "webp") {
      transformer = transformer.webp({ quality: quality || 80 });
    } else if (format === "jpeg") {
      transformer = transformer.jpeg({ quality: quality || 80 });
    } else if (format === "png") {
      transformer = transformer.png();
    }

    return await transformer.toBuffer();
  });
};