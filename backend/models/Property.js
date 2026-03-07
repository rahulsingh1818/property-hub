import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["rent", "sale"], default: "sale" },
    category: {
      type: String,
      enum: ["Apartment", "Villa", "Bungalow", "Studio", "Plot", "Office", "Other"],
      default: "Apartment",
    },
    bedrooms: { type: Number, default: 2 },
    bathrooms: { type: Number, default: 1 },
    area: { type: Number, default: 0 }, // in sq ft
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    dealer: { type: String, default: "Admin" }, // dealer name or id
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    amenities: [{ type: String }],
    agentName: { type: String, default: "" },
    agentPhone: { type: String, default: "" },
    agentEmail: { type: String, default: "" },
    agentAvatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;