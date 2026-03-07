import express from "express";
import Consultation from "../models/Consultation.js";

const router = express.Router();

// POST → data save
router.post("/book", async (req, res) => {
    try {
        const newConsult = new Consultation(req.body);
        await newConsult.save();

        res.status(201).json({ message: "Consultation booked successfully" });
    } catch (error) {
        console.error("Consultation save error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});
export default router;