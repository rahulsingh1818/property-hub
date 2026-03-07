import cloudinaryPkg from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

const { v2: cloudinary } = cloudinaryPkg;

/**
 * Configure Cloudinary lazily — called at first use so
 * dotenv has definitely loaded by then.
 */
let _configured = false;
function ensureConfigured() {
    if (_configured) return;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    _configured = true;

    // Log on first use so we can see in nodemon if creds are missing
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("⚠️  CLOUDINARY_CLOUD_NAME is not set in .env!");
    } else {
        console.log("✅ Cloudinary configured for cloud:", process.env.CLOUDINARY_CLOUD_NAME);
    }
}

// ── Multer: store file in memory buffer ───────────────────────────────────────
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Only JPG, PNG, WebP images are allowed."));
    },
});

// ── Upload buffer → Cloudinary via upload_stream ──────────────────────────────
export function uploadToCloudinary(buffer, folder = "realestate/properties") {
    ensureConfigured();  // make sure credentials are loaded
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload_stream error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        // Convert buffer to readable stream and pipe into cloudinary
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);  // signal end of stream
        readable.pipe(stream);
    });
}

export { cloudinary };