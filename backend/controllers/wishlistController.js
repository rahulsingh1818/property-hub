import Wishlist from "../models/Wishlist.js";

// ─── POST /api/wishlist/toggle  ──────────────────────────────────────────────
// Add if not exists, remove if exists (toggle)
export const toggleWishlist = async (req, res) => {
    try {
        const {
            userId, userName, userEmail,
            propertyId, propertyTitle, propertyLocation,
            propertyPrice, propertyImage, propertyType,
        } = req.body;

        if (!userId || !propertyId) {
            return res.status(400).json({ message: "userId and propertyId are required." });
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({ userId, propertyId });

        if (existing) {
            // Remove from wishlist
            await Wishlist.deleteOne({ userId, propertyId });
            return res.json({ wishlisted: false, message: "Removed from wishlist." });
        } else {
            // Add to wishlist
            await Wishlist.create({
                userId, userName, userEmail,
                propertyId, propertyTitle, propertyLocation,
                propertyPrice, propertyImage, propertyType,
            });
            return res.status(201).json({ wishlisted: true, message: "Added to wishlist!" });
        }
    } catch (err) {
        // Handle duplicate key error (race condition)
        if (err.code === 11000) {
            return res.json({ wishlisted: true, message: "Already in wishlist." });
        }
        console.error("toggleWishlist error:", err);
        return res.status(500).json({ message: "Server error." });
    }
};

// ─── GET /api/wishlist/user/:userId  ─────────────────────────────────────────
// Get all wishlist items for a specific user
export const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await Wishlist.find({ userId }).sort({ createdAt: -1 }).lean();
        return res.json({ items, total: items.length });
    } catch (err) {
        console.error("getUserWishlist error:", err);
        return res.status(500).json({ message: "Server error." });
    }
};

// ─── GET /api/wishlist/check  ─────────────────────────────────────────────────
// Check if a specific property is in user's wishlist
// Query: ?userId=xxx&propertyId=yyy
export const checkWishlist = async (req, res) => {
    try {
        const { userId, propertyId } = req.query;
        if (!userId || !propertyId) {
            return res.json({ wishlisted: false });
        }
        const item = await Wishlist.findOne({ userId, propertyId }).lean();
        return res.json({ wishlisted: !!item });
    } catch (err) {
        console.error("checkWishlist error:", err);
        return res.status(500).json({ message: "Server error." });
    }
};

// ─── GET /api/wishlist/admin/all  ────────────────────────────────────────────
// Admin: get ALL wishlist items (all users)
export const getAllWishlistsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
            Wishlist.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Wishlist.countDocuments(),
        ]);

        // Group stats
        const propertyStats = await Wishlist.aggregate([
            { $group: { _id: "$propertyTitle", count: { $sum: 1 }, propertyId: { $first: "$propertyId" } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        return res.json({ items, total, page: Number(page), popularProperties: propertyStats });
    } catch (err) {
        console.error("getAllWishlistsAdmin error:", err);
        return res.status(500).json({ message: "Server error." });
    }
};

// ─── DELETE /api/wishlist/:id  ────────────────────────────────────────────────
// Admin: delete a wishlist item
export const deleteWishlistItem = async (req, res) => {
    try {
        const item = await Wishlist.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found." });
        return res.json({ message: "Wishlist item removed." });
    } catch (err) {
        console.error("deleteWishlistItem error:", err);
        return res.status(500).json({ message: "Server error." });
    }
};
