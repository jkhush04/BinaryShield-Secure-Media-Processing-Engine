import fs from "fs";
import os from "os";
import { convertVideo } from "../workers/videoWorker.js";
import { allowedFormats } from "../config/videoFormats.js";

export const handleVideoConvert = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const targetFormat = req.body.format?.toLowerCase();
        if (!targetFormat || !allowedFormats[targetFormat]) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Invalid or missing target format" });
        }

        const load = os.loadavg()[0];

        if (load > 3) {
            fs.unlinkSync(req.file.path);
            return res.status(503).json({ error: "Server under heavy load" });
        }

        const result = await convertVideo(req.file.path, targetFormat);
        // IMPORTANT: we pass file path (disk storage), not buffer

        res.setHeader("Content-Type", allowedFormats[targetFormat].contentType);
        res.sendFile(result, err => {
            // Always cleanup after response
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(result);
        });


    } catch (err) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        res.status(400).json({ error: err.message });
    }
};