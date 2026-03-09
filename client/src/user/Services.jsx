import { Link } from "react-router-dom";

const services = [
  {
    icon: "🏡",
    title: "Buy a Property",
    description:
      "Browse thousands of verified listings across India. Find your dream home with our expert agents guiding you every step of the way.",
    features: ["Verified Listings", "Expert Agents", "Best Price Guarantee"],
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    link: "/properties",
    linkLabel: "Browse Properties",
  },
  {
    icon: "💰",
    title: "Sell Your Property",
    description:
      "List your property and reach thousands of potential buyers. Get the best valuation with our free property assessment service.",
    features: ["Free Valuation", "Wide Reach", "Quick Closure"],
    color: "from-green-500 to-emerald-700",
    bg: "bg-green-50",
    link: "/dealer/add",
    linkLabel: "List Property",
  },
  {
    icon: "🏢",
    title: "Rent a Space",
    description:
      "Find the perfect rental — from cozy apartments to spacious offices. Flexible terms and verified landlords across all cities.",
    features: ["Flexible Terms", "Verified Landlords", "No Hidden Charges"],
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
    link: "/properties",
    linkLabel: "Find Rentals",
  },
  {
    icon: "📊",
    title: "Property Management",
    description:
      "Let us handle your property while you sit back and earn. From tenant screening to maintenance, we manage it all.",
    features: ["Tenant Screening", "Rent Collection", "Maintenance Support"],
    color: "from-orange-500 to-orange-700",
    bg: "bg-orange-50",
    link: "/dealer",
    linkLabel: "Get Started",
  },
  {
    icon: "🏦",
    title: "Home Loan Assistance",
    description:
      "Get help finding the best home loan rates. Our financial experts compare offers from top banks to get you the best deal.",
    features: ["Best Rates", "Quick Approval", "Expert Guidance"],
    color: "from-cyan-500 to-cyan-700",
    bg: "bg-cyan-50",
    link: "/contact",
    linkLabel: "Talk to Expert",
  },
  {
    icon: "🔑",
    title: "Legal & Documentation",
    description:
      "Hassle-free documentation and legal support. Our team ensures your property transaction is safe, transparent, and legally sound.",
    features: ["Title Verification", "Agreement Drafting", "Registration Help"],
    color: "from-rose-500 to-rose-700",
    bg: "bg-rose-50",
    link: "/contact",
    linkLabel: "Get Legal Help",
  },
];

const stats = [
  { value: "10,000+", label: "Properties Listed" },
  { value: "5,000+", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "50+", label: "Cities Covered" },
];

export function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── HERO SECTION ── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 text-white py-24 px-4 overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            🌟 What We Offer
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Our <span className="text-yellow-300">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            From buying your first home to managing a portfolio of properties —
            we provide end-to-end real estate solutions tailored for you.
          </p>
          <Link
            to="/properties"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            Explore Properties →
          </Link>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-blue-600">{s.value}</p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            We offer a complete suite of real estate services — all under one roof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className={`rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group ${service.bg}`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="mb-6 space-y-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 text-xs font-bold flex-shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={service.link}
                className={`inline-block bg-gradient-to-r ${service.color} text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow hover:opacity-90 transition-all duration-200`}
              >
                {service.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Why Choose EstatHub?</h2>
          <p className="text-slate-400 text-lg mb-14 max-w-xl mx-auto">
            Trusted by thousands of homebuyers, sellers, and investors across India.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛡️",
                title: "100% Verified Listings",
                desc: "Every property is manually verified by our team before being listed.",
              },
              {
                icon: "⚡",
                title: "Fast & Transparent",
                desc: "No hidden fees, no delays. We make the process smooth and clear.",
              },
              {
                icon: "📞",
                title: "24/7 Expert Support",
                desc: "Our agents are always available to answer your questions anytime.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Book a free consultation with our experts today and take the first step
          towards your dream property.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/properties"
            className="bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:scale-105"
          >
            Browse Properties
          </Link>
          <Link
            to="/login"
            className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:scale-105"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
