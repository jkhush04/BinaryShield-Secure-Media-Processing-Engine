import { spawn } from "child_process";
import { videoQueue } from "../utils/queueManager.js";
import { createTempFile, cleanupFile } from "../utils/tempManager.js";

export const convertVideo = async (inputPath) => {
  return videoQueue(() => new Promise((resolve, reject) => {
  
    
    const outputPath = createTempFile("mp4");



    const ffmpeg = spawn("ffmpeg", [
      "-i", inputPath,
      "-vf", "scale=1280:720",
      "-preset", "fast",
      outputPath
    ]);

    const timeout = setTimeout(() => {
      ffmpeg.kill("SIGKILL");
      cleanupFile(outputPath);
      reject(new Error("Video conversion timeout"));
    }, 120000);

    ffmpeg.on("close", (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
       // cleanupFile(inputPath);
        cleanupFile(outputPath);
        return reject(new Error("FFmpeg failed"));
      }

     
      resolve(outputPath);
    });

  }));
};