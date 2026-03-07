import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        // User who saved this property
        userId: {
            type: String, // stored as string to match localStorage user.id
            required: true,
        },
        userName: {
            type: String,
            default: "",
        },
        userEmail: {
            type: String,
            default: "",
        },

        // Property info (snapshot at time of saving)
        propertyId: {
            type: String,
            required: true,
        },
        propertyTitle: {
            type: String,
            default: "",
        },
        propertyLocation: {
            type: String,
            default: "",
        },
        propertyPrice: {
            type: String,
            default: "",
        },
        propertyImage: {
            type: String,
            default: "",
        },
        propertyType: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// One user can only save a property once
wishlistSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
