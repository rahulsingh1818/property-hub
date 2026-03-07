import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  message: String,
}, { timestamps: true });

export default mongoose.model("Consultation", consultationSchema);