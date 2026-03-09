import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaChevronDown, FaSignOutAlt, FaUser, FaTachometerAlt, FaHeart } from "react-icons/fa";

import ConsultationModal from "../../consultation/components/ConsultationModal";
import CompareModal from "../../consultation/components/CompareModal";

export default function Navbar() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const dropdownRef = useRef(null);

  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [openCompare,  setOpenCompare]  = useState(false);
  const [search,       setSearch]       = useState("");
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ── Read logged-in user from localStorage ───────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  // Re-read user when location changes (e.g. after login redirect)
  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("user")) || null); }
    catch { setUser(null); }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/properties?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  // Dashboard link based on role
  const getDashboardLink = (role) => {
    if (role === "seller" || role === "dealer") return "/dealer";
    if (role === "agent")  return "/agent-profile";
    if (role === "admin")  return "/rkis";
    return "/profile";
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
      : "text-gray-700 hover:text-blue-600 transition-colors duration-200";

  // Avatar: Google photo or initials
  const Avatar = ({ size = 34 }) => {
    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          referrerPolicy="no-referrer"
          style={{
            width: size, height: size, borderRadius: "50%",
            objectFit: "cover", border: "2px solid #2563eb",
          }}
        />
      );
    }
    const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
        color: "#fff", fontWeight: 700, fontSize: size * 0.38,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, border: "2px solid #2563eb",
      }}>
        {initials}
      </div>
    );
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm border-b"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <span className="blink bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md rotate-[-15deg]">
              FREE
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-xl shadow transition-colors duration-200"
            >
              🏠 Book Home Consultation
            </button>
          </div>

          {/* CENTER MENU */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/"           className={linkClass("/")}>Home</Link>
            <Link to="/properties" className={linkClass("/properties")}>All Properties</Link>
           
            <button
              onClick={() => setOpenCompare(true)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Property Comparison
            </button>

            <Link to="/services" className={linkClass("/services")}>Services</Link>
           
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center border rounded-lg overflow-hidden ml-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1 outline-none text-sm w-32"
              />
              <button type="submit" className="bg-blue-600 text-white px-2 py-2">
                <FaSearch size={14} />
              </button>
            </form>
          </div>

          {/* RIGHT SIDE — conditionally render Login or User Avatar */}
          {user ? (
            /* ── Logged-in: Avatar + Dropdown ── */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "6px 12px 6px 6px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "50px",
                  background: dropdownOpen ? "#f0f4ff" : "#fff",
                  cursor: "pointer",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                <Avatar />
                <span style={{
                  fontSize: "0.88rem", fontWeight: 600,
                  color: "#1e293b", maxWidth: "120px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user.name?.split(" ")[0]}
                </span>
                <FaChevronDown
                  size={11}
                  style={{
                    color: "#64748b",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  minWidth: "220px",
                  background: "#fff", borderRadius: "14px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
                  border: "1px solid #f1f5f9",
                  overflow: "hidden", zIndex: 200,
                  animation: "fadeSlideDown 0.18s ease",
                }}>
                  {/* User Info header */}
                  <div style={{
                    padding: "14px 16px",
                    background: "linear-gradient(135deg, #f0f4ff, #fff)",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <Avatar size={40} />
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{user.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{user.email}</div>
                      <div style={{
                        display: "inline-block", marginTop: "3px",
                        padding: "1px 8px",
                        background: "#dbeafe", borderRadius: "20px",
                        fontSize: "0.68rem", fontWeight: 700,
                        color: "#1d4ed8", textTransform: "capitalize",
                      }}>
                        {user.role}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    <DropdownItem
                      icon={<FaUser size={13} />}
                      label="My Profile"
                      onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                    />
                    <DropdownItem
                      icon={<FaHeart size={13} />}
                      label="My Wishlist"
                      onClick={() => { navigate("/wishlist"); setDropdownOpen(false); }}
                    />
                    <DropdownItem
                      icon={<FaTachometerAlt size={13} />}
                      label="Dashboard"
                      onClick={() => { navigate(getDashboardLink(user.role)); setDropdownOpen(false); }}
                    />
                  </div>

                  {/* Logout */}
                  <div style={{ padding: "6px", borderTop: "1px solid #f1f5f9" }}>
                    <DropdownItem
                      icon={<FaSignOutAlt size={13} />}
                      label="Sign Out"
                      danger
                      onClick={handleLogout}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Not logged in: Login button ── */
            <Link
              to="/login"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CompareModal      isOpen={openCompare} onClose={() => setOpenCompare(false)} />
    </>
  );
}

/* Small helper for dropdown items */
function DropdownItem({ icon, label, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        width: "100%", padding: "9px 12px",
        border: "none", borderRadius: "9px",
        background: hover ? (danger ? "#fff5f5" : "#f0f4ff") : "transparent",
        color: danger ? (hover ? "#dc2626" : "#ef4444") : (hover ? "#2563eb" : "#374151"),
        fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
        fontFamily: "inherit", textAlign: "left",
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ opacity: 0.8 }}>{icon}</span>
      {label}
    </button>
  );
}
