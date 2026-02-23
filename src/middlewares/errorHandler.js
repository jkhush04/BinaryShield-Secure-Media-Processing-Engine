import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.log("ERROR CAUGHT →", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};