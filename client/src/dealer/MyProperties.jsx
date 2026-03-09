import { useState } from "react";
import { Link } from "react-router-dom";

export function MyProperties() {
  const [filter, setFilter] = useState("all");
  const [properties] = useState([
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "South Delhi",
      price: "₹2.5 Cr",
      status: "active",
      views: 145,
      inquiries: 12,
      listedDate: "Jan 15, 2024",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    },
    {
      id: 2,
      title: "Penthouse Apartment",
      location: "Gurgaon",
      price: "₹1.8 Cr",
      status: "active",
      views: 98,
      inquiries: 8,
      listedDate: "Jan 10, 2024",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    },
    {
      id: 3,
      title: "Riverside Bungalow",
      location: "Noida",
      price: "₹3.2 Cr",
      status: "sold",
      views: 234,
      inquiries: 25,
      listedDate: "Dec 20, 2023",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
    },
    {
      id: 4,
      title: "Urban Studio",
      location: "Connaught Place",
      price: "₹75 L",
      status: "pending",
      views: 45,
      inquiries: 3,
      listedDate: "Jan 18, 2024",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
    },
  ]);

  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter((p) => p.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      sold: "bg-blue-100 text-blue-700",
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gradient">My Properties</h1>
            <p className="text-slate-600">Manage and track all your property listings</p>
          </div>
          <Link to="/dealer/add" className="btn-primary mt-4 md:mt-0">
            ➕ Add New Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-2xl font-bold text-gradient">{properties.length}</div>
            <div className="text-slate-600 text-sm">Total Properties</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-gradient">
              {properties.filter((p) => p.status === "active").length}
            </div>
            <div className="text-slate-600 text-sm">Active Listings</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-gradient">
              {properties.reduce((sum, p) => sum + p.views, 0)}
            </div>
            <div className="text-slate-600 text-sm">Total Views</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-gradient">
              {properties.reduce((sum, p) => sum + p.inquiries, 0)}
            </div>
            <div className="text-slate-600 text-sm">Total Inquiries</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { value: "all", label: "All Properties", icon: "🏘️" },
            { value: "active", label: "Active", icon: "✅" },
            { value: "pending", label: "Pending", icon: "⏳" },
            { value: "sold", label: "Sold", icon: "💰" },
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

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div key={property.id} className="card p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full md:w-48 h-48 object-cover rounded-xl"
                />

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                      <div className="flex items-center text-slate-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(property.status)}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-gradient mb-4">{property.price}</div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-600">Views</div>
                      <div className="text-lg font-bold">👁️ {property.views}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-600">Inquiries</div>
                      <div className="text-lg font-bold">💬 {property.inquiries}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-600">Listed</div>
                      <div className="text-lg font-bold">📅 {property.listedDate}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to={`/property/${property.id}`} className="btn-primary text-sm px-4 py-2">
                      👁️ View
                    </Link>
                    <button className="btn-secondary text-sm px-4 py-2">
                      ✏️ Edit
                    </button>
                    <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 text-sm">
                      📊 Analytics
                    </button>
                    {property.status === "active" && (
                      <button className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-all duration-300 text-sm">
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="card p-20 text-center">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your filters or add a new property</p>
            <Link to="/dealer/add" className="btn-primary inline-block">
              ➕ Add New Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}