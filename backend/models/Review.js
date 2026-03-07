import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        // Who wrote the review
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [80, "Name cannot exceed 80 characters"],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        // Rating: 1 – 5 stars
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
        },

        // Review text
        title: {
            type: String,
            trim: true,
            maxlength: [120, "Title cannot exceed 120 characters"],
        },
        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
            maxlength: [2000, "Comment cannot exceed 2000 characters"],
        },

        // Optional image uploaded to Cloudinary
        imageUrl: {
            type: String,
            default: null,
        },
        imagePublicId: {
            type: String,
            default: null,
        },

        // Optional: link review to a specific property
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            default: null,
        },

        // Moderation
        isApproved: {
            type: Boolean,
            default: false, // admin must approve before public display
        },

        // Helpful votes
        helpfulCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true } // adds createdAt & updatedAt automatically
);

// Index for quick lookups by property
reviewSchema.index({ propertyId: 1, isApproved: 1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
