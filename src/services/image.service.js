import sharp from "sharp";

export const convertImage = async (buffer, options) => {
  const { width, height, format, quality } = options;

  const image = sharp(buffer);

  // 🔐 Get metadata first
  const metadata = await image.metadata();

  const maxPixels = 20_000_000; // 20 megapixels limit
  console.log("Width:", metadata.width);
  console.log("Height:", metadata.height);
  console.log("Total pixels:", metadata.width * metadata.height);

  if (metadata.width * metadata.height > maxPixels) {
    throw new Error("Image dimensions too large");
  }

  let transformer = image;
  
  const maxResizeWidth = 4000;
  const maxResizeHeight = 4000;

  if (width && width > maxResizeWidth) {
    throw new Error("Requested width too large");
  }

  if (height && height > maxResizeHeight) {
    throw new Error("Requested height too large");
  }
  // Resize if provided
  if (width || height) {
    transformer = transformer.resize(width, height);
  }

  // Format conversion
  if (format === "webp") {
    transformer = transformer.webp({ quality: quality || 80 });
  } else if (format === "jpeg") {
    transformer = transformer.jpeg({ quality: quality || 80 });
  } else if (format === "png") {
    transformer = transformer.png();
  }

  return await transformer.toBuffer();
};