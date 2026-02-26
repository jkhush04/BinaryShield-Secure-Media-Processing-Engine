import fs from "fs";
import { convertVideo } from "../workers/videoWorker.js";

export const handleVideoConvert = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const result = await convertVideo(req.file.path);
        // IMPORTANT: we pass file path (disk storage), not buffer

        res.set("Content-Type", "video/mp4");
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