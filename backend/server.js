import "dotenv/config";   // ← MUST be first: loads .env before any other import
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

// Atlas connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected || Database Connected successfully"))
  .catch((err) => console.log("DB Error:", err));

// ✅ Frontend static files serve karo (client/dist)
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// ✅ React Router ke liye catch-all route (API routes ke baad)
app.get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

app.listen(5000, () => console.log("Server running on port 5000"));

// mongoose
//   .connect("mongodb://127.0.0.1:27017/realestate")
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });