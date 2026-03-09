import "dotenv/config";   // ← MUST be first
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/wishlist", wishlistRoutes);

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected || Database Connected successfully"))
  .catch((err) => console.log("DB Error:", err));


// ✅ Frontend static files serve
app.use(express.static(path.join(__dirname, "..", "client", "dist")));


// ✅ React Router ke liye catch-all route
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// ✅ Render ke liye dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));