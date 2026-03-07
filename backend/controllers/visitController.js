import VisitBooking from "../models/VisitBooking.js";

// ─── POST /api/visits  ────────────────────────────────────────────────────────
// Book a visit for a property
export const createVisitBooking = async (req, res) => {
    try {
        const { name, email, phone, message, propertyId, propertyTitle } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required." });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!phone || !phone.trim()) {
            return res.status(400).json({ message: "Phone number is required." });
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        const booking = await VisitBooking.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            message: message?.trim() || "",
            propertyId: propertyId || null,
            propertyTitle: propertyTitle?.trim() || "",
            status: "pending",
        });

        return res.status(201).json({
            message: "Visit booked successfully! We will contact you shortly.",
            booking,
        });
    } catch (err) {
        console.error("createVisitBooking error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ─── GET /api/visits  ─────────────────────────────────────────────────────────
// Admin: get all visit bookings
export const getAllVisitBookings = async (req, res) => {
    try {
        const { status = "all", page = 1, limit = 20 } = req.query;
        const filter = status === "all" ? {} : { status };

        const skip = (Number(page) - 1) * Number(limit);
        const [bookings, total] = await Promise.all([
            VisitBooking.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            VisitBooking.countDocuments(filter),
        ]);

        return res.json({ bookings, total, page: Number(page) });
    } catch (err) {
        console.error("getAllVisitBookings error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ─── PATCH /api/visits/:id/status  ───────────────────────────────────────────
// Admin: update booking status
export const updateVisitStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ["pending", "confirmed", "cancelled"];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const booking = await VisitBooking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        return res.json({ message: `Booking marked as ${status}`, booking });
    } catch (err) {
        console.error("updateVisitStatus error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ─── DELETE /api/visits/:id  ──────────────────────────────────────────────────
// Admin: delete a booking
export const deleteVisitBooking = async (req, res) => {
    try {
        const booking = await VisitBooking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        return res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        console.error("deleteVisitBooking error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
