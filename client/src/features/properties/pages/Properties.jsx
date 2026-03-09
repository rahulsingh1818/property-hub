import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get logged-in user from localStorage
function getUser() {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
}

// ── Heart / Wishlist Toggle Button ─────────────────────────────────────────────
function WishlistHeart({ property }) {
  const user = getUser();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check on mount if already in wishlist
  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`${API}/api/wishlist/check?userId=${user.id}&propertyId=${property.id}`)
      .then(({ data }) => setWishlisted(data.wishlisted))
      .catch(() => {});
  }, [user?.id, property.id]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("Please login to save properties to your wishlist.");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/api/wishlist/toggle`, {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        propertyId: String(property.id),
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        propertyImage: property.image,
        propertyType: property.type,
      });
      setWishlisted(data.wishlisted);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: wishlisted ? "rgba(239,68,68,0.92)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(4px)",
        border: "none",
        borderRadius: "50%",
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: loading ? "default" : "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        transition: "all 0.22s ease",
        transform: wishlisted ? "scale(1.1)" : "scale(1)",
        zIndex: 10,
      }}
    >
      <svg
        viewBox="0 0 20 20"
        style={{
          width: 18,
          height: 18,
          fill: wishlisted ? "#fff" : "#ef4444",
          transition: "all 0.22s ease",
        }}
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

// ── Main Properties Page ────────────────────────────────────────────────────────
export function Properties() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") || "";
  const typeParam     = searchParams.get("type")   || "";
  const budgetParam   = searchParams.get("budget") || "";

  // Sync filter tab with ?type= param — default "all" if no type
  const [filter, setFilter] = useState(typeParam || "all");

  const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "South Delhi",
      price: "₹2.5 Cr",
      beds: 4,
      baths: 3,
      area: "3500 sq.ft",
      type: "villa",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    },
    {
      id: 2,
      title: "Penthouse Apartment",
      location: "Gurgaon",
      price: "₹1.8 Cr",
      beds: 3,
      baths: 2,
      area: "2800 sq.ft",
      type: "apartment",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    },
    {
      id: 3,
      title: "Riverside Bungalow",
      location: "Noida",
      price: "₹3.2 Cr",
      beds: 5,
      baths: 4,
      area: "4200 sq.ft",
      type: "bungalow",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    },
    {
      id: 4,
      title: "Urban Studio",
      location: "Connaught Place",
      price: "₹75 L",
      beds: 1,
      baths: 1,
      area: "650 sq.ft",
      type: "apartment",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    },
    {
      id: 5,
      title: "Garden Villa",
      location: "Vasant Kunj",
      price: "₹4.5 Cr",
      beds: 6,
      baths: 5,
      area: "5000 sq.ft",
      type: "villa",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    },
    {
      id: 6,
      title: "Skyline Apartment",
      location: "Dwarka",
      price: "₹1.2 Cr",
      beds: 3,
      baths: 2,
      area: "1800 sq.ft",
      type: "apartment",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    },
  ];

  // ── Budget helper: parse price string → numeric Cr value ────────────────────
  const parsePriceCr = (price) => {
    if (!price) return null;
    const p = price.replace(/[₹,\s]/g, "").toLowerCase();
    if (p.includes("cr"))  return parseFloat(p) * 1;
    if (p.includes("l"))   return parseFloat(p) / 100;
    return parseFloat(p);
  };

  const budgetRanges = {
    under50L:  { min: 0,    max: 0.5  },
    "50Lto1Cr":{ min: 0.5,  max: 1    },
    "1Crto2Cr":{ min: 1,    max: 2    },
    "2Crto5Cr":{ min: 2,    max: 5    },
    above5Cr:  { min: 5,    max: Infinity },
  };

  // ── Apply all filters ────────────────────────────────────────────────────────
  const filteredProperties = properties.filter((p) => {
    // 1. Tab filter OR URL type param
    const activeType = filter !== "all" ? filter : typeParam;
    const matchesFilter = !activeType || p.type === activeType;

    // 2. Keyword search (location OR title OR type)
    const keyword = searchKeyword.toLowerCase();
    const matchesSearch =
      !keyword ||
      (p.title || "").toLowerCase().includes(keyword) ||
      (p.location || "").toLowerCase().includes(keyword) ||
      (p.type || "").toLowerCase().includes(keyword);

    // 3. Budget filter
    let matchesBudget = true;
    if (budgetParam && budgetRanges[budgetParam]) {
      const price = parsePriceCr(p.price);
      const { min, max } = budgetRanges[budgetParam];
      matchesBudget = price !== null && price >= min && price <= max;
    }

    return matchesFilter && matchesSearch && matchesBudget;
  });

  const hasActiveFilters = searchKeyword || typeParam || budgetParam;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            All Properties
          </h1>
          <p className="text-slate-600 text-lg">
            Explore our extensive collection of premium properties
          </p>
        </div>

        {/* Filters + Active Search Info */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-3">
            {[
              { value: "all", label: "All Properties", icon: "🏘️" },
              { value: "villa", label: "Villas", icon: "🏡" },
              { value: "apartment", label: "Apartments", icon: "🏢" },
              { value: "bungalow", label: "Bungalows", icon: "🏠" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  filter === item.value
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Active filters:</span>
              {searchKeyword && (
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "3px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600 }}>
                  📍 {searchKeyword}
                </span>
              )}
              {typeParam && (
                <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "3px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600 }}>
                  🏠 {typeParam.charAt(0).toUpperCase() + typeParam.slice(1)}
                </span>
              )}
              {budgetParam && (
                <span style={{ background: "#fef3c7", color: "#b45309", padding: "3px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600 }}>
                  💰 {budgetParam.replace("under50L", "Under ₹50L").replace("50Lto1Cr", "₹50L–₹1Cr").replace("1Crto2Cr", "₹1Cr–₹2Cr").replace("2Crto5Cr", "₹2Cr–₹5Cr").replace("above5Cr", "Above ₹5Cr")}
                </span>
              )}
              <button
                onClick={() => navigate("/properties")}
                style={{ fontSize: "0.78rem", color: "#ef4444", fontWeight: 600, background: "none", border: "1px solid #fca5a5", borderRadius: 20, padding: "3px 12px", cursor: "pointer" }}
              >
                ✕ Clear all
              </button>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="card group cursor-pointer transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* ── Animated Wishlist Heart ── */}
                <WishlistHeart property={property} />

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                  {property.type
                    ? property.type.charAt(0).toUpperCase() + property.type.slice(1)
                    : "Property"}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {property.title}
                </h3>

                <div className="flex items-center text-slate-600 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-3">
                    <span>🛏️ {property.beds}</span>
                    <span>🚿 {property.baths}</span>
                  </div>
                  <span>📏 {property.area}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="text-2xl font-bold text-gradient">
                    {property.price}
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No properties found
            </h3>
            <p className="text-slate-600">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}