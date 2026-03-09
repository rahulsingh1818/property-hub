import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Star component ─────────────────────────────────────────────────────────────
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-selector" role="group" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= (hovered || value) ? "active" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Review Form ────────────────────────────────────────────────────────────────
export default function ReviewForm({ propertyId = null, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) return setError("Please enter your name.");
    if (form.rating === 0) return setError("Please select a rating.");
    if (!form.comment.trim()) return setError("Please write a comment.");

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("email", form.email.trim());
      data.append("rating", form.rating);
      data.append("title", form.title.trim());
      data.append("comment", form.comment.trim());
      if (propertyId) data.append("propertyId", propertyId);
      if (image) data.append("image", image);

      await axios.post(`${API}/api/reviews`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(
        "✅ Review submitted! It will appear after admin approval. Thank you!"
      );
      setForm({ name: "", email: "", rating: 0, title: "", comment: "" });
      setImage(null);
      setPreview(null);
      onSuccess?.();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="review-form__title">Write a Review</h3>

      {error && <div className="review-alert review-alert--error">{error}</div>}
      {success && (
        <div className="review-alert review-alert--success">{success}</div>
      )}

      {/* Name + Email row */}
      <div className="review-form__row">
        <div className="review-form__field">
          <label htmlFor="rv-name">Your Name *</label>
          <input
            id="rv-name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            maxLength={80}
          />
        </div>
        <div className="review-form__field">
          <label htmlFor="rv-email">Email (optional)</label>
          <input
            id="rv-email"
            name="email"
            type="email"
            placeholder="john@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="review-form__field review-form__field--full">
        <label>Your Rating *</label>
        <StarSelector
          value={form.rating}
          onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
        />
        <span className="review-form__rating-text">
          {form.rating === 0
            ? "Select stars"
            : ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                form.rating
              ]}
        </span>
      </div>

      {/* Title */}
      <div className="review-form__field review-form__field--full">
        <label htmlFor="rv-title">Review Title (optional)</label>
        <input
          id="rv-title"
          name="title"
          type="text"
          placeholder="Summarize your experience in one line"
          value={form.title}
          onChange={handleChange}
          maxLength={120}
        />
      </div>

      {/* Comment */}
      <div className="review-form__field review-form__field--full">
        <label htmlFor="rv-comment">Your Review *</label>
        <textarea
          id="rv-comment"
          name="comment"
          rows={5}
          placeholder="Share your experience with this property or our services..."
          value={form.comment}
          onChange={handleChange}
          maxLength={2000}
        />
        <span className="review-form__char-count">
          {form.comment.length}/2000
        </span>
      </div>

      {/* Image Upload */}
      <div className="review-form__field review-form__field--full">
        <label>Upload Photo (optional)</label>
        <div className="review-form__upload-area">
          <input
            id="rv-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="review-form__file-input"
          />
          <label htmlFor="rv-image" className="review-form__upload-btn">
            <span className="upload-icon">📷</span>
            {image ? image.name : "Choose Photo (JPG, PNG, WebP — max 10MB)"}
          </label>
          {preview && (
            <div className="review-form__preview">
              <img src={preview} alt="Preview" />
              <button
                type="button"
                className="review-form__remove-img"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="review-form__submit"
        disabled={loading}
      >
        {loading ? (
          <span className="review-spinner" />
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}
