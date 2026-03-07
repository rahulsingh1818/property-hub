import User from "../models/User.js";
import Property from "../models/Property.js";

// ─── USERS ───────────────────────────────────────────────────────────────────

// GET all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE user role/status
export const updateUser = async (req, res) => {
    try {
        const { role, status, name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, status, name },
            { new: true }
        ).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ─── PROPERTIES ─────────────────────────────────────────────────────────────

// GET all properties (admin sees all)
export const adminGetAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// CREATE property (admin)
export const adminCreateProperty = async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE property
export const adminUpdateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE property
export const adminDeleteProperty = async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// APPROVE property
export const approveProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// REJECT property
export const rejectProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const activeListings = await Property.countDocuments({ status: "approved" });
        const pendingListings = await Property.countDocuments({ status: "pending" });
        const totalDealers = await User.countDocuments({ role: "dealer" });

        // Property distribution by category
        const categoryStats = await Property.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        // Recent properties
        const recentProperties = await Property.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent users
        const recentUsers = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            totalProperties,
            activeListings,
            pendingListings,
            totalDealers,
            categoryStats,
            recentProperties,
            recentUsers,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
