import { useState } from "react";
import axios from "axios";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/contact", form);

      alert("Message sent successfully ddfdfdfdfdfd✅");

      setForm({ name: "", phone: "", message: "" });
    } catch (error) {
      alert("Error sending message ❌");
      console.log(error);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-3xl font-bold mb-2">Still Confused?</h2>
      <p className="text-gray-500 mb-6">We are Here to Assist!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Enter 10-digit phone number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <textarea
          name="message"
          placeholder="How can we help you?"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg h-32"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </section>
  );
}