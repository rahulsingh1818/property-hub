import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function Wishlist() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!user?.id) { navigate("/login"); return; }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/wishlist/user/${user.id}`);
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    setRemoving(propertyId);
    try {
      await axios.post(`${API}/api/wishlist/toggle`, {
        userId: user.id,
        propertyId,
      });
      setItems((prev) => prev.filter((i) => i.propertyId !== propertyId));
    } catch {
      // silent
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafd", padding: "32px 16px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              background: "linear-gradient(135deg,#ef4444,#f97316)",
              borderRadius: 14, width: 48, height: 48,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
            }}>
              ❤️
            </div>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f2540", margin: 0 }}>
                My Wishlist
              </h1>
              <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
                Your saved favourite properties
              </p>
            </div>
          </div>

          {!loading && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 30, padding: "6px 14px",
              fontSize: "0.82rem", fontWeight: 600, color: "#475569",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}>
              <span style={{ color: "#ef4444" }}>♥</span> {items.length} saved propert{items.length === 1 ? "y" : "ies"}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 20,
                height: 320, animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "#fff", borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "5rem", marginBottom: 16 }}>🏡</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f2540", marginBottom: 8 }}>
              No saved properties yet
            </h2>
            <p style={{ color: "#64748b", marginBottom: 28 }}>
              Click the ❤️ heart on any property to add it to your wishlist
            </p>
            <Link
              to="/properties"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff", fontWeight: 700,
                padding: "12px 32px", borderRadius: 14,
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(37,99,235,0.3)",
              }}
            >
              Browse Properties →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  background: "#fff", borderRadius: 20,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.13)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative" }}>
                  <img
                    src={item.propertyImage || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80"}
                    alt={item.propertyTitle}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.propertyId)}
                    disabled={removing === item.propertyId}
                    title="Remove from wishlist"
                    style={{
                      position: "absolute", top: 10, right: 10,
                      background: removing === item.propertyId ? "rgba(156,163,175,0.9)" : "rgba(239,68,68,0.9)",
                      border: "none", borderRadius: "50%",
                      width: 36, height: 36,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: removing === item.propertyId ? "default" : "pointer",
                      backdropFilter: "blur(4px)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <svg viewBox="0 0 20 20" style={{ width: 16, height: 16, fill: "#fff" }}>
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Type badge */}
                  {item.propertyType && (
                    <div style={{
                      position: "absolute", bottom: 10, left: 10,
                      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
                      borderRadius: 20, padding: "3px 10px",
                      fontSize: "0.75rem", fontWeight: 600, color: "#1e293b",
                    }}>
                      {item.propertyType.charAt(0).toUpperCase() + item.propertyType.slice(1)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px 18px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f2540", marginBottom: 6 }}>
                    {item.propertyTitle}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: "0.85rem", marginBottom: 10 }}>
                    <svg viewBox="0 0 20 20" style={{ width: 13, height: 13, fill: "currentColor", flexShrink: 0 }}>
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {item.propertyLocation}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{
                      fontSize: "1.25rem", fontWeight: 800,
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>
                      {item.propertyPrice}
                    </div>
                    <Link
                      to={`/property/${item.propertyId}`}
                      style={{
                        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                        color: "#fff", fontWeight: 600,
                        padding: "7px 16px", borderRadius: 10,
                        textDecoration: "none", fontSize: "0.82rem",
                        transition: "opacity 0.2s",
                      }}
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
