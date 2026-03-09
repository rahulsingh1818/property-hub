import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function ManageWishlists() {
  const [items, setItems]     = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState("");
  const [deleting, setDeleting] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/wishlist/admin/all?limit=200`);
      setItems(data.items ?? []);
      setPopular(data.popularProperties ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this wishlist item?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/api/wishlist/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      showToast("🗑 Item removed from wishlist.");
    } catch {
      showToast("❌ Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.userName?.toLowerCase().includes(q) ||
      item.userEmail?.toLowerCase().includes(q) ||
      item.propertyTitle?.toLowerCase().includes(q) ||
      item.propertyLocation?.toLowerCase().includes(q)
    );
  });

  const statsData = [
    { label: "Total Saves",    value: items.length,   color: "text-blue-300" },
    { label: "Most Saved",     value: popular[0]?._id?.slice(0, 8) || "—", color: "text-yellow-400", small: true },
    { label: "Top Save Count", value: popular[0]?.count ?? 0, color: "text-emerald-400" },
    { label: "Unique Props",   value: popular.length, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6" style={{ position: "relative" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: "#1e3a5f", color: "#fff", padding: "12px 20px",
          borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          fontSize: "0.9rem", fontWeight: 600,
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">User Wishlists</h1>
        <p className="text-gray-700">See which properties users are saving as favourites</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((s, i) => (
          <div key={i} className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
            <div className={`text-2xl font-bold ${s.color} ${s.small ? "text-base" : ""}`}>{s.value}</div>
            <div className="text-white text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Popular Properties Summary */}
      {popular.length > 0 && (
        <div className="bg-blue-800 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            🏆 Most Saved Properties
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popular.slice(0, 5).map((p, i) => (
              <div key={i} className="bg-blue-900/50 border border-blue-600/40 rounded-xl p-3">
                <div className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  #{i + 1} Most Saved
                </div>
                <div className="text-white text-sm font-bold truncate">
                  {p._id || "Unknown"}
                </div>
                <div className="text-red-400 text-sm font-semibold mt-1">
                  ❤️ {p.count} save{p.count !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
        <input
          type="text"
          placeholder="🔍  Search by user name, email, or property…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-blue-800 border border-gray-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-3">❤️</div>
          <div className="text-white text-xl font-semibold mb-2">No wishlist entries found</div>
          <div className="text-blue-200">Try adjusting your search</div>
        </div>
      ) : (
        <div className="bg-blue-800 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900/60 border-b border-blue-700">
                  {["User", "Property", "Location", "Price", "Saved On", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700/50">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {(item.userName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{item.userName || "Guest"}</div>
                          <div className="text-blue-300 text-xs">{item.userEmail || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.propertyImage && (
                          <img
                            src={item.propertyImage}
                            alt={item.propertyTitle}
                            className="w-11 h-9 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="text-white text-sm font-semibold">{item.propertyTitle || "—"}</div>
                          <div className="text-blue-300 text-xs">ID: {item.propertyId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-blue-200 text-sm">
                      {item.propertyLocation || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-blue-400 font-bold text-sm">{item.propertyPrice || "—"}</div>
                    </td>
                    <td className="px-5 py-4 text-blue-200 text-sm">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        disabled={deleting === item._id}
                        onClick={() => handleDelete(item._id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-500/30 text-red-400 font-medium transition-colors disabled:opacity-50"
                      >
                        {deleting === item._id ? "…" : "🗑 Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
