import express from "express";
import {
    createVisitBooking,
    getAllVisitBookings,
    updateVisitStatus,
    deleteVisitBooking,
} from "../controllers/visitController.js";

const router = express.Router();

// Public: submit a visit booking
router.post("/", createVisitBooking);

// Admin: get all bookings
router.get("/", getAllVisitBookings);

// Admin: update status (pending → confirmed / cancelled)
router.patch("/:id/status", updateVisitStatus);

// Admin: delete a booking
router.delete("/:id", deleteVisitBooking);

export default router;
