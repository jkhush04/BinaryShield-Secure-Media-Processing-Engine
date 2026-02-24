import { z } from "zod";

const querySchema = z.object({
  width: z.string().optional(),
  height: z.string().optional(),
  format: z.enum(["webp", "jpeg","jpg", "png"]).optional(),
  quality: z.string().optional(),
});

export const validateQuery = (req, res, next) => {

    try {
    querySchema.parse(req.query);

    // Extra numeric validation
    if (req.query.width && isNaN(parseInt(req.query.width))) {
      return res.status(400).json({ message: "Width must be a number" });
    }

    if (req.query.quality) {
      const q = parseInt(req.query.quality);
      if (q < 1 || q > 100) {
        return res.status(400).json({ message: "Quality must be 1–100" });
      }
    }

    next();
   }
   catch (err) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: err.errors,
    });
  }
};