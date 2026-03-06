import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  console.log("Uploaded mimetype:", file.mimetype);
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PNG, JPG, JPEG and WEBP allowed"));
  }

  cb(null, true);
};

export const uploadImagesForPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
    files: 10
  }
});