import express from "express";
import { getJobStats } from "../utils/vdjobManager.js";
import os from "os";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    cpuLoad: os.loadavg(),
    jobs: getJobStats()  //for monitoring active and queued jobs gor video conversion
  });
});

export default router;

