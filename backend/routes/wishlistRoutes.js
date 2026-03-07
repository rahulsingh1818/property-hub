import express from "express";
import {
    toggleWishlist,
    getUserWishlist,
    checkWishlist,
    getAllWishlistsAdmin,
    deleteWishlistItem,
} from "../controllers/wishlistController.js";

const router = express.Router();

// Public (user must provide userId in body/query — simple auth)
router.post("/toggle", toggleWishlist);            // Add or remove
router.get("/user/:userId", getUserWishlist);      // Get user's wishlist
router.get("/check", checkWishlist);               // Check single property

// Admin
router.get("/admin/all", getAllWishlistsAdmin);    // All wishlists
router.delete("/:id", deleteWishlistItem);         // Delete item

export default router;
