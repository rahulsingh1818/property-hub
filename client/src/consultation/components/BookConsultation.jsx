import { useState } from "react";
import axios from "axios";

export default function BookConsultation() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/consultation/book", form);
      alert("Consultation booked successfully ✅");

      setForm({ name: "", phone: "", city: "", message: "" });
    } catch (err) {
      alert("Error booking consultation ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 w-full" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 w-full" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className="border p-2 w-full" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}