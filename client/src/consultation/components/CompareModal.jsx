import { useState } from "react";

export default function CompareModal({ isOpen, onClose }) {
  const [city, setCity] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-8 relative shadow-lg">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Property Comparison
        </h2>

        {/* City Select */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-6"
        >
          <option value="">Select City</option>
          <option>Noida</option>
          <option>Delhi</option>
          <option>Pune</option>
        </select>

        {/* 3 Project Select */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[p1, p2, p3].map((val, i) => (
            <select
              key={i}
              value={val}
              onChange={(e) =>
                i === 0
                  ? setP1(e.target.value)
                  : i === 1
                  ? setP2(e.target.value)
                  : setP3(e.target.value)
              }
              className="border rounded-xl px-4 py-3"
            >
              <option value="">Select Project</option>
              <option>Project A</option>
              <option>Project B</option>
              <option>Project C</option>
            </select>
          ))}
        </div>

        {/* Compare Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
          Compare Now
        </button>
      </div>
    </div>
  );
}