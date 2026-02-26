import sharp from "sharp";
import pLimit from "p-limit";

const limit = pLimit(2); // allow only 3 conversions at same time

let activeJobs = 0;
export const convertImage = async (buffer, options) => {
  return await limit(async () => {
    // console.log("START:", Date.now());

    activeJobs++;
    console.log("START - Active jobs:", activeJobs);

  try{
  //  await new Promise(resolve => setTimeout(resolve, 10000)); // simulate long processing time
    const { width, height, format, quality } = options;

    const image = sharp(buffer);

    // 🔐 Get metadata first
    const metadata = await image.metadata();

    const maxPixels = 12_000_000; // 12 megapixels limit
    //console.log("Width:", metadata.width);
    //console.log("Height:", metadata.height);
    //console.log("Total pixels:", metadata.width * metadata.height);

    if (metadata.width * metadata.height > maxPixels) {
      throw new Error("Image dimensions too large");
    }



    const maxResizeWidth = 4000;
    const maxResizeHeight = 4000;
      
    if (width && width > maxResizeWidth) {
      throw new Error("Requested width too large");
    }

    if (height && height > maxResizeHeight) {
      throw new Error("Requested height too large");
    }

    let transformer = image;

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


    //console.log("END:", Date.now());
    return await transformer.toBuffer();
  }
  finally {    activeJobs--;
    console.log("END - Active jobs:", activeJobs);
  }
  });
};