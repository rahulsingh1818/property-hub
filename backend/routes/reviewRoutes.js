import express from "express";
import {
    createReview,
    getApprovedReviews,
    getReviewsByProperty,
    getAllReviewsAdmin,
    approveReview,
    deleteReview,
    markHelpful,
} from "../controllers/reviewController.js";

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
// Submit a new review (with optional image)
router.post("/", createReview);

// Get all approved reviews (with pagination & sort)
router.get("/", getApprovedReviews);

// Get approved reviews for a specific property
router.get("/property/:propertyId", getReviewsByProperty);

// Mark a review as helpful
router.patch("/:id/helpful", markHelpful);

// ── Admin Routes ──────────────────────────────────────────────────────────────
// Get ALL reviews (any status) — used by admin panel
router.get("/admin/all", getAllReviewsAdmin);

// Approve a review
router.patch("/:id/approve", approveReview);

// Delete a review
router.delete("/:id", deleteReview);

export default router;
