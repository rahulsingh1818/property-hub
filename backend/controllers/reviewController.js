import Review from "../models/Review.js";
import { upload, uploadToCloudinary } from "../config/cloudinary.js";

// ─── Helper: run multer upload as a promise ───────────────────────────────────
function runMulter(req, res) {
    return new Promise((resolve, reject) => {
        upload.single("image")(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ─── POST /api/reviews  ────────────────────────────────────────────────────────
// Body (multipart/form-data):
//   name, email?, rating, title?, comment, propertyId?, image (file)?
export const createReview = async (req, res) => {
    try {
        // 1. Parse multipart/form-data via multer
        await runMulter(req, res);
    } catch (multerErr) {
        return res
            .status(400)
            .json({ message: multerErr.message || "File upload error" });
    }

    try {
        const { name, email, rating, title, comment, propertyId } = req.body;

        // 2. Basic validation
        if (!name || !rating || !comment) {
            return res
                .status(400)
                .json({ message: "name, rating, and comment are required." });
        }

        const ratingNum = Number(rating);
        if (ratingNum < 1 || ratingNum > 5) {
            return res
                .status(400)
                .json({ message: "Rating must be between 1 and 5." });
        }

        // 3. Upload image to Cloudinary (if provided)
        let imageUrl = null;
        let imagePublicId = null;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "realestate/reviews"
            );
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        // 4. Save to MongoDB
        const review = await Review.create({
            name: name.trim(),
            email: email?.trim().toLowerCase() || undefined,
            rating: ratingNum,
            title: title?.trim() || undefined,
            comment: comment.trim(),
            imageUrl,
            imagePublicId,
            propertyId: propertyId || null,
            isApproved: false, // pending admin approval
        });

        return res.status(201).json({
            message:
                "Review submitted successfully! It will appear after admin approval.",
            review,
        });
    } catch (err) {
        console.error("createReview error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ─── GET /api/reviews  ─────────────────────────────────────────────────────────
// Returns all APPROVED reviews (public)
export const getApprovedReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "newest" } = req.query;

        const sortOption =
            sort === "highest"
                ? { rating: -1 }
                : sort === "lowest"
                    ? { rating: 1 }
                    : { createdAt: -1 }; // newest

        const skip = (Number(page) - 1) * Number(limit);

        const [reviews, total] = await Promise.all([
            Review.find({ isApproved: true })
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Review.countDocuments({ isApproved: true }),
        ]);

        // Compute average rating
        const ratingAgg = await Review.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);
        const avgRating =
            ratingAgg.length > 0 ? Math.round(ratingAgg[0].avgRating * 10) / 10 : 0;

        return res.json({
            reviews,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            avgRating,
        });
    } catch (err) {
        console.error("getApprovedReviews error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ─── GET /api/reviews/property/:propertyId  ───────────────────────────────────
// Returns approved reviews for a specific property
export const getReviewsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        // Guard: if propertyId is not a valid ObjectId, query by string match
        // (handles placeholder IDs like "1", "2" from non-MongoDB property pages)
        const isValidObjectId = /^[a-f\d]{24}$/i.test(propertyId);

        let reviews = [];
        if (isValidObjectId) {
            reviews = await Review.find({
                propertyId,
                isApproved: true,
            })
                .sort({ createdAt: -1 })
                .lean();
        }
        // For non-ObjectId IDs (placeholder data), just return empty — no crash

        const avg =
            reviews.length > 0
                ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                : 0;

        return res.json({ reviews, avgRating: Math.round(avg * 10) / 10 });
    } catch (err) {
        console.error("getReviewsByProperty error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


// ─── GET /api/reviews/admin/all  ─────────────────────────────────────────────
// Admin: get ALL reviews (pending + approved)
export const getAllReviewsAdmin = async (req, res) => {
    try {
        const { status = "all", page = 1, limit = 20 } = req.query;
        const filter =
            status === "pending"
                ? { isApproved: false }
                : status === "approved"
                    ? { isApproved: true }
                    : {};

        const skip = (Number(page) - 1) * Number(limit);
        const [reviews, total] = await Promise.all([
            Review.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Review.countDocuments(filter),
        ]);

        return res.json({ reviews, total, page: Number(page) });
    } catch (err) {
        console.error("getAllReviewsAdmin error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ─── PATCH /api/reviews/:id/approve  ─────────────────────────────────────────
// Admin: approve a review
export const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!review) return res.status(404).json({ message: "Review not found" });
        return res.json({ message: "Review approved", review });
    } catch (err) {
        console.error("approveReview error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ─── DELETE /api/reviews/:id  ─────────────────────────────────────────────────
// Admin: delete a review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });
        return res.json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("deleteReview error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ─── PATCH /api/reviews/:id/helpful  ─────────────────────────────────────────
// Public: increment helpful count
export const markHelpful = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpfulCount: 1 } },
            { new: true }
        );
        if (!review) return res.status(404).json({ message: "Review not found" });
        return res.json({ helpfulCount: review.helpfulCount });
    } catch (err) {
        console.error("markHelpful error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
