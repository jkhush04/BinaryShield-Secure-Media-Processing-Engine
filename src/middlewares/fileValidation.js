import { fileTypeFromBuffer } from "file-type";

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/jpg",
];

export const validateFileType = async (req, res, next) => {
 // console.log("FILE OBJECT:", req.file);
  //console.log("BUFFER FIRST 16 BYTES:", req.file?.buffer?.slice(0, 16));

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const detectedType = await fileTypeFromBuffer(req.file.buffer);

    if (!detectedType) {
      return res.status(400).json({
        success: false,
        message: "Unable to detect file type",
      });
    }

    if (!allowedMimeTypes.includes(detectedType.mime)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    // Attach verified type to request
    req.verifiedFileType = detectedType;

    next();
  } catch (error) {
    next(error);
  }
};