import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

const tempDir = path.join(os.tmpdir(), "conversions");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

export function createTempFile(extension) {
  const filename = `${randomUUID()}.${extension}`;
  return path.join(tempDir, filename);
}

export function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}