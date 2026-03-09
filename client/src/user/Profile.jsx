import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();

  // Read real user from localStorage (set at login)
  const [user] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      return stored || {
        name: "Guest User",
        email: "—",
        phone: "—",
        role: "buyer",
        avatar: "",
      };
    } catch {
      return { name: "Guest User", email: "—", phone: "—", role: "buyer", avatar: "" };
    }
  });

  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Avatar: Google photo or initials circle
  const AvatarDisplay = () => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          referrerPolicy="no-referrer"
          style={{
            width: 96, height: 96, borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #2563eb",
            boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
          }}
        />
      );
    }
    const initials = user.name
      ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "U";
    return (
      <div style={{
        width: 96, height: 96, borderRadius: "50%",
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "2.2rem", fontWeight: 800,
        border: "4px solid #2563eb",
        boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
      }}>
        {initials}
      </div>
    );
  };

  const savedProperties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "South Delhi",
      price: "₹2.5 Cr",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    },
    {
      id: 2,
      title: "Penthouse Apartment",
      location: "Gurgaon",
      price: "₹1.8 Cr",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#f8fafd" }}>
      <div className="max-w-6xl mx-auto">

        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">

            <AvatarDisplay />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-1" style={{ color: "#0f2540" }}>{user.name}</h1>

              {/* Role badge */}
              <span style={{
                display: "inline-block", marginBottom: "10px",
                padding: "3px 12px",
                background: "#dbeafe", borderRadius: "20px",
                fontSize: "0.75rem", fontWeight: 700,
                color: "#1d4ed8", textTransform: "capitalize",
              }}>
                {user.role}
              </span>

              <div className="space-y-1 text-slate-600">
                {user.email && user.email !== "—" && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {user.email}
                  </div>
                )}
                {user.phone && user.phone !== "—" && user.phone !== "" && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {user.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="btn-primary"
                style={{ padding: "10px 20px", borderRadius: "10px", fontSize: "0.9rem" }}
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px", borderRadius: "10px", fontSize: "0.9rem",
                  border: "1.5px solid #fca5a5", background: "transparent",
                  color: "#dc2626", fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-3xl font-bold text-gradient">12</div>
              <div className="text-slate-600">Saved Properties</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-3xl font-bold text-gradient">45</div>
              <div className="text-slate-600">Viewed Properties</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-3xl font-bold text-gradient">3</div>
              <div className="text-slate-600">Active Inquiries</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: "overview",   label: "Overview",          icon: "📊" },
            { id: "saved",      label: "Saved Properties",  icon: "❤️" },
            { id: "inquiries",  label: "Inquiries",         icon: "💬" },
            { id: "settings",   label: "Settings",          icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Account Role</span>
                <span className="font-semibold capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Account Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Email Verified</span>
                <span className="text-green-600">✓ Verified</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Sign-in Method</span>
                <span className="font-semibold">
                  {user.authProvider === "google" ? "🔵 Google" : "🔑 Email & Password"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Saved Properties</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {savedProperties.map((property) => (
                <div key={property.id} className="card group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{property.title}</h3>
                    <div className="flex items-center text-slate-600 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="text-xl font-bold text-gradient">{property.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Your Inquiries</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Modern Luxury Villa</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Pending</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">Inquiry sent on Jan 15, 2024</p>
                  <p className="text-sm text-slate-700">Interested in scheduling a visit...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" defaultValue={user.name} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input type="email" defaultValue={user.email} className="input-field" readOnly={!!user.authProvider} />
                {user.authProvider === "google" && (
                  <p className="text-xs text-slate-400 mt-1">Google accounts cannot change their email here.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone</label>
                <input type="tel" defaultValue={user.phone || ""} className="input-field" />
              </div>
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}