import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./shared/components/Navbar";
import Footer from "./shared/components/Footer";
import { Home } from "./user/Home";
import { Services } from "./user/Services";
import { Profile } from "./user/Profile";
import { Properties } from "./features/properties/pages/Properties";
import { PropertyDetails } from "./features/properties/pages/PropertyDetails";
import { DealerDashboard } from "./dealer/DealerDashboard";
import { AddProperty } from "./dealer/AddProperty";
import { MyProperties } from "./dealer/MyProperties";
import { AdminDashboard } from "./admin/AdminDashboard";
import { ManageUsers } from "./admin/ManageUsers";
import { ManageProperties } from "./admin/ManageProperties";
import { AdminPropertyForm } from "./admin/AdminPropertyForm";
import AdminLayout from "./admin/AdminLayout";
import { ManageReviews } from "./admin/ManageReviews";
import { ManageVisits } from "./admin/ManageVisits";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Login"; // same component, toggled via state
import { Reviews } from "./user/Reviews";
import { Wishlist } from "./user/Wishlist";
import { ManageWishlists } from "./admin/ManageWishlists";

// Agent Profile placeholder page
function AgentProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-3xl font-bold text-slate-900">Agent Profile</h1>
        <p className="text-slate-600 mt-2">Agent profile page coming soon</p>
      </div>
    </div>
  );
}

// Public layout wrapper — keeps Navbar + Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ─── ADMIN PANEL at /rkis — NO Navbar/Footer ─── */}
        <Route path="/rkis" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="add-property" element={<AdminPropertyForm />} />
          <Route path="edit-property/:id" element={<AdminPropertyForm />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="visits" element={<ManageVisits />} />
          <Route path="wishlists" element={<ManageWishlists />} />
        </Route>

        {/* OLD /admin → also use AdminLayout (no Navbar) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="properties" element={<ManageProperties />} />
        </Route>

        {/* ─── PUBLIC SITE — with Navbar & Footer ─── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/properties" element={<PublicLayout><Properties /></PublicLayout>} />
        <Route path="/property/:id" element={<PublicLayout><PropertyDetails /></PublicLayout>} />
        <Route path="/property-detail" element={<PublicLayout><PropertyDetails /></PublicLayout>} />
        <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
        <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
        <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
        <Route path="/agent-profile" element={<PublicLayout><AgentProfile /></PublicLayout>} />
        {/* Auth — full screen, no Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* DEALER */}
        <Route path="/dealer" element={<PublicLayout><DealerDashboard /></PublicLayout>} />
        <Route path="/dealer/add" element={<PublicLayout><AddProperty /></PublicLayout>} />
        <Route path="/dealer/my" element={<PublicLayout><MyProperties /></PublicLayout>} />
      </Routes>
    </Router>
  );
}