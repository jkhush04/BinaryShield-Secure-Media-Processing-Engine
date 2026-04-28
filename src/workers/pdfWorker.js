import PDFDocument from "pdfkit";
import sharp from "sharp";
import { pdfQueue } from "../utils/queueManager.js";
import { PassThrough } from "stream";

let activePDFJobs = 0;

export const imagesToPDF = async (files) => {

  return pdfQueue(() => new Promise(async (resolve, reject) => {

    activePDFJobs++;
    console.log("PDF START - Active jobs:", activePDFJobs);


    try {

      const doc = new PDFDocument({ autoFirstPage: false });

      const stream = new PassThrough();
      const chunks = [];

      stream.on("data", chunk => chunks.push(chunk));
      stream.on("end", () => {
        activePDFJobs--;
        console.log("PDF ERROR - Active jobs:", activePDFJobs);

        resolve(Buffer.concat(chunks));
      });

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
      activePDFJobs--;
      console.log("PDF ERROR - Active jobs:", activePDFJobs);

      reject(err);
    }

  }));

};