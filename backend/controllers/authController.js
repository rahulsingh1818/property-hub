import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const JWT_EXPIRES = "7d";

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const allowedRoles = ["buyer", "seller", "agent"];
        const userRole = allowedRoles.includes(role) ? role : "buyer";

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || "",
            role: userRole,
            authProvider: "local",
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.status(201).json({
            message: "Registration successful! Welcome aboard.",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                avatar: newUser.avatar || "",
                authProvider: "local",
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (user.status === "inactive") {
            return res.status(403).json({ message: "Your account has been suspended. Contact support." });
        }

        // Google-only accounts have no password set
        if (!user.password) {
            return res.status(400).json({
                message: "This account uses Google sign-in. Please use \"Continue with Google\" to log in."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            message: "Login successful! Welcome back.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                authProvider: user.authProvider,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ─── FORGOT PASSWORD (placeholder) ───────────────────────────────────────────
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Always respond the same way to prevent email enumeration
        res.json({ message: "If an account exists with that email, a reset link has been sent." });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ─── GOOGLE LOGIN ─────────────────────────────────────────────────────────────
// Called after Firebase Google sign-in on the client.
// Receives the Google user's profile, upserts in MongoDB, returns a JWT.
export const googleLogin = async (req, res) => {
    try {
        const { name, email, googleId, avatar } = req.body;

        if (!email || !googleId) {
            return res.status(400).json({ message: "Google account information is incomplete." });
        }

        // Find existing user or create a new one
        let user = await User.findOne({ email });

        if (user) {
            // If the account was created via normal registration, link the Google ID now
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = "google";
                user.isEmailVerified = true;
                if (avatar && !user.avatar) user.avatar = avatar;
                await user.save();
            }

            // Block suspended accounts
            if (user.status === "inactive") {
                return res.status(403).json({ message: "Your account has been suspended. Contact support." });
            }
        } else {
            // Brand new user coming via Google
            user = await User.create({
                name,
                email,
                googleId,
                avatar: avatar || "",
                authProvider: "google",
                isEmailVerified: true,
                role: "buyer", // default role; user can update later
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            message: "Google login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};