import mongoose from "mongoose";

const visitBookingSchema = new mongoose.Schema(
    {
        // Visitor details
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [80, "Name cannot exceed 80 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            maxlength: [20, "Phone cannot exceed 20 characters"],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [1000, "Message cannot exceed 1000 characters"],
            default: "",
        },

        // Which property this booking is for
        propertyId: {
            type: String, // kept as String to support both ObjectId & placeholder IDs
            default: null,
        },
        propertyTitle: {
            type: String,
            trim: true,
            default: "",
        },

        // Booking status
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true } // createdAt, updatedAt auto
);

// Index for quick admin lookup by status & date
visitBookingSchema.index({ status: 1, createdAt: -1 });

const VisitBooking = mongoose.model("VisitBooking", visitBookingSchema);
export default VisitBooking;
