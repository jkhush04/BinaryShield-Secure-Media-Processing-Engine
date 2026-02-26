import express from "express";
import { securityMiddleware } from "./src/middlewares/security.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import healthRoutes from "./src/routes/health.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import imageRoutes from "./src/routes/image.routes.js";
import videoRoutes from "./src/routes/video.routes.js";

const app = express();
//app.set("trust proxy", 1);  // add later when deploying behind a proxy

app.use(express.json({ limit: "1mb" }));



securityMiddleware(app);

app.use("/health", healthRoutes);
app.use("/upload", uploadRoutes);
app.use("/images", imageRoutes);
app.use("/videos", videoRoutes);

app.use(errorHandler);

export default app;

