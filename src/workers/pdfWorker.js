import PDFDocument from "pdfkit";
import sharp from "sharp";
import { pdfQueue } from "../utils/queueManager.js";
import { PassThrough } from "stream";


export const imagesToPDF = async (files) => {

  return pdfQueue(() => new Promise(async (resolve, reject) => {

    try {

      const doc = new PDFDocument({ autoFirstPage: false });

      const stream = new PassThrough();
      const chunks = [];

      stream.on("data", chunk => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));

      doc.pipe(stream);

      for (const file of files) {

      // normalize image
        const processed = await sharp(file.buffer)
          .rotate()
          .jpeg({ quality: 90 })
          .toBuffer();

        const metadata = await sharp(processed).metadata();

        doc.addPage({
          size: [metadata.width, metadata.height]
        });

        doc.image(processed, 0, 0, {
          width: metadata.width,
          height: metadata.height
        });

      }

      doc.end();

    } catch (err) {
      reject(err);
    }

  }));

};