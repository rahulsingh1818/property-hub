import { useState, useEffect, useCallback } from "react";
import "./reviews.css";
import axios from "axios";
import ReviewForm from "./ReviewForm";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Star display (read-only) ────────────────────────────────────────────────────
function Stars({ rating, size = "md" }) {
  return (
    <div className={`stars stars--${size}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "star star--filled" : "star star--empty"}>
          ★
        </span>
      ))}
    </div>
  );
}

// ── Rating Breakdown Bar ───────────────────────────────────────────────────────
function RatingBar({ label, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="rating-bar">
      <span className="rating-bar__label">{label} ★</span>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rating-bar__count">{count}</span>
    </div>
  );
}

// ── Single Review Card ─────────────────────────────────────────────────────────
function ReviewCard({ review, onHelpful }) {
  const [helpedClicked, setHelpedClicked] = useState(false);

  const handleHelpful = async () => {
    if (helpedClicked) return;
    try {
      await axios.patch(`${API}/api/reviews/${review._id}/helpful`);
      setHelpedClicked(true);
      onHelpful(review._id);
    } catch (_) {}
  };

  const ago = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  return (
    <div className="review-card">
      {/* Header */}
      <div className="review-card__header">
        <div className="review-card__avatar">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div className="review-card__meta">
          <span className="review-card__name">{review.name}</span>
          <span className="review-card__date">{ago(review.createdAt)}</span>
        </div>
        <div className="review-card__rating">
          <Stars rating={review.rating} size="sm" />
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="review-card__title">{review.title}</h4>
      )}

      {/* Comment */}
      <p className="review-card__comment">{review.comment}</p>

      {/* Photo */}
      {review.imageUrl && (
        <div className="review-card__photo">
          <img src={review.imageUrl} alt="Review photo" loading="lazy" />
        </div>
      )}

      {/* Footer */}
      <div className="review-card__footer">
        <button
          className={`helpful-btn ${helpedClicked ? "helpful-btn--clicked" : ""}`}
          onClick={handleHelpful}
          disabled={helpedClicked}
        >
          👍 Helpful ({review.helpfulCount + (helpedClicked ? 1 : 0)})
        </button>
        <span className="review-card__badge">
          ✅ Verified Review
        </span>
      </div>
    </div>
  );
}

// ── Main ReviewSection ──────────────────────────────────────────────────────────
export default function ReviewSection({ propertyId = null }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, total: 0, pages: 1 });
  const [starCounts, setStarCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const url = propertyId
        ? `${API}/api/reviews/property/${propertyId}`
        : `${API}/api/reviews?page=${page}&limit=8&sort=${sort}`;
      const { data } = await axios.get(url);

      const list = data.reviews ?? data;
      setReviews(list);
      setStats({
        avgRating: data.avgRating ?? 0,
        total: data.total ?? list.length,
        pages: data.pages ?? 1,
      });

      // compute per-star counts
      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      list.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) counts[r.rating]++; });
      setStarCounts(counts);
    } catch (_) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId, page, sort]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleHelpful = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  return (
    <section className="review-section">
      {/* ── Heading ── */}
      <div className="review-section__header">
        <div>
          <h2 className="review-section__title">Client Reviews</h2>
          <p className="review-section__sub">
            Real experiences from real people
          </p>
        </div>
        <button
          className="write-review-btn"
          onClick={() => setShowForm((p) => !p)}
        >
          {showForm ? "✕ Close Form" : "✍ Write a Review"}
        </button>
      </div>

      {/* ── Summary Panel ── */}
      {stats.total > 0 && (
        <div className="review-summary">
          <div className="review-summary__score">
            <span className="review-summary__avg">{stats.avgRating}</span>
            <Stars rating={Math.round(stats.avgRating)} size="lg" />
            <span className="review-summary__count">
              {stats.total} review{stats.total !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="review-summary__bars">
            {[5, 4, 3, 2, 1].map((s) => (
              <RatingBar
                key={s}
                label={s}
                count={starCounts[s]}
                total={stats.total}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Review Form (collapsible) ── */}
      {showForm && (
        <div className="review-form-wrapper">
          <ReviewForm
            propertyId={propertyId}
            onSuccess={() => {
              setShowForm(false);
              fetchReviews();
            }}
          />
        </div>
      )}

      {/* ── Sort + Filter Controls ── */}
      {reviews.length > 0 && !propertyId && (
        <div className="review-controls">
          <span className="review-controls__label">Sort by:</span>
          {["newest", "highest", "lowest"].map((s) => (
            <button
              key={s}
              className={`review-controls__btn ${sort === s ? "active" : ""}`}
              onClick={() => { setSort(s); setPage(1); }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ── Review Grid ── */}
      {loading ? (
        <div className="review-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="review-skeleton" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="review-empty">
          <div className="review-empty__icon">💬</div>
          <h3>No reviews yet</h3>
          <p>Be the first to share your experience!</p>
          <button
            className="write-review-btn"
            onClick={() => setShowForm(true)}
          >
            ✍ Write a Review
          </button>
        </div>
      ) : (
        <div className="review-grid">
          {reviews.map((rv) => (
            <ReviewCard key={rv._id} review={rv} onHelpful={handleHelpful} />
          ))}
        </div>
      )}

      {/* ── Pagination (only for global reviews page) ── */}
      {!propertyId && stats.pages > 1 && (
        <div className="review-pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {page} of {stats.pages}
          </span>
          <button
            className="page-btn"
            disabled={page === stats.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
