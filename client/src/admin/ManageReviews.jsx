import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Stars({ rating }) {
  return (
    <span className="admin-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ color: s <= rating ? "#f59e0b" : "#d1d5db", fontSize: "1rem" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("all"); // all | pending | approved
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API}/api/reviews/admin/all?status=${status}&limit=50`
      );
      setReviews(data.reviews ?? []);
    } catch (_) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [status]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await axios.patch(`${API}/api/reviews/${id}/approve`);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: true } : r))
      );
      showToast("✅ Review approved and published!");
    } catch (_) {
      showToast("❌ Failed to approve review.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setActionId(id);
    try {
      await axios.delete(`${API}/api/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      showToast("🗑 Review deleted.");
    } catch (_) {
      showToast("❌ Failed to delete review.");
    } finally {
      setActionId(null);
    }
  };

  const pending = reviews.filter((r) => !r.isApproved).length;
  const approved = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="admin-reviews">
      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}

      {/* Page Header */}
      <div className="admin-reviews__header">
        <div>
          <h1 className="admin-page-title">Manage Reviews</h1>
          <p className="admin-page-sub">Approve or remove user-submitted reviews</p>
        </div>
        <div className="admin-reviews__badges">
          <span className="admin-badge admin-badge--warning">
            ⏳ {pending} Pending
          </span>
          <span className="admin-badge admin-badge--success">
            ✅ {approved} Approved
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-tabs">
        {["all", "pending", "approved"].map((s) => (
          <button
            key={s}
            className={`admin-tab ${status === s ? "admin-tab--active" : ""}`}
            onClick={() => setStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty">
          <p>No reviews found for the selected filter.</p>
        </div>
      ) : (
        <div className="admin-reviews__table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Title / Comment</th>
                <th>Photo</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rv) => (
                <tr key={rv._id} className={!rv.isApproved ? "row--pending" : ""}>
                  <td>
                    <div className="admin-reviewer">
                      <div className="admin-reviewer__avatar">
                        {rv.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="admin-reviewer__name">{rv.name}</div>
                        <div className="admin-reviewer__email">{rv.email || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Stars rating={rv.rating} />
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {rv.rating}/5
                    </div>
                  </td>
                  <td>
                    {rv.title && (
                      <div className="admin-review-title">{rv.title}</div>
                    )}
                    <div className="admin-review-comment">
                      {rv.comment.length > 120
                        ? rv.comment.slice(0, 120) + "…"
                        : rv.comment}
                    </div>
                  </td>
                  <td>
                    {rv.imageUrl ? (
                      <a href={rv.imageUrl} target="_blank" rel="noreferrer">
                        <img
                          src={rv.imageUrl}
                          alt="review"
                          className="admin-review-thumb"
                        />
                      </a>
                    ) : (
                      <span style={{ color: "#475569", fontSize: "0.8rem" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`admin-status-badge ${
                        rv.isApproved
                          ? "admin-status-badge--approved"
                          : "admin-status-badge--pending"
                      }`}
                    >
                      {rv.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {new Date(rv.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="admin-actions">
                      {!rv.isApproved && (
                        <button
                          className="admin-btn admin-btn--approve"
                          disabled={actionId === rv._id}
                          onClick={() => handleApprove(rv._id)}
                        >
                          {actionId === rv._id ? "…" : "✅ Approve"}
                        </button>
                      )}
                      <button
                        className="admin-btn admin-btn--delete"
                        disabled={actionId === rv._id}
                        onClick={() => handleDelete(rv._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
