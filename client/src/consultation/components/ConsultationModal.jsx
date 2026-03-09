import { useState } from "react";
import axios from "axios";

export default function ConsultationModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      alert("Name aur Phone number zaroori hai!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/consultation/book", {
        name: form.name,
        phone: form.phone,
        city: "",
        message: form.message,
      });

      setSubmitted(true);
      setForm({ name: "", phone: "", message: "" });

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      alert("Kuch galat hua, dobara try karein ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          invest mango one
        </h2>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-600 font-semibold text-lg">Consultation booked successfully!</p>
            <p className="text-gray-500 text-sm mt-1">Hum jald hi aapse contact karenge.</p>
          </div>
        ) : (
          /* Form */
          <form className="space-y-4" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Enter your message here (Optional)"
              rows="3"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}

        {/* Bottom Info */}
        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <span>10+ years of experience</span>
          <span>Data Security</span>
        </div>
      </div>
    </div>
  );
}