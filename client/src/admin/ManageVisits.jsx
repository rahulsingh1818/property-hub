import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_COLORS = {
  pending:   { bg: "rgba(245,158,11,0.20)",  color: "#f59e0b", border: "rgba(245,158,11,0.4)"  },
  confirmed: { bg: "rgba(5,150,105,0.20)",   color: "#10b981", border: "rgba(16,185,129,0.4)"  },
  cancelled: { bg: "rgba(220,38,38,0.18)",   color: "#f87171", border: "rgba(248,113,113,0.4)" },
};

export function ManageVisits() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast]     = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API}/api/visits?status=${filter}&limit=100`
      );
      setBookings(data.bookings ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const handleStatus = async (id, status) => {
    setActionId(id);
    try {
      await axios.patch(`${API}/api/visits/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      showToast(`✅ Booking marked as ${status}`);
    } catch {
      showToast("❌ Failed to update status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    setActionId(id);
    try {
      await axios.delete(`${API}/api/visits/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      showToast("🗑 Booking deleted.");
    } catch {
      showToast("❌ Failed to delete.");
    } finally {
      setActionId(null);
    }
  };

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const statsData = [
    { label: "Total Bookings", value: counts.all,       color: "text-blue-300" },
    { label: "Pending",        value: counts.pending,   color: "text-yellow-400" },
    { label: "Confirmed",      value: counts.confirmed, color: "text-emerald-400" },
    { label: "Cancelled",      value: counts.cancelled, color: "text-red-400" },
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
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Visit Bookings</h1>
        <p className="text-gray-700">Manage property visit requests from potential buyers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((s, i) => (
          <div key={i} className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs / Filter */}
      <div className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === s
                  ? "bg-white text-gray-800"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {s === "all" ? `All (${counts.all})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-blue-800 border border-gray-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-3">📅</div>
          <div className="text-white text-xl font-semibold mb-2">No visit bookings found</div>
          <div className="text-blue-200">Try selecting a different filter</div>
        </div>
      ) : (
        <div className="bg-blue-800 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900/60 border-b border-blue-700">
                  {["Visitor", "Contact", "Property", "Message", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700/50">
                {bookings.map((b) => {
                  const sc = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
                  return (
                    <tr key={b._id} className="hover:bg-blue-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {b.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-white font-medium text-sm">{b.name}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-blue-200 text-xs">✉️ {b.email}</div>
                        <div className="text-blue-200 text-xs mt-1">📞 {b.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-white text-sm font-medium">{b.propertyTitle || "—"}</div>
                        {b.propertyId && (
                          <div className="text-blue-300 text-xs mt-0.5">ID: {b.propertyId}</div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-blue-100 text-xs max-w-[160px]">
                          {b.message ? (b.message.length > 80 ? b.message.slice(0, 80) + "…" : b.message)
                            : <span className="text-blue-400">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span style={{
                          display: "inline-block", padding: "4px 12px", borderRadius: 50,
                          fontSize: "0.75rem", fontWeight: 600, background: sc.bg,
                          color: sc.color, border: `1px solid ${sc.border}`, textTransform: "capitalize",
                        }}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-blue-200 text-sm">
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {b.status !== "confirmed" && (
                            <button
                              disabled={actionId === b._id}
                              onClick={() => handleStatus(b._id, "confirmed")}
                              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50"
                            >
                              {actionId === b._id ? "…" : "✅ Confirm"}
                            </button>
                          )}
                          {b.status !== "cancelled" && (
                            <button
                              disabled={actionId === b._id}
                              onClick={() => handleStatus(b._id, "cancelled")}
                              className="text-xs px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors disabled:opacity-50"
                            >
                              ✕ Cancel
                            </button>
                          )}
                          <button
                            disabled={actionId === b._id}
                            onClick={() => handleDelete(b._id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-500/30 text-red-400 font-medium transition-colors disabled:opacity-50"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
