import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">🏠 RealEstate</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            India's most trusted platform for buying, selling, and renting premium properties.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/properties" className="hover:text-white transition-colors">All Properties</Link></li>
            <li><Link to="/dealer" className="hover:text-white transition-colors">Dealer Dashboard</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
          </ul>
        </div>

        {/* Property Types */}
        <div>
          <h3 className="text-white font-semibold mb-4">Property Types</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">🏡 Villas</li>
            <li className="hover:text-white transition-colors cursor-pointer">🏢 Apartments</li>
            <li className="hover:text-white transition-colors cursor-pointer">🏠 Bungalows</li>
            <li className="hover:text-white transition-colors cursor-pointer">🏗️ Under Construction</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 support@realestate.in</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 New Delhi, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RealEstate India. All rights reserved.
      </div>
    </footer>
  );
}
