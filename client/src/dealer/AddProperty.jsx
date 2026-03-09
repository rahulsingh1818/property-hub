import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "apartment",
    beds: "",
    baths: "",
    area: "",
    features: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Property added successfully!");
    navigate("/dealer/my");
  };

  const featureOptions = [
    "Swimming Pool",
    "Gym",
    "Parking",
    "Garden",
    "Security",
    "Power Backup",
    "Elevator",
    "Club House",
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Add New Property</h1>
          <p className="text-red-800">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Modern Luxury Villa"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your property..."
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Property Type *</label>
                  <select
                    className="input-field"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ₹2.5 Cr"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., South Delhi, New Delhi"
                  className="input-field"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Property Details
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Bedrooms *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 3"
                  className="input-field"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Bathrooms *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 2"
                  className="input-field"
                  value={formData.baths}
                  onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Area (sq.ft) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2500"
                  className="input-field"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Features & Amenities
            </h2>

            <div className="grid md:grid-cols-2 gap-3">
              {featureOptions.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded"
                    checked={formData.features.includes(feature)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, features: [...formData.features, feature] });
                      } else {
                        setFormData({
                          ...formData,
                          features: formData.features.filter((f) => f !== feature),
                        });
                      }
                    }}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
              Property Images
            </h2>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">📷</div>
              <p className="text-slate-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
              <input type="file" multiple accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              ✓ Publish Property
            </button>
            <button
              type="button"
              onClick={() => navigate("/dealer")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}