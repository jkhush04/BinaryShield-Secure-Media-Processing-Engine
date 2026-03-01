import { spawn } from "child_process";
import { videoQueue } from "../utils/queueManager.js";
import { createTempFile, cleanupFile } from "../utils/tempManager.js";
import { allowedFormats } from "../config/videoFormats.js";
import {
  canAcceptJob,
  incrementQueue,
  startJob,
  finishJob
} from "../utils/vdjobManager.js";
import {
  registerActiveFile,
  unregisterActiveFile
} from "../utils/vdjobManager.js";

const getVideoDuration = (inputPath) => {
  return new Promise((resolve, reject) => {
    const probe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      inputPath
    ]);

    let output = "";

    probe.stdout.on("data", (data) => {
      output += data.toString();
    });

    probe.on("close", (code) => {
      if (code !== 0) return reject(new Error("ffprobe failed"));
      resolve(parseFloat(output));
    });
  });
};


/* const getVideoResolution = (inputPath) => {
  return new Promise((resolve, reject) => {
    const probe = spawn("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=s=x:p=0",
      inputPath
    ]);

    let output = "";

    probe.stdout.on("data", (data) => {
      output += data.toString();
    });

    probe.on("close", (code) => {
      if (code !== 0) return reject(new Error("ffprobe failed"));

      const [width, height] = output.trim().split("x").map(Number);
      resolve({ width, height });
    });
  });
}; */

export const convertVideo = async (inputPath, targetFormat) => {

  //duration validation and resolution validation
  const duration = await getVideoDuration(inputPath);

  //const { width, height } = await getVideoResolution(inputPath);

  if (duration > 120) {
    throw new Error("Video duration exceeds 120 seconds");
  }

  /* if (width > 1920 || height > 1080) {
    throw new Error("Video resolution exceeds 1080p");
  } */

  if (!canAcceptJob()) {
    throw new Error("Server busy. Try again later.");
  }

  incrementQueue();

  // Convert video to target format
  return videoQueue(() => new Promise((resolve, reject) => {
    startJob();
    registerActiveFile(inputPath);
    const { videoCodec, audioCodec } = allowedFormats[targetFormat];


    const outputPath = createTempFile(targetFormat);
    const ffmpeg = spawn("ffmpeg", [
      "-i", inputPath,
      "-vf", "scale='min(1920,iw)':-2",   //If width > 1920 → scale down If width < 1920 → keep original Height auto-calculated (maintains aspect ratio)
      "-c:v", videoCodec,
      "-c:a", audioCodec,
      "-preset", "fast",
      "-y",
      outputPath
    ]);

    const timeout = setTimeout(() => {
      ffmpeg.kill("SIGKILL");
      cleanupFile(outputPath);
      finishJob();
      unregisterActiveFile(inputPath);
      reject(new Error("Video conversion timeout"));
    }, 120000);

    ffmpeg.on("close", (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
        // cleanupFile(inputPath);
        cleanupFile(outputPath);
        finishJob();
        unregisterActiveFile(inputPath);
        return reject(new Error("FFmpeg failed"));
      }
      unregisterActiveFile(inputPath);
      finishJob();
      resolve(outputPath);
    });

  }));
};