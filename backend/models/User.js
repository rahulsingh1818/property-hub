import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // password is optional for Google/OAuth users
        password: { type: String, default: null },
        phone: { type: String, default: "" },
        role: {
            type: String,
            enum: ["buyer", "seller", "agent", "admin"],
            default: "buyer"
        },
        avatar: { type: String, default: "" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isEmailVerified: { type: Boolean, default: false },
        // OAuth / Google login fields
        googleId: { type: String, default: null },
        authProvider: { type: String, enum: ["local", "google"], default: "local" },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);