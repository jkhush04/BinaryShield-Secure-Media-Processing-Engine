import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { config } from "../config/env.js";

export const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(cors({
    origin: "*", // later restrict in production
    methods: ["POST", "GET"]
  }));

  const limiter = rateLimit({
    windowMs: config.rateLimitWindow,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);
};