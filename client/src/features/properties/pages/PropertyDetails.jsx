import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ReviewSection from "../../reviews/ReviewSection";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Visit Booking Form (sidebar) ────────────────────────────────────────────────
function VisitBookingForm({ propertyId, propertyTitle, price }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");

    try {
      setLoading(true);
      await axios.post(`${API}/api/visits`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        propertyId,
        propertyTitle,
      });
      setSuccess("✅ Visit booked! Our team will call you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-6 sticky top-20">
      {/* Price */}
      <div className="text-4xl font-bold text-gradient mb-2">{price}</div>
      <p className="text-slate-500 text-sm mb-6">Schedule a property visit</p>

      {/* Alerts */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fca5a5",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 14,
            fontSize: "0.88rem",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            background: "#d1fae5",
            color: "#059669",
            border: "1px solid #6ee7b7",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 14,
            fontSize: "0.88rem",
            fontWeight: 500,
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="visit-name"
              style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}
            >
              Full Name *
            </label>
            <input
              id="visit-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="input-field"
              value={form.name}
              onChange={handleChange}
              maxLength={80}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="visit-email"
              style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}
            >
              Email Address *
            </label>
            <input
              id="visit-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="visit-phone"
              style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}
            >
              Phone Number *
            </label>
            <input
              id="visit-phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="input-field"
              value={form.phone}
              onChange={handleChange}
              maxLength={20}
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="visit-message"
              style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}
            >
              Message (optional)
            </label>
            <textarea
              id="visit-message"
              name="message"
              placeholder="Any specific questions or preferred visit time?"
              rows="3"
              className="input-field"
              style={{ resize: "vertical" }}
              value={form.message}
              onChange={handleChange}
              maxLength={1000}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.75 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Booking…
              </>
            ) : (
              "📅 Schedule a Visit"
            )}
          </button>
        </div>
      </form>

      {/* Trust badges */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          gap: 16,
          fontSize: "0.75rem",
          color: "#94a3b8",
        }}
      >
        <span>🔒 Secure</span>
        <span>⚡ Quick Response</span>
        <span>✅ No Spam</span>
      </div>
    </div>
  );
}

// ── Main PropertyDetails ────────────────────────────────────────────────────────
export function PropertyDetails() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  const property = {
    id: id,
    title: "Modern Luxury Villa",
    location: "South Delhi, New Delhi",
    price: "₹2.5 Cr",
    beds: 4,
    baths: 3,
    area: "3500 sq.ft",
    type: "Villa",
    yearBuilt: "2022",
    parking: "2 Cars",
    description:
      "Experience luxury living in this stunning modern villa featuring contemporary architecture, premium finishes, and state-of-the-art amenities. Located in the heart of South Delhi, this property offers the perfect blend of comfort and sophistication.",
    features: [
      "Swimming Pool",
      "Home Theater",
      "Modular Kitchen",
      "Smart Home System",
      "Gym",
      "Garden",
      "Security System",
      "Power Backup",
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-slate-600">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/properties" className="hover:text-blue-600">Properties</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-900">{property.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="card mb-6">
              <div className="relative">
                <img
                  src={property.images[activeImage]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-t-2xl"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  {property.type}
                </div>
              </div>

              <div className="p-4 grid grid-cols-4 gap-3">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`View ${index + 1}`}
                    onClick={() => setActiveImage(index)}
                    className={`h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                      activeImage === index
                        ? "ring-4 ring-blue-600 scale-105"
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="card p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                {property.title}
              </h1>

              <div className="flex items-center text-slate-600 mb-6">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: "🛏️", label: "Bedrooms", value: property.beds },
                  { icon: "🚿", label: "Bathrooms", value: property.baths },
                  { icon: "📏", label: "Area", value: property.area },
                  { icon: "🚗", label: "Parking", value: property.parking },
                ].map((item, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-sm text-slate-600">{item.label}</div>
                    <div className="font-semibold text-slate-900">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-slate-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Features */}
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Features &amp; Amenities</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reviews & Ratings ── */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <ReviewSection propertyId={id} />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <VisitBookingForm
              propertyId={id}
              propertyTitle={property.title}
              price={property.price}
            />
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}