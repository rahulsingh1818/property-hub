import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import myimage from "../assets/rahul.jpg";
import myimage2 from "../assets/rahul2.jpg";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaUserPlus, FaCog, FaUsers } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
}

// Reusable wishlist heart for home page cards
function HomeWishlistHeart({ property }) {
  const user = getUser();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`${API}/api/wishlist/check?userId=${user.id}&propertyId=${property.id}`)
      .then(({ data }) => setWishlisted(data.wishlisted))
      .catch(() => {});
  }, [user?.id, property.id]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id) { alert("Please login to save to wishlist."); return; }
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/wishlist/toggle`, {
        userId: user.id, userName: user.name, userEmail: user.email,
        propertyId: String(property.id),
        propertyTitle: property.title, propertyLocation: property.location,
        propertyPrice: property.price, propertyImage: property.image,
        propertyType: property.type || "villa",
      });
      setWishlisted(data.wishlisted);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <button
      onClick={handleToggle}
      title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      style={{
        background: wishlisted ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(4px)",
        border: "none", borderRadius: "50%",
        width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: loading ? "default" : "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "all 0.22s ease",
      }}
    >
      <svg viewBox="0 0 20 20" style={{ width: 16, height: 16, fill: wishlisted ? "#fff" : "#ef4444", transition: "all 0.2s" }}>
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  // ── Hero search state ────────────────────────────────────────────────────────
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType,     setSearchType]     = useState("");
  const [searchBudget,   setSearchBudget]   = useState("");

  // Map budget label → min/max CR values passed as URL params
  const handleHeroSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set("search", searchLocation.trim());
    if (searchType)            params.set("type",   searchType.toLowerCase());
    if (searchBudget)          params.set("budget", searchBudget);
    navigate(`/properties?${params.toString()}`);
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", contactForm);
      alert("Message sent successfully ✅");
      setContactForm({ name: "", phone: "", message: "" });
    } catch (error) {
      alert("Error sending message ❌");
      console.log(error);
    }
  };

   const slides = [
    [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    ],
    [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
    ],
    [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
  ];
  const [current, setCurrent] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides[0].length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
const blogs = [
    {
      title: "Best Neighborhoods to Invest in Pune in 2025",
      images: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
      ],
    },
    {
      title: "Best Residential Areas to Buy Property in Noida",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      ],
    },
    {
      title: "First-Time Home Buyer’s Guide: How to Choose Right Property",
      images: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
        "https://images.unsplash.com/photo-1556911220-bff31c812dba",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      ],
    },
    {
      title: "The Rise of Sustainable and Smart Homes in India",
      images: [
        "https://images.unsplash.com/photo-1556911220-bff31c812dba",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
        "https://images.unsplash.com/photo-1605146769289-440113cc3d00",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      ],
    },
  ];

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Delhi",
      price: "₹2.5 Cr",
      beds: 4,
      baths: 3,
      area: "3500 sq.ft",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      featured: true,
    },
    {
      id: 2,
      title: "Penthouse Apartment",
      location: "Gurgaon",
      price: "₹1.8 Cr",
      beds: 3,
      baths: 2,
      area: "2800 sq.ft",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      featured: true,
    },
    {
      id: 3,
      title: "Riverside Bungalow",
      location: "Noida",
      price: "₹3.2 Cr",
      beds: 5,
      baths: 4,
      area: "4200 sq.ft",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      featured: true,
    },
  ]);
   const titles = [
    "Best Neighborhoods to Invest in Pune in 2025",
    "Best Residential Areas to Buy Property in Noida",
    "First-Time Home Buyer’s Guide",
    "Rise of Sustainable Smart Homes in India",
  ];
  const links = [
    "ATS Projects in Noida",
    "New Flats in Mumbai for Sale",
    "3BHK Apartments in Noida",
    "ACE Projects in Noida",
    "New Residential Projects in Noida",
    "New Projects in Noida Extension",
    "4BHK apartments in Noida Extension",
    "Commercial Property in Noida",

    "Flats in Gurgaon",
    "Plots in Yamuna Expressway",
    "3BHK Flats in Gurugram",
    "Godrej Projects in Noida",
    "Commercial Property in Greater Noida",
    "Godrej Projects in Gurugram",
    "Flats in Gurugram for sale",
    "Flats in Kharadi",

    "New Launch Projects in Gurugram",
    "Max Estate Projects in Gurugram",
    "4BHK Apartments in Noida",
    "Flats for Sale in Pune",
    "2BHK Flats in Noida Extension",
    "Flats in Delhi for sale",
    "Flats for Sale in Noida",

    "Godrej Projects in Gurgaon",
    "M3M new projects in Gurgaon",
    "3BHK Flats in Noida Extension",
    "New Residential Projects in Gurgaon",
    "Residential Projects in Siddharth Vihar",
    "4BHK Flats in Gurugram",
    "Residential Projects in Greater Noida West",
  ];
 const columns = [
    [
      "ATS Projects in Noida",
      "New Flats in Mumbai for Sale",
      "3BHK Apartments in Noida",
      "ACE Projects in Noida",
      "New Residential Projects in Noida",
      "New Projects in Noida Extension",
      "4BHK apartments in Noida Extension",
      "Commercial Property in Noida",
    ],
    [
      "Flats in Gurgaon",
      "Plots in Yamuna Expressway",
      "3BHK Flats in Gurugram",
      "Godrej Projects in Noida",
      "Commercial Property in Greater Noida",
      "Godrej Projects in Gurugram",
      "Flats in Gurugram for sale",
      "Flats in Kharadi",
    ],
    [
      "New Launch Projects in Gurugram",
      "Max Estate Projects in Gurugram",
      "4BHK Apartments in Noida",
      "Flats for Sale in Pune",
      "2BHK Flats in Noida Extension",
      "Flats in Delhi for sale",
      "Flats for Sale in Noida",
    ],
    [
      "Godrej Projects in Gurgaon",
      "M3M new projects in Gurgaon",
      "3BHK Flats in Noida Extension",
      "New Residential Projects in Gurgaon",
      "Residential Projects in Siddharth Vihar",
      "4BHK Flats in Gurugram",
      "Residential Projects in Greater Noida West",
    ],
  ];
  const socials = [
    { name: "Facebook", icon: <FaFacebookF /> },
    { name: "Twitter", icon: <FaTwitter /> },
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "LinkedIn", icon: <FaLinkedinIn /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-red-300 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
       <div className="absolute inset-0">
  <img
    src={myimage}
    alt="city"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/40"></div>
</div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-in fade-in slide-in-from-bottom duration-700">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
              Discover the perfect property that matches your lifestyle and budget
            </p>
            
            {/* Search Bar */}
            <div className="glass-effect rounded-2xl p-2 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <div className="grid md:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Location (e.g. Delhi, Noida)"
                  className="input-field text-green-900"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                />
                <select
                  className="input-field text-green-900"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="bungalow">Bungalow</option>
                </select>
                <select
                  className="input-field text-green-900"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                >
                  <option value="">Budget</option>
                  <option value="under50L">Under ₹50L</option>
                  <option value="50Lto1Cr">₹50L – ₹1 Cr</option>
                  <option value="1Crto2Cr">₹1 Cr – ₹2 Cr</option>
                  <option value="2Crto5Cr">₹2 Cr – ₹5 Cr</option>
                  <option value="above5Cr">Above ₹5 Cr</option>
                </select>
                <button className="btn-primary" onClick={handleHeroSearch}>
                  🔍 Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Properties Listed" },
              { number: "200+", label: "Happy Customers" },
              { number: "50+", label: "Expert Agents" },
              { number: "10+", label: "Years Experience" },
            ].map((stat, index) => (
              <div key={index} className="p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300">
                <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Featured Properties
            </h2>
            <p className="text-slate-600 text-lg">
              Handpicked premium properties just for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="card group cursor-pointer"  >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Featured
                  </div>
                  <div className="absolute top-4 left-4">
                    <HomeWishlistHeart property={property} />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {property.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-slate-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                    <div className="flex items-center">
                      <span className="mr-3">🛏️ {property.beds} Beds</span>
                      <span className="mr-3">🚿 {property.baths} Baths</span>
                    </div>
                    <span>📏 {property.area}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-2xl font-bold text-gradient">
                      {property.price}
                    </div>
                    <Link
                      to={`/property/${property.id}`}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/properties" className="btn-secondary inline-block">
              View All Properties →
            </Link>
          </div>
        </div>
      </section>
       <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        

        {/* LEFT SIDE — Images */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="building"
            className="w-full rounded-3xl h-64 object-cover"
          />
          <img
              src={myimage2}
           alt="city"
           className="w-full rounded-3xl h-64 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
            alt="flat"
            className="w-full rounded-3xl h-64 object-cover col-span-2"
          />
        </div>

        {/* RIGHT SIDE — Text */}
        <div>
          <p className="text-blue-600 font-semibold mb-2 uppercase tracking-wide">
            Invest Only To Gain Profit
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About Us
          </h2>

          <p className="text-slate-600 leading-relaxed mb-6">
          Lorem ipsum, is pariatur, in sit dolorum fuga numquam nam aperiam blanditiis error consequuntur facere obcaecati sint velit libero maiores, dignissimos perferendis, perspiciatis quam. Iure, possimus. Natus, nesciunt. Delectus, repudiandae enim sed ea iusto eius, corporis error eum nemo, voluptatem quod similique repellendus distinctio eligendi! Quia molestiae laudantium optio quae veniam beatae cupiditate laboriosam quas eos facere. Tempora est porro voluptatum atque culpa voluptas error praesentium quasi id! Aut placeat a ut obcaecati possimus ducimus unde ab quae saepe temporibus illo quis laborum, dolorum rem laudantium ipsa perferendis.
          </p>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Read More →
          </button>
        </div>

      </div>
    </section>
<section
  style={{
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    color: "white",
    textAlign: "center",
    padding: "80px 20px",
  }}
>
  <p
    style={{
      fontSize: "14px",
      letterSpacing: "2px",
      opacity: "0.8",
      marginBottom: "10px",
    }}
  >
    HOW IT WORKS
  </p>

  <h2 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "60px" }}>
    Three steps to smarter spending
  </h2>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      flexWrap: "wrap",
    }}
  >
    {/* Step 1 */}
    <div style={{ maxWidth: "280px", textAlign: "center" }}>
      <FaUserPlus size={60} style={{ margin: "0 auto 20px", display: "block" }} />
      <h3>Sign up & load funds</h3>
      <p style={{ opacity: "0.85", lineHeight: "1.5" }}>
        Verify your company and load funds to your wallet from your existing
        bank account.
      </p>
    </div>

    {/* Step 2 */}
    <div style={{ maxWidth: "280px", textAlign: "center" }}>
      <FaCog size={60} style={{ margin: "0 auto 20px", display: "block" }} />
      <h3>Set your spending rules</h3>
      <p style={{ opacity: "0.85", lineHeight: "1.5" }}>
        Define teams, approval workflows, spending policies, and card limits
        that work for you.
      </p>
    </div>

    {/* Step 3 */}
    <div style={{ maxWidth: "280px", textAlign: "center" }}>
      <FaUsers size={60} style={{ margin: "0 auto 20px", display: "block" }} />
      <h3>Invite your team</h3>
      <p style={{ opacity: "0.85", lineHeight: "1.5" }}>
        Employees can request funds, pay securely, and submit receipts in a
        snap with the app.
      </p>
    </div>
  </div>
</section>

    {/* Testimonial Section */}
   <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4">
  <div className="max-w-6xl mx-auto text-center">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
      What Our Clients Say
    </h2>
    <p className="text-gray-500 mt-2 mb-12">
      Trusted by hundreds of happy customers
    </p>

    {/* Cards Grid */}
    <div className="grid md:grid-cols-3 gap-8">

      {[
        {
          img: "https://i.pravatar.cc/100?img=12",
          name: "Rahul Sharma",
          role: "Home Buyer",
          text: "Amazing service and very smooth property buying experience. Highly recommended!",
        },
        {
          img: "https://i.pravatar.cc/100?img=32",
          name: "Priya Verma",
          role: "Investor",
          text: "Best real estate consultation I’ve ever received. Very professional team.",
        },
        {
          img: "https://i.pravatar.cc/100?img=15",
          name: "Amit Singh",
          role: "Business Owner",
          text: "Transparent deals and great support from start to finish. Loved the experience.",
        },
      ].map((client, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
        >
          {/* Avatar */}
          <img
            src={client.img}
            alt={client.name}
            className="w-20 h-20 mx-auto rounded-full border-4 border-blue-100"
          />

          {/* Text */}
          <p className="text-gray-600 mt-6 italic">“{client.text}”</p>

          {/* Name */}
          <h4 className="mt-6 font-semibold text-lg text-gray-800">
            {client.name}
          </h4>
          <span className="text-sm text-blue-600">{client.role}</span>

          {/* Stars */}
          <div className="flex justify-center mt-4 text-yellow-400 text-lg">
            ★★★★★
          </div>
        </div>
      ))}

    </div>
  </div>
</section>

     <section className="py-16 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-10">
        An Outlook In The World of Real Estate
      </h2>

      {/* 🔹 4 column grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-4">
        {slides.map((imgArray, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
            
            {/* 🔹 Sliding Image */}
            <img
              src={imgArray[current]}
              alt="blog"
              className="w-full h-48 object-cover transition-all duration-500"
            />

            {/* 🔹 Title */}
            <h3 className="p-4 font-semibold text-lg">{titles[i]}</h3>
          </div>
        ))}
      </div>
    </section>
<section className="w-full bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* 🔹 Left Image */}
        <div className="h-[500px] md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
            alt="building"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 🔹 Right Form */}
        <div className="p-10 flex flex-col justify-center">
          
          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Still Confused?
          </h2>
          <p className="text-gray-500 mb-6">
            We are Here to Assist!
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleContactSubmit}>
            
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                placeholder="Enter your name"
                required
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={contactForm.phone}
                onChange={handleContactChange}
                placeholder="Enter 10-digit phone number"
                required
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                rows="4"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                placeholder="How can we help you?"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
 <section className="bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {links.map((item, index) => (
          <a
            key={index}
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            {item}
          </a>
        ))}
      </div>
    </section>
     <section className="bg-gray-100 py-400 px-40">
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
       {/* Heading */}
        <h2 className="text-lg font-bold mb-4">
          RERA Numbers
        </h2>
         {/* Heading */}
        <h2 className="text-lg font-bold mb-4">
          QUICK LINKS
        </h2>
         {/* Heading */}
        <h2 className="text-lg font-bold mb-4">
          Trending Projects
        </h2>
         {/* Heading */}
        <h2 className="text-lg font-bold mb-4">
          OUR Address
          <p className="text-sm text-gray-600">NOIDA(HEAD OFFICE)</p>
        </h2>
        {columns.map((col, i) => (
          <div key={i} className="space-y-3">
            {col.map((item, index) => (
              <a
                key={index}
                href="#"
                className="block text-gray-700 hover:text-blue-600 transition duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
     <div className="py-8 px-4">
      {/* Bold Heading */}
      <h2 className="text-lg font-bold mb-4">Follow Us</h2>

      {/* Social List */}
      <div className="flex space-x-6">
        {socials.map((item, index) => (
          <div key={index} className="flex items-center gap-4 text-gray-700 hover:text-blue-600 cursor-pointer">
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
    {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of happy homeowners who found their dream property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="btn-primary">
              Browse Properties
            </Link>
            <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300">
              Contact Agent
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}