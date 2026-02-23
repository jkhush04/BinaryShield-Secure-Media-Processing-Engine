import express from "express";
import { securityMiddleware } from "./src/middlewares/security.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import healthRoutes from "./src/routes/health.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import imageRoutes from "./src/routes/image.routes.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

securityMiddleware(app);

app.use("/health", healthRoutes);
app.use("/upload", uploadRoutes);
app.use("/images", imageRoutes);

app.use(errorHandler);

export default app;
