import express from "express";
import {
    getAllUsers,
    deleteUser,
    updateUser,
    adminGetAllProperties,
    adminCreateProperty,
    adminUpdateProperty,
    adminDeleteProperty,
    approveProperty,
    rejectProperty,
    getDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", getDashboardStats);

// User routes
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Property routes
router.get("/properties", adminGetAllProperties);
router.post("/properties", adminCreateProperty);
router.put("/properties/:id", adminUpdateProperty);
router.delete("/properties/:id", adminDeleteProperty);
router.patch("/properties/:id/approve", approveProperty);
router.patch("/properties/:id/reject", rejectProperty);

export default router;
