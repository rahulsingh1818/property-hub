import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/admin";

export function ManageProperties() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/properties`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property permanently?")) return;
    try {
      await fetch(`${API}/properties/${id}`, { method: "DELETE" });
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API}/properties/${id}/approve`, { method: "PATCH" });
      const updated = await res.json();
      setProperties((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API}/properties/${id}/reject`, { method: "PATCH" });
      const updated = await res.json();
      setProperties((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  const filtered = properties.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch =
      search === "" ||
      (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStatusStyle = (status) => {
    const map = {
      approved: "bg-emerald-500/20 text-emerald-400",
      pending: "bg-orange-500/20 text-orange-400",
      rejected: "bg-red-500/20 text-red-400",
    };
    return map[status] || map.pending;
  };

  const statsData = [
    { label: "Total", value: properties.length, color: "text-white" },
    {
      label: "Approved",
      value: properties.filter((p) => p.status === "approved").length,
      color: "text-emerald-400",
    },
    {
      label: "Pending",
      value: properties.filter((p) => p.status === "pending").length,
      color: "text-orange-400",
    },
    {
      label: "Rejected",
      value: properties.filter((p) => p.status === "rejected").length,
      color: "text-red-400",
    },
  ];

  const formatPrice = (price) => {
    if (!price) return "—";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Properties</h1>
          <p className="text-gray-700">Review and manage all property listings</p>
        </div>
        <Link
          to="/rkis/add-property"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <span>➕</span> Add Property
        </Link>
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

      {/* Filters */}
      <div className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍  Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "All 🏘️" },
              { value: "approved", label: "Approved ✅" },
              { value: "pending", label: "Pending ⏳" },
              { value: "rejected", label: "Rejected ❌" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f.value
                    ? "bg-white text-gray-800"
                    : "bg-white text-gray-800 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-red-800 border border-gray-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-3">🏘️</div>
          <div className="text-white text-xl font-semibold mb-2">No properties found</div>
          <div className="text-gray-400">Try adjusting your filters</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((property) => (
            <div
              key={property._id}
              className="bg-blue-800 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-5">
                {/* Image */}
                <div className="w-full md:w-44 h-40 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src =
                          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80")
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                      🏠
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {property.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusStyle(
                        property.status
                      )}`}
                    >
                      {property.status?.charAt(0).toUpperCase() +
                        property.status?.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-200 text-sm mb-2">
                    📍 {property.location}
                  </div>

                  <div className="text-blue-400 font-bold text-xl mb-3">
                    {formatPrice(property.price)}
                    {property.type === "rent" && (
                      <span className="text-gray-400 text-sm font-normal">/mo</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    {property.category && (
                      <span className="bg-white text-gray-900 px-2 py-1 rounded-lg">
                        🏗️ {property.category}
                      </span>
                    )}
                    {property.bedrooms > 0 && (
                      <span className="bg-white text-gray-900 px-2 py-1 rounded-lg">
                        🛏️ {property.bedrooms} Beds
                      </span>
                    )}
                    {property.area > 0 && (
                      <span className="bg-white text-gray-900 px-2 py-1 rounded-lg">
                        📐 {property.area} sq.ft
                      </span>
                    )}
                    {property.dealer && (
                      <span className="bg-white text-gray-900 px-2 py-1 rounded-lg">
                        👤 {property.dealer}
                      </span>
                    )}
                    <span className="bg-white text-gray-900 px-2 py-1 rounded-lg">
                      👁️ {property.views || 0} views
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/property/${property._id}`}
                      className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      👁️ View
                    </Link>
                    <Link
                      to={`/rkis/edit-property/${property._id}`}
                      className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      ✏️ Edit
                    </Link>
                    {property.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(property._id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {property.status === "approved" && (
                      <button
                        onClick={() => handleReject(property._id)}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        🔒 Suspend
                      </button>
                    )}
                    {property.status === "rejected" && (
                      <button
                        onClick={() => handleApprove(property._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        ✅ Re-Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="bg-red-900/40 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}