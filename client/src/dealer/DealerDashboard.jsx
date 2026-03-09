import { Link } from "react-router-dom";
import { useState } from "react";

export function DealerDashboard() {
  const [stats] = useState({
    totalProperties: 24,
    activeListings: 18,
    soldProperties: 6,
    totalViews: 1250,
  });

  const recentProperties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      status: "Active",
      views: 145,
      inquiries: 12,
      price: "₹2.5 Cr",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    },
    {
      id: 2,
      title: "Penthouse Apartment",
      status: "Active",
      views: 98,
      inquiries: 8,
      price: "₹1.8 Cr",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gradient">Dealer Dashboard</h1>
            <p className="text-slate-600">Manage your property listings and track performance</p>
          </div>
          <Link to="/dealer/add" className="btn-primary mt-4 md:mt-0">
            ➕ Add New Property
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Properties", value: stats.totalProperties, icon: "🏘️", color: "from-blue-600 to-blue-700" },
            { label: "Active Listings", value: stats.activeListings, icon: "✅", color: "from-green-600 to-green-700" },
            { label: "Sold Properties", value: stats.soldProperties, icon: "💰", color: "from-purple-600 to-purple-700" },
            { label: "Total Views", value: stats.totalViews, icon: "👁️", color: "from-orange-600 to-orange-700" },
          ].map((stat, index) => (
            <div key={index} className="card p-6 hover:scale-105 transition-transform duration-300">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/dealer/add" className="card p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">➕</div>
            <h3 className="text-xl font-bold mb-2">Add Property</h3>
            <p className="text-slate-600">List a new property for sale or rent</p>
          </Link>
          <Link to="/dealer/my" className="card p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="text-xl font-bold mb-2">My Properties</h3>
            <p className="text-slate-600">View and manage all your listings</p>
          </Link>
          <div className="card p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-slate-600">Track performance and insights</p>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <Link to="/dealer/my" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{property.title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {property.status}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gradient mb-3">{property.price}</div>
                  <div className="flex gap-6 text-sm text-slate-600">
                    <span>👁️ {property.views} views</span>
                    <span>💬 {property.inquiries} inquiries</span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <button className="btn-primary text-sm px-4 py-2">Edit</button>
                  <button className="btn-secondary text-sm px-4 py-2">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}