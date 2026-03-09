import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase.js";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
    </svg>
  );

const GoogleIcon = () => (
  <svg width="19" height="19" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.3z"/>
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.7 14.8 48 24 48z"/>
    <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.8-2.9-.8-4.8s.3-3.4.8-4.8V13H2.7C1 16.3 0 19.9 0 23.9s1 7.7 2.7 10.9l8.1-6z"/>
    <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.8 0 6.7 5.3 2.7 13l8.1 6C12.7 13.6 17.9 9.5 24 9.5z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="19" height="19" viewBox="0 0 48 48">
    <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 11.9 8.7 21.9 20.1 23.7V30.9h-6V24h6v-5.2c0-5.9 3.5-9.2 8.9-9.2 2.6 0 5.3.5 5.3.5v5.8h-3c-2.9 0-3.8 1.8-3.8 3.7V24h6.5l-1 6.9h-5.5v16.8C39.3 45.9 48 35.9 48 24z"/>
  </svg>
);
// ─── Role Card ─────────────────────────────────────────────────────────────────
function RoleCard({ id, icon, label, desc, selected, onClick }) {
  return (
    <button type="button" id={id} onClick={onClick}
      style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        padding: "14px 8px",
        border: selected ? "2px solid #c8963e" : "2px solid #e2e8f0",
        borderRadius: "12px",
        background: selected ? "#fffbf2" : "#fff",
        cursor: "pointer",
        transition: "all 0.22s ease",
        position: "relative",
        boxShadow: selected ? "0 0 0 3px rgba(200,150,62,0.15), 0 4px 16px rgba(200,150,62,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
        transform: selected ? "translateY(-2px)" : "none",
      }}
    >
      {selected && (
        <span style={{
          position: "absolute", top: "-8px", right: "-8px",
          background: "#c8963e", color: "#fff",
          width: "20px", height: "20px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700,
          boxShadow: "0 2px 6px rgba(200,150,62,0.4)"
        }}>✓</span>
      )}
      <span style={{ fontSize: "1.6rem" }}>{icon}</span>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: selected ? "#c8963e" : "#1e3a5f", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: "0.68rem", color: "#94a3b8", textAlign: "center", lineHeight: 1.3 }}>{desc}</span>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  const [loginRole, setLoginRole] = useState(""); // selected role on login
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState({ text: "", type: "" });
  const [showForgot, setShowForgot]   = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent]   = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "buyer" });

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) { setForm(f => ({ ...f, email: saved })); setRememberMe(true); }
  }, []);

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setMessage({ text: "", type: "" }); };

  // Password strength
  const getStrength = p => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(form.password);
  const strengthMeta = [null, { label: "Weak", color: "#ef4444" }, { label: "Fair", color: "#f59e0b" }, { label: "Good", color: "#3b82f6" }, { label: "Strong", color: "#22c55e" }][strength];

  const showMsg = (text, type = "error") => setMessage({ text, type });

  // ── Role-based redirect ────────────────────────────────────────────────────────
  const getRoleRedirect = (role) => {
    if (role === "seller" || role === "dealer") return "/dealer";
    if (role === "agent")                       return "/agent-profile";
    if (role === "admin")                       return "/rkis";
    return "/profile"; // buyer → user dashboard
  };

  // ── REGISTER ────────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!form.name.trim())                          return showMsg("Full name is required.");
    if (!form.email.trim())                         return showMsg("Email address is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email))        return showMsg("Please enter a valid email address.");
    if (!form.password)                             return showMsg("Password is required.");
    if (form.password.length < 8)                  return showMsg("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword)    return showMsg("Passwords do not match.");

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role }),
      });
      const data = await res.json();
      if (!res.ok) return showMsg(data.message || "Registration failed.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showMsg(`Welcome, ${data.user.name}! Your account has been created.`, "success");
      setTimeout(() => navigate(getRoleRedirect(data.user.role)), 1500);
    } catch { showMsg("Cannot connect to server. Please try again."); }
    finally   { setLoading(false); }
  };


  // ── LOGIN ────────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginRole)         return showMsg("Please select your role to continue.");
    if (!form.email.trim()) return showMsg("Email is required.");
    if (!form.password)     return showMsg("Password is required.");
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) return showMsg(data.message || "Login failed.");

      // Role mismatch check — agar selected role aur DB role match nahi kare
      const serverRole = data.user.role;
      const normalizedLogin = loginRole === "seller" ? ["seller", "dealer"] : [loginRole];
      if (!normalizedLogin.includes(serverRole) && serverRole !== "admin") {
        return showMsg(`This account is registered as "${serverRole}". Please select the correct role.`);
      }

      if (rememberMe) localStorage.setItem("rememberedEmail", form.email);
      else            localStorage.removeItem("rememberedEmail");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showMsg(`Welcome back, ${data.user.name}! Redirecting…`, "success");
      setTimeout(() => navigate(getRoleRedirect(serverRole)), 1500);
    } catch { showMsg("Cannot connect to server. Please try again."); }
    finally   { setLoading(false); }
  };

  const handleSubmit = e => { e.preventDefault(); isLogin ? handleLogin() : handleRegister(); };

  const handleForgot = async e => {
    e.preventDefault();
    if (!forgotEmail.trim()) return showMsg("Please enter your email.");
    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch { showMsg("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  const switchMode = () => { setIsLogin(!isLogin); setMessage({ text: "", type: "" }); setShowPass(false); setShowConfirm(false); setLoginRole(""); };

  // ── GOOGLE LOGIN (popup — works on localhost/Vite; COOP warning is harmless) ───
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Send Google profile to our backend ― upserts user in MongoDB, returns JWT
      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     firebaseUser.displayName || "Google User",
          email:    firebaseUser.email,
          googleId: firebaseUser.uid,
          avatar:   firebaseUser.photoURL || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) { showMsg(data.message || "Google login failed. Please try again."); return; }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showMsg(`Welcome, ${data.user.name}! Signing you in…`, "success");
      setTimeout(() => navigate(getRoleRedirect(data.user.role)), 1200);
    } catch (err) {
      // User closed the popup — silently ignore
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // no-op
      } else if (err.code === "auth/popup-blocked") {
        showMsg("❌ Popup was blocked by your browser. Please allow popups for this site and try again.");
      } else if (err.code === "auth/operation-not-allowed") {
        showMsg("❌ Google sign-in is not enabled. Please contact the administrator.");
      } else if (err.code === "auth/network-request-failed") {
        showMsg("❌ Network error. Please check your internet connection.");
      } else {
        showMsg("Google sign-in failed. Please try again.");
        console.error("Google login error:", err.code, err.message);
      }
    } finally {
      setLoading(false);
    }
  };


  const S = {
    page: {
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: "#f8fafd",
    },

    // ── LEFT PANEL ──
    leftPanel: {
      width: "45%",
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1e3a5f 0%, #163251 40%, #0f2540 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "48px 52px",
      position: "relative",
      overflow: "hidden",
    },
    leftOverlay: {
      position: "absolute", inset: 0,
      background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      pointerEvents: "none",
    },
    leftGlow1: {
      position: "absolute", width: "320px", height: "320px",
      background: "radial-gradient(circle, rgba(200,150,62,0.18) 0%, transparent 70%)",
      top: "-60px", left: "-60px", pointerEvents: "none",
    },
    leftGlow2: {
      position: "absolute", width: "280px", height: "280px",
      background: "radial-gradient(circle, rgba(30,100,160,0.25) 0%, transparent 70%)",
      bottom: "80px", right: "-40px", pointerEvents: "none",
    },

    logoWrap: { display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 },
    logoIcon: {
      width: "44px", height: "44px",
      background: "linear-gradient(135deg, #c8963e, #e8b86d)",
      borderRadius: "10px",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "1.2rem",
      boxShadow: "0 4px 16px rgba(200,150,62,0.35)",
    },
    logoText: { fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" },
    logoSub:  { fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" },

    heroSection: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
    heroTag: {
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: "rgba(200,150,62,0.18)", border: "1px solid rgba(200,150,62,0.35)",
      borderRadius: "20px", padding: "5px 14px", marginBottom: "24px",
      fontSize: "0.75rem", fontWeight: 600, color: "#e8b86d", letterSpacing: "0.06em", textTransform: "uppercase",
      width: "fit-content",
    },
    heroTitle: { fontSize: "2.4rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-0.03em" },
    heroGold:  { color: "#c8963e" },
    heroDesc:  { fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "360px", marginBottom: "40px" },

    statsRow: { display: "flex", gap: "32px", position: "relative", zIndex: 1 },
    statItem: { textAlign: "left" },
    statNum:  { fontSize: "1.5rem", fontWeight: 800, color: "#c8963e" },
    statLabel:{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 },

    featureList: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" },
    featureItem: { display: "flex", alignItems: "center", gap: "12px" },
    featureDot: {
      width: "28px", height: "28px", borderRadius: "6px",
      background: "rgba(200,150,62,0.18)", border: "1px solid rgba(200,150,62,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.85rem", flexShrink: 0,
    },
    featureText: { fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 },

    testimonial: {
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px", padding: "20px 22px", position: "relative", zIndex: 1, marginTop: "auto",
    },
    testimonialQ:    { fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "12px" },
    testimonialName: { fontSize: "0.8rem", fontWeight: 700, color: "#c8963e" },
    testimonialRole: { fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" },
    stars: { color: "#c8963e", fontSize: "0.85rem", marginBottom: "10px", letterSpacing: "2px" },

    // ── RIGHT PANEL ──
    rightPanel: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 32px",
      background: "#f8fafd",
      overflowY: "auto",
    },
    formBox: { width: "100%", maxWidth: "440px" },

    formHeader: { marginBottom: "28px" },
    formTitle:  { fontSize: "1.75rem", fontWeight: 800, color: "#0f2540", marginBottom: "6px", letterSpacing: "-0.03em" },
    formSubtitle:{ fontSize: "0.9rem", color: "#64748b" },

    // Toggle tabs
    tabWrap: {
      display: "flex",
      background: "#f1f5f9",
      borderRadius: "10px",
      padding: "4px",
      marginBottom: "24px",
      border: "1px solid #e2e8f0",
    },
    tabBtn: {
      flex: 1, padding: "9px", border: "none",
      borderRadius: "7px", cursor: "pointer",
      fontSize: "0.88rem", fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      transition: "all 0.25s ease",
    },
    tabActive: {
      background: "#fff",
      color: "#1e3a5f",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    },
    tabInactive: { background: "transparent", color: "#94a3b8" },

    // Message
    msgBox: (type) => ({
      padding: "10px 14px",
      borderRadius: "8px",
      marginBottom: "16px",
      fontSize: "0.85rem",
      fontWeight: 500,
      background: type === "success" ? "#f0fdf4" : "#fff5f5",
      border:     type === "success" ? "1px solid #bbf7d0" : "1px solid #fed7d7",
      color:      type === "success" ? "#15803d" : "#dc2626",
      display: "flex", alignItems: "center", gap: "7px",
    }),

    // Form elements
    fieldGroup: { marginBottom: "14px" },
    fieldLabel: {
      display: "block", fontSize: "0.8rem", fontWeight: 600,
      color: "#374151", marginBottom: "6px", letterSpacing: "0.02em",
    },
    inputWrap: { position: "relative" },
    input: {
      width: "100%", padding: "11px 14px",
      border: "1.5px solid #e2e8f0",
      borderRadius: "9px",
      fontSize: "0.93rem", color: "#1e293b",
      fontFamily: "'Inter', sans-serif",
      background: "#fff",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },
    inputSuffix: {
      position: "absolute", right: "13px", top: "50%",
      transform: "translateY(-50%)", color: "#9ca3af",
      cursor: "pointer", display: "flex", alignItems: "center",
      transition: "color 0.2s",
    },

    // Strength
    strengthWrap: { display: "flex", gap: "4px", alignItems: "center", marginTop: "6px" },
    strengthSeg: (active, color) => ({
      flex: 1, height: "3px", borderRadius: "2px",
      background: active ? color : "#e2e8f0", transition: "background 0.35s ease",
    }),
    strengthLabel: color => ({ fontSize: "0.72rem", fontWeight: 700, color, minWidth: "38px" }),

    // Role cards
    rolesLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "8px", display: "block" },
    rolesRow: { display: "flex", gap: "8px", marginBottom: "16px" },

    // Extras
    extrasRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" },
    rememberLabel: { display: "flex", alignItems: "center", gap: "7px", fontSize: "0.85rem", color: "#4b5563", cursor: "pointer" },
    forgotLink: { fontSize: "0.85rem", color: "#1e3a5f", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" },

    // Submit
    submitBtn: {
      width: "100%", padding: "12px",
      background: "linear-gradient(135deg, #1e3a5f 0%, #163251 100%)",
      color: "#fff", border: "none",
      borderRadius: "9px", fontSize: "0.97rem",
      fontWeight: 700, fontFamily: "'Inter', sans-serif",
      cursor: "pointer", transition: "all 0.25s ease",
      boxShadow: "0 4px 18px rgba(30,58,95,0.3)",
      letterSpacing: "0.02em",
    },

    // Divider
    divider: { display: "flex", alignItems: "center", gap: "12px", margin: "18px 0", color: "#94a3b8", fontSize: "0.8rem" },
    divLine: { flex: 1, height: "1px", background: "#e2e8f0" },

    // Social
    socialRow: { display: "flex", gap: "10px" },
    socialBtn: {
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      gap: "8px", padding: "10px",
      background: "#fff", border: "1.5px solid #e2e8f0",
      borderRadius: "9px", fontSize: "0.85rem",
      fontWeight: 600, fontFamily: "'Inter', sans-serif",
      cursor: "pointer", color: "#374151",
      transition: "all 0.2s ease",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    },

    // OTP + Switch
    otpRow: { textAlign: "center", marginTop: "10px", fontSize: "0.84rem", color: "#94a3b8" },
    switchRow: { textAlign: "center", marginTop: "20px", fontSize: "0.87rem", color: "#64748b" },
    switchLink: { color: "#c8963e", fontWeight: 700, cursor: "pointer" },

    // Forgot modal
    overlay: {
      position: "fixed", inset: 0, background: "rgba(15,37,64,0.55)",
      backdropFilter: "blur(4px)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    },
    forgotCard: {
      background: "#fff", borderRadius: "18px",
      padding: "32px 28px", maxWidth: "380px", width: "100%",
      boxShadow: "0 24px 56px rgba(0,0,0,0.18)",
    },
    forgotTitle: { fontSize: "1.25rem", fontWeight: 800, color: "#0f2540", marginBottom: "6px" },
    forgotDesc:  { fontSize: "0.88rem", color: "#64748b", marginBottom: "20px", lineHeight: 1.6 },
    cancelBtn: {
      width: "100%", marginTop: "10px", padding: "10px",
      background: "transparent", border: "1.5px solid #e2e8f0",
      borderRadius: "9px", fontSize: "0.88rem",
      fontFamily: "'Inter', sans-serif", color: "#64748b",
      cursor: "pointer", transition: "all 0.2s",
    },
  };

  const inputFocusStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    .re-input:focus { border-color: #c8963e !important; box-shadow: 0 0 0 3px rgba(200,150,62,0.12) !important; }
    .re-input::placeholder { color: #c0ccd8; }
    .social-btn-re:hover { border-color: #c8963e !important; box-shadow: 0 2px 10px rgba(200,150,62,0.12) !important; }
    .submit-btn-re:hover { background: linear-gradient(135deg, #163251 0%, #0f2540 100%) !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(30,58,95,0.4) !important; }
    .submit-btn-re:disabled { opacity: 0.65; cursor: not-allowed; transform: none !important; }
    .tab-btn-re:hover { color: #1e3a5f !important; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner-re { display:inline-block; width:16px; height:16px; border:2.5px solid rgba(255,255,255,0.35); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; vertical-align:middle; margin-right:6px; }
    @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    .field-anim { animation: slideUp 0.3s ease both; }
    @media (max-width: 768px) {
      .re-left-panel { display: none !important; }
      .re-right-panel { padding: 28px 20px !important; }
    }
  `;

  return (
    <>
      <style>{inputFocusStyle}</style>

      {/* ── Forgot Password Modal ── */}
      {showForgot && (
        <div style={S.overlay}>
          <div style={S.forgotCard}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔐</div>
            <div style={S.forgotTitle}>Reset Your Password</div>
            {forgotSent ? (
              <>
                <p style={{ ...S.forgotDesc, color: "#15803d", background: "#f0fdf4", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  ✅ A password reset link has been sent to <strong>{forgotEmail}</strong>. Please check your inbox.
                </p>
                <button style={S.cancelBtn} onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}>
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={handleForgot}>
                <p style={S.forgotDesc}>Enter your registered email address and we'll send you a secure reset link.</p>
                {message.text && !isLogin && (
                  <div style={S.msgBox("error")}>{message.text}</div>
                )}
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>Email Address</label>
                  <input id="forgot-email" type="email" className="re-input" style={S.input}
                    placeholder="you@example.com" value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)} />
                </div>
                <button type="submit" className="submit-btn-re" style={{ ...S.submitBtn, marginTop: "4px" }} disabled={loading}>
                  {loading ? <><span className="spinner-re" />Sending…</> : "Send Reset Link"}
                </button>
                <button type="button" style={S.cancelBtn}
                  onClick={() => { setShowForgot(false); setMessage({ text: "", type: "" }); }}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div style={S.page}>

        {/* ════════════════════ LEFT PANEL ═════════════════════════ */}
        <div className="re-left-panel" style={S.leftPanel}>
          <div style={S.leftOverlay} />
          <div style={S.leftGlow1} />
          <div style={S.leftGlow2} />

          {/* Logo */}
          <div style={S.logoWrap}>
            <div style={S.logoIcon}>🏠</div>
            <div>
              <div style={S.logoText}>RealEstate Pro</div>
              <div style={S.logoSub}>Premium Properties</div>
            </div>
          </div>

          {/* Hero Content */}
          <div style={S.heroSection}>
            <div style={S.heroTag}>
              <span>★</span> Trusted by 50,000+ clients
            </div>
            <h1 style={S.heroTitle}>
              Find Your Perfect<br />
              <span style={S.heroGold}>Dream Property</span>
            </h1>
            <p style={S.heroDesc}>
              India's most trusted real estate platform. Buy, sell, or rent with confidence — verified listings, expert agents, zero brokerage.
            </p>

            {/* Features */}
            <div style={S.featureList}>
              {[
                ["🏘️", "10,000+ Verified Properties"],
                ["🤝", "Expert Agents & Zero Brokerage"],
                ["🔒", "Secure Transactions & Legal Support"],
                ["📍", "Pan-India Coverage in 50+ Cities"],
              ].map(([icon, text]) => (
                <div key={text} style={S.featureItem}>
                  <div style={S.featureDot}>{icon}</div>
                  <span style={S.featureText}>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={S.statsRow}>
              {[["50K+", "Happy Clients"], ["10K+", "Properties"], ["98%", "Satisfaction"]].map(([num, lbl]) => (
                <div key={lbl} style={S.statItem}>
                  <div style={S.statNum}>{num}</div>
                  <div style={S.statLabel}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div style={S.testimonial}>
            <div style={S.stars}>★★★★★</div>
            <p style={S.testimonialQ}>"Found my dream home in just 2 weeks. The process was smooth, transparent and completely hassle-free."</p>
            <div style={S.testimonialName}>Rahul Sharma</div>
            <div style={S.testimonialRole}>Homebuyer · Mumbai</div>
          </div>
        </div>

        {/* ════════════════════ RIGHT PANEL ════════════════════════ */}
        <div className="re-right-panel" style={S.rightPanel}>
          <div style={S.formBox}>

            {/* Header */}
            <div style={S.formHeader}>
              <h1 style={S.formTitle}>
                {isLogin ? "Sign In to Your Account" : "Create Your Account"}
              </h1>
              <p style={S.formSubtitle}>
                {isLogin
                  ? "Welcome back! Please enter your credentials."
                  : "Join thousands of buyers, sellers and agents today."}
              </p>
            </div>

            {/* Tab Toggle */}
            <div style={S.tabWrap}>
              <button id="toggle-login" className="tab-btn-re" style={{ ...S.tabBtn, ...(isLogin ? S.tabActive : S.tabInactive) }}
                onClick={() => isLogin || switchMode()}>
                Sign In
              </button>
              <button id="toggle-register" className="tab-btn-re" style={{ ...S.tabBtn, ...(!isLogin ? S.tabActive : S.tabInactive) }}
                onClick={() => !isLogin || switchMode()}>
                Register
              </button>
            </div>

            {/* Message */}
            {message.text && (
              <div style={S.msgBox(message.type)}>
                <span>{message.type === "success" ? "✅" : "⚠️"}</span>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* ──── REGISTER FIELDS ──── */}
              {!isLogin && (
                <>
                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "0ms" }}>
                    <label style={S.fieldLabel} htmlFor="reg-name">Full Name <span style={{ color: "#ef4444" }}>*</span></label>
                    <input id="reg-name" type="text" name="name" className="re-input" style={S.input}
                      placeholder="e.g. Rahul Sharma" value={form.name} onChange={handleChange} />
                  </div>

                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "40ms" }}>
                    <label style={S.fieldLabel} htmlFor="reg-email">Email Address <span style={{ color: "#ef4444" }}>*</span></label>
                    <input id="reg-email" type="email" name="email" className="re-input" style={S.input}
                      placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </div>

                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "80ms" }}>
                    <label style={S.fieldLabel} htmlFor="reg-phone">
                      Mobile Number <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input id="reg-phone" type="tel" name="phone" className="re-input" style={S.input}
                      placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                  </div>

                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "120ms" }}>
                    <label style={S.fieldLabel} htmlFor="reg-password">Password <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={S.inputWrap}>
                      <input id="reg-password" type={showPass ? "text" : "password"} name="password"
                        className="re-input" style={{ ...S.input, paddingRight: "44px" }}
                        placeholder="Min 8 characters" value={form.password} onChange={handleChange} />
                      <span style={S.inputSuffix} onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></span>
                    </div>
                    {form.password && (
                      <div style={S.strengthWrap}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={S.strengthSeg(i <= strength, strengthMeta?.color)} />
                        ))}
                        <span style={S.strengthLabel(strengthMeta?.color || "#e2e8f0")}>{strengthMeta?.label}</span>
                      </div>
                    )}
                  </div>

                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "160ms" }}>
                    <label style={S.fieldLabel} htmlFor="reg-confirm">Confirm Password <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={S.inputWrap}>
                      <input id="reg-confirm" type={showConfirm ? "text" : "password"} name="confirmPassword"
                        className="re-input" style={{ ...S.input, paddingRight: "44px" }}
                        placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />
                      <span style={S.inputSuffix} onClick={() => setShowConfirm(!showConfirm)}><EyeIcon open={showConfirm} /></span>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="field-anim" style={{ animationDelay: "200ms", marginBottom: "18px" }}>
                    <span style={S.rolesLabel}>I am looking to… <span style={{ color: "#ef4444" }}>*</span></span>
                    <div style={S.rolesRow}>
                      <RoleCard id="role-buyer"  icon="🏡" label="Buy"   desc="Find & buy"    selected={form.role === "buyer"}  onClick={() => setForm({ ...form, role: "buyer" })} />
                      <RoleCard id="role-seller" icon="💼" label="Sell"  desc="List & sell"   selected={form.role === "seller"} onClick={() => setForm({ ...form, role: "seller" })} />
                      <RoleCard id="role-agent"  icon="🤝" label="Agent" desc="Represent"     selected={form.role === "agent"}  onClick={() => setForm({ ...form, role: "agent" })} />
                    </div>
                  </div>
                </>
              )}

              {/* ──── LOGIN FIELDS ──── */}
              {isLogin && (
                <>
                  {/* ── Step 1: Role Selection ── */}
                  <div className="field-anim" style={{ marginBottom: "18px", animationDelay: "0ms" }}>
                    <label style={{ ...S.fieldLabel, marginBottom: "10px", display: "block" }}>
                      Step 1 — Select Your Role
                      <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[
                        { id: "login-role-buyer",  role: "buyer",  icon: "🏡", label: "Buyer",  desc: "Looking to buy" },
                        { id: "login-role-seller", role: "seller", icon: "💼", label: "Seller", desc: "Listing property" },
                        { id: "login-role-agent",  role: "agent",  icon: "🤝", label: "Agent",  desc: "Representing clients" },
                      ].map(({ id, role, icon, label, desc }) => {
                        const sel = loginRole === role;
                        return (
                          <button key={role} id={id} type="button"
                            onClick={() => { setLoginRole(role); setMessage({ text: "", type: "" }); }}
                            style={{
                              display: "flex", flexDirection: "column", alignItems: "center",
                              gap: "5px", padding: "14px 8px",
                              border: sel ? "2px solid #c8963e" : "2px solid #e2e8f0",
                              borderRadius: "12px",
                              background: sel ? "#fffbf2" : "#fff",
                              cursor: "pointer",
                              transition: "all 0.22s ease",
                              boxShadow: sel
                                ? "0 0 0 3px rgba(200,150,62,0.15), 0 4px 14px rgba(200,150,62,0.15)"
                                : "0 1px 4px rgba(0,0,0,0.05)",
                              transform: sel ? "translateY(-2px)" : "none",
                              fontFamily: "'Inter', sans-serif",
                              position: "relative",
                            }}
                          >
                            {sel && (
                              <span style={{
                                position: "absolute", top: "-8px", right: "-8px",
                                background: "#c8963e", color: "#fff",
                                width: "20px", height: "20px", borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "11px", fontWeight: 700,
                                boxShadow: "0 2px 6px rgba(200,150,62,0.4)",
                              }}>✓</span>
                            )}
                            <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                            <span style={{
                              fontSize: "0.78rem", fontWeight: 700,
                              color: sel ? "#c8963e" : "#1e3a5f",
                              letterSpacing: "0.04em", textTransform: "uppercase",
                            }}>{label}</span>
                            <span style={{ fontSize: "0.67rem", color: "#94a3b8", textAlign: "center", lineHeight: 1.3 }}>{desc}</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Hint strip */}
                    {loginRole && (
                      <div style={{
                        marginTop: "8px", padding: "7px 12px",
                        background: "#fffbf2", border: "1px solid rgba(200,150,62,0.3)",
                        borderRadius: "8px", fontSize: "0.78rem", color: "#92700a",
                        display: "flex", alignItems: "center", gap: "6px",
                      }}>
                        <span>✅</span>
                        <span>Signing in as <strong style={{ textTransform: "capitalize" }}>{loginRole}</strong> — ensure your account is registered with this role.</span>
                      </div>
                    )}
                  </div>

                  {/* Divider between steps */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>STEP 2 — ENTER CREDENTIALS</span>
                    <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                  </div>

                  {/* ── Step 2: Credentials ── */}
                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "0ms" }}>
                    <label style={S.fieldLabel} htmlFor="login-email">Email Address</label>
                    <input id="login-email" type="text" name="email" className="re-input" style={S.input}
                      placeholder="you@example.com"
                      value={form.email} onChange={handleChange} />
                  </div>

                  <div className="field-anim" style={{ ...S.fieldGroup, animationDelay: "50ms" }}>
                    <label style={S.fieldLabel} htmlFor="login-password">Password</label>
                    <div style={S.inputWrap}>
                      <input id="login-password" type={showPass ? "text" : "password"} name="password"
                        className="re-input" style={{ ...S.input, paddingRight: "44px" }}
                        placeholder="Enter your password" value={form.password} onChange={handleChange} />
                      <span style={S.inputSuffix} onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></span>
                    </div>
                  </div>

                  <div style={S.extrasRow}>
                    <label style={S.rememberLabel} htmlFor="remember-me">
                      <input id="remember-me" type="checkbox" checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: "#c8963e", width: "15px", height: "15px", cursor: "pointer" }} />
                      Remember me
                    </label>
                    <span style={S.forgotLink} onClick={() => { setShowForgot(true); setMessage({ text: "", type: "" }); }}>
                      Forgot Password?
                    </span>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button id="auth-submit-btn" type="submit" className="submit-btn-re" style={S.submitBtn} disabled={loading}>
                {loading
                  ? <><span className="spinner-re" />{isLogin ? "Signing In…" : "Creating Account…"}</>
                  : isLogin ? "Sign In →" : "Create Account →"
                }
              </button>
            </form>

            {/* Divider */}
            <div style={S.divider}>
              <div style={S.divLine} />
              <span>or continue with</span>
              <div style={S.divLine} />
            </div>

            {/* Social Buttons */}
            <div style={S.socialRow}>
              <button id="google-login" type="button" className="social-btn-re" style={S.socialBtn}
                onClick={handleGoogleLogin} disabled={loading}>
                <GoogleIcon /> Continue with Google
              </button>
              <button id="facebook-login" type="button" className="social-btn-re" style={S.socialBtn}>
                <FacebookIcon /> Facebook
              </button>
            </div>

            {/* OTP Login (Login mode only) */}
            {isLogin && (
              <div style={S.otpRow}>
                <span style={{ color: "#94a3b8" }}>No password? </span>
                <span id="otp-login-btn" style={{ color: "#c8963e", fontWeight: 600, cursor: "pointer" }}>
                  Login with OTP →
                </span>
              </div>
            )}

            {/* Switch mode */}
            <div style={S.switchRow}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span id={isLogin ? "goto-register" : "goto-login"}
                style={S.switchLink} onClick={switchMode}>
                {isLogin ? "Register here" : "Sign in"}
              </span>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
              {[["🔒", "SSL Secured"], ["✅", "Verified"], ["🛡️", "RERA Compliant"]].map(([icon, lbl]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>
                  <span>{icon}</span><span>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}