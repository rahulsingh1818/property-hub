import express from "express";
import { upload, uploadToCloudinary } from "../config/cloudinary.js";

const router = express.Router();

/**
 * POST /api/upload/image
 * Accepts : multipart/form-data  { image: File }
 * Returns : { url: string, public_id: string }
 */
router.post("/image", (req, res) => {
    // Multer runs first via callback — catches ALL multer errors as JSON
    upload.single("image")(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err.message);
            return res.status(400).json({ message: err.message || "File upload error." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided." });
        }

        try {
            // Stream the in-memory buffer to Cloudinary
            const result = await uploadToCloudinary(req.file.buffer);

            return res.status(200).json({
                url: result.secure_url,
                public_id: result.public_id,
            });
        } catch (cloudErr) {
            console.error("Cloudinary upload error:", cloudErr.message || cloudErr);
            return res.status(500).json({
                message: "Cloudinary upload failed: " + (cloudErr.message || "Unknown error"),
            });
        }
    });
});

export default router;
