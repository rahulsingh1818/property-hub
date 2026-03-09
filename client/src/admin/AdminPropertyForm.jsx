import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://localhost:5000/api/admin";
const UPLOAD_API = "http://localhost:5000/api/upload/image";

const initialForm = {
  title: "",
  location: "",
  price: "",
  type: "sale",
  category: "Apartment",
  bedrooms: "",
  bathrooms: "",
  area: "",
  description: "",
  image: "",
  status: "pending",
  dealer: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  featured: false,
};

export function AdminPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);

  const [form,         setForm]         = useState(initialForm);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");
  const [dragOver,     setDragOver]     = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetch(`${API}/properties`)
        .then((r) => r.json())
        .then((data) => {
          const prop = Array.isArray(data) ? data.find((p) => p._id === id) : null;
          if (prop) {
            setForm({
              title:       prop.title       || "",
              location:    prop.location    || "",
              price:       prop.price       || "",
              type:        prop.type        || "sale",
              category:    prop.category    || "Apartment",
              bedrooms:    prop.bedrooms    || "",
              bathrooms:   prop.bathrooms   || "",
              area:        prop.area        || "",
              description: prop.description || "",
              image:       prop.image       || "",
              status:      prop.status      || "pending",
              dealer:      prop.dealer      || "",
              agentName:   prop.agentName   || "",
              agentPhone:  prop.agentPhone  || "",
              agentEmail:  prop.agentEmail  || "",
              featured:    prop.featured    || false,
            });
          }
        })
        .catch(() => setError("Failed to load property"))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Upload image to Cloudinary via our backend (XHR for real progress) ────
  const uploadImage = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, WebP, or AVIF images are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(2);          // show immediately so user sees it start
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();

    // Real upload progress from browser
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 95); // reserve last 5% for server processing
        setUploadProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      setUploadProgress(100);

      // Safely parse response — never blow up on HTML error pages
      let data;
      try { data = JSON.parse(xhr.responseText); }
      catch {
        setError("Upload failed: server returned an unexpected response. Check backend logs.");
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        setForm((prev) => ({ ...prev, image: data.url }));
        setTimeout(() => setUploadProgress(0), 700);
      } else {
        setError("Upload failed: " + (data.message || `HTTP ${xhr.status}`));
        setUploadProgress(0);
      }
      setUploading(false);
    });

    xhr.addEventListener("error", () => {
      setError("Upload failed: cannot reach the server. Is the backend running?");
      setUploading(false);
      setUploadProgress(0);
    });

    xhr.addEventListener("abort", () => {
      setUploading(false);
      setUploadProgress(0);
    });

    xhr.open("POST", UPLOAD_API);
    xhr.send(formData);
  };


  const handleFileChange = (e) => uploadImage(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadImage(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save property ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        price:     Number(form.price),
        bedrooms:  Number(form.bedrooms)  || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area:      Number(form.area)      || 0,
      };

      const url    = isEditing ? `${API}/properties/${id}` : `${API}/properties`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccess(isEditing ? "Property updated successfully!" : "Property added successfully!");
      setTimeout(() => navigate("/rkis/properties"), 1500);
    } catch (err) {
      setError("Failed to save property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-blue-900/60 border border-blue-600/50 rounded-xl px-4 py-2.5 text-white placeholder-blue-300/60 text-sm focus:outline-none focus:border-blue-400 transition-colors";
  const labelClass = "block text-blue-200 text-sm font-medium mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {isEditing ? "✏️ Edit Property" : "➕ Add New Property"}
        </h1>
        <p className="text-gray-700">
          {isEditing ? "Update property details below" : "Fill in the details to list a new property"}
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-5 py-3 rounded-xl text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-5 py-3 rounded-xl text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ── */}
        <div className="bg-blue-800 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-lg mb-4">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Modern Luxury Villa" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. South Delhi, Delhi" className={inputClass} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="e.g. 5000000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {["Apartment", "Villa", "Bungalow", "Studio", "Plot", "Office", "Other"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange} placeholder="e.g. 3" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={handleChange} placeholder="e.g. 2" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Area (sq.ft)</label>
              <input name="area" type="number" min="0" value={form.area} onChange={handleChange} placeholder="e.g. 1500" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Write a detailed property description..." className={`${inputClass} resize-none`} />
          </div>

          {/* ── Cloudinary Image Upload ── */}
          <div>
            <label className={labelClass}>
              Property Image
              <span className="ml-2 text-xs text-gray-500">(JPG, PNG, WebP · max 10 MB · stored on Cloudinary)</span>
            </label>

            {/* ── Progress bar (always on top, shown while uploading) ── */}
            {uploading && (
              <div style={{
                background: "#111827", border: "1px solid #1e3a5f",
                borderRadius: "12px", padding: "20px 24px",
                marginBottom: "12px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                  <span style={{ fontSize: "1.4rem" }}>☁️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ color: "#93c5fd", fontSize: "0.85rem", fontWeight: 600 }}>Uploading to Cloudinary…</span>
                      <span style={{ color: "#6b7280", fontSize: "0.82rem", fontWeight: 700 }}>{uploadProgress}%</span>
                    </div>
                    {/* Animated progress bar */}
                    <div style={{ width: "100%", height: "8px", background: "#1f2937", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${uploadProgress}%`,
                        background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)",
                        borderRadius: "9999px",
                        transition: "width 0.25s ease",
                        boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Drop Zone — hidden while uploading or after image set */}
            {!form.image && (
              <div
                onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "#3b82f6" : "#374151"}`,
                  borderRadius: "12px",
                  padding: "32px 20px",
                  textAlign: "center",
                  cursor: uploading ? "not-allowed" : "pointer",
                  background: dragOver ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                  opacity: uploading ? 0.4 : 1,
                  transition: "all 0.2s ease",
                  display: uploading ? "none" : "block",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🖼️</div>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                  <span style={{ color: "#3b82f6", fontWeight: 600 }}>Click to upload</span> or drag &amp; drop here
                </p>
                <p style={{ color: "#6b7280", fontSize: "0.78rem", marginTop: "4px" }}>Image will be stored in Cloudinary automatically</p>
              </div>
            )}

            {/* Hidden file input */}
            <input

              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* Preview after upload */}
            {form.image && (
              <div style={{ position: "relative", display: "inline-block", marginTop: "12px" }}>
                <img
                  src={form.image}
                  alt="Property preview"
                  style={{
                    width: "280px", height: "180px", objectFit: "cover",
                    borderRadius: "12px", border: "2px solid #374151",
                    display: "block",
                  }}
                  onError={(e) => e.target.style.display = "none"}
                />
                {/* Cloudinary badge */}
                <div style={{
                  position: "absolute", bottom: "8px", left: "8px",
                  background: "rgba(0,0,0,0.7)", padding: "3px 8px",
                  borderRadius: "6px", fontSize: "0.68rem", color: "#60a5fa",
                  fontWeight: 600, display: "flex", alignItems: "center", gap: "4px",
                }}>
                  ☁️ Cloudinary
                </div>
                {/* Remove + Change buttons */}
                <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "6px 14px", borderRadius: "8px",
                      background: "#1d4ed8", border: "none", color: "#fff",
                      fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    🔄 Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding: "6px 14px", borderRadius: "8px",
                      background: "#7f1d1d", border: "none", color: "#fca5a5",
                      fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Listing Settings ── */}
        <div className="bg-blue-800 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-lg mb-4">Listing Settings</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Dealer Name</label>
              <input name="dealer" value={form.dealer} onChange={handleChange} placeholder="e.g. John Doe Agency" className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-blue-500" />
            <label htmlFor="featured" className="text-white text-sm cursor-pointer">Mark as Featured Property</label>
          </div>
        </div>

        {/* ── Agent Info ── */}
        <div className="bg-blue-800 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-lg mb-4">Agent Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Agent Name</label>
              <input name="agentName" value={form.agentName} onChange={handleChange} placeholder="e.g. Rahul Sharma" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Agent Phone</label>
              <input name="agentPhone" value={form.agentPhone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Agent Email</label>
              <input name="agentEmail" type="email" value={form.agentEmail} onChange={handleChange} placeholder="agent@example.com" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>{isEditing ? "💾 Update Property" : "🚀 Add Property"}</>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/rkis/properties")}
            className="bg-blue-900/60 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors border border-blue-600/50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
