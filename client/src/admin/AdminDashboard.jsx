import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/admin";

/* ── Animated counter ── */
function CountUp({ end = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!end) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(end / 35));
    const id = setInterval(() => {
      cur = Math.min(cur + step, end);
      setVal(cur);
      if (cur >= end) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [end]);
  return val;
}

/* ── Mini spark bars ── */
function Spark({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:28, marginTop:4 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex:1, borderRadius:3,
          background: color,
          height:`${(v / max) * 100}%`,
          minHeight:3,
          opacity: i === data.length - 1 ? 1 : 0.45 + i * 0.08,
          transition:"height .3s",
        }}/>
      ))}
    </div>
  );
}
/* ── Status dot ── */
function Dot({ on }) {
  return (
    <span style={{
      display:"inline-block", width:8, height:8,
      background: on ? "#10b981" : "#ef4444",
      borderRadius:"50%",
      boxShadow: on ? "0 0 6px #10b981" : "none",
      animation: on ? "pulse 2s infinite" : "none",
    }}/>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  /* stat card definitions */
  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      change: "+12%", up: true,
      spark: [30,45,38,55,62,70,80],
      grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      glow: "rgba(99,102,241,.28)",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      link: "/rkis/users",
    },
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      change: "+8%", up: true,
      spark: [20,35,28,45,52,48,60],
      grad: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
      glow: "rgba(14,165,233,.28)",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      link: "/rkis/properties",
    },
    {
      label: "Approved Listings",
      value: stats?.activeListings ?? 0,
      change: "+5%", up: true,
      spark: [40,55,45,60,58,72,85],
      grad: "linear-gradient(135deg,#10b981,#059669)",
      glow: "rgba(16,185,129,.28)",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      link: "/rkis/properties",
    },
    {
      label: "Pending Review",
      value: stats?.pendingListings ?? 0,
      change: "-3%", up: false,
      spark: [60,45,50,35,30,28,22],
      grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
      glow: "rgba(245,158,11,.28)",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      link: "/rkis/properties",
    },
    {
      label: "Total Dealers",
      value: stats?.totalDealers ?? 0,
      change: "+20%", up: true,
      spark: [10,18,25,30,38,42,50],
      grad: "linear-gradient(135deg,#ec4899,#a855f7)",
      glow: "rgba(236,72,153,.28)",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      link: "/rkis/users",
    },
  ];

  if (loading) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, gap:16 }}>
        <div style={{ position:"relative", width:52, height:52 }}>
          <div style={{
            position:"absolute", inset:0,
            border:"3px solid #e5e7eb",
            borderTop:"3px solid #6366f1",
            borderRadius:"50%",
            animation:"spin 0.8s linear infinite",
          }}/>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏠</div>
        </div>
        <p style={{ color:"#9ca3af", fontSize:14 }}>Loading dashboard...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ── RENDER ── */
  return (
    <div style={{ maxWidth:1400, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .card-hover:hover { transform: translateY(-3px) !important; }
        .qa-hover:hover { transform: translateY(-2px) !important; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>

      {/* ═══════════════════════════════════════
          1. HERO BANNER
      ═══════════════════════════════════════ */}
      <div style={{
        background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 45%,#ec4899 100%)",
        borderRadius:20,
        padding:"32px 36px",
        marginBottom:28,
        position:"relative",
        overflow:"hidden",
        animation:"fadeUp .5s ease both",
        boxShadow:"0 12px 40px rgba(99,102,241,.35)",
      }}>
        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200,
          background:"rgba(255,255,255,.07)", borderRadius:"50%", filter:"blur(30px)" }}/>
        <div style={{ position:"absolute", bottom:-30, left:60, width:120, height:120,
          background:"rgba(236,72,153,.15)", borderRadius:"50%", filter:"blur(20px)" }}/>
        <div style={{ position:"absolute", top:20, right:160, width:60, height:60,
          background:"rgba(255,255,255,.06)", borderRadius:"50%"}}/>

        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
          <div>
            <div style={{ color:"rgba(255,255,255,.7)", fontSize:13, fontWeight:500, marginBottom:6 }}>
              📅 {dateStr}
            </div>
            <h1 style={{ color:"#fff", fontSize:28, fontWeight:800, margin:0, marginBottom:8, lineHeight:1.2 }}>
              {greeting}, <span style={{ color:"#fde68a" }}>Admin</span> 👋
            </h1>
            <p style={{ color:"rgba(255,255,255,.8)", fontSize:14, margin:0, maxWidth:440 }}>
              Platform is running smoothly. You have{" "}
              <strong style={{ color:"#fde68a" }}>{stats?.pendingListings ?? 0} properties</strong>{" "}
              waiting for review.
            </p>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link to="/rkis/properties" style={{
              background:"rgba(255,255,255,.15)",
              backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,.25)",
              color:"#fff", textDecoration:"none",
              padding:"10px 22px", borderRadius:12,
              fontSize:13, fontWeight:600,
              transition:"all .2s",
            }}>⏳ Review Pending</Link>
            <Link to="/rkis/add-property" style={{
              background:"#fff",
              color:"#6366f1",
              textDecoration:"none",
              padding:"10px 22px", borderRadius:12,
              fontSize:13, fontWeight:700,
              boxShadow:"0 4px 16px rgba(0,0,0,.15)",
              transition:"all .2s",
            }}>+ Add Property</Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          2. STAT CARDS
      ═══════════════════════════════════════ */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
        gap:18,
        marginBottom:28,
      }}>
        {cards.map((c, i) => (
          <Link key={i} to={c.link} style={{ textDecoration:"none" }}>
            <div className="card-hover" style={{
              background:"#fff",
              borderRadius:18,
              padding:"22px 20px 18px",
              boxShadow: `0 4px 20px ${c.glow}`,
              border:"1px solid rgba(0,0,0,.05)",
              transition:"all .25s cubic-bezier(.4,0,.2,1)",
              cursor:"pointer",
              animation:`fadeUp .4s ease ${i * 0.08}s both`,
              position:"relative",
              overflow:"hidden",
            }}>
              {/* top-right gradient blob */}
              <div style={{
                position:"absolute", top:-15, right:-15,
                width:70, height:70,
                background: c.grad,
                borderRadius:"50%",
                opacity:.1,
                filter:"blur(16px)",
              }}/>

              {/* Icon */}
              <div style={{
                width:44, height:44,
                background: c.grad,
                borderRadius:12,
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:14,
                boxShadow:`0 4px 14px ${c.glow}`,
              }}>
                <svg style={{ width:22,height:22,color:"#fff" }} fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.icon}/>
                </svg>
              </div>

              {/* Value */}
              <div style={{ fontSize:32, fontWeight:900, color:"#111827", lineHeight:1, marginBottom:4 }}>
                <CountUp end={c.value} />
              </div>
              <div style={{ fontSize:12.5, color:"#6b7280", fontWeight:500, marginBottom:8 }}>
                {c.label}
              </div>

              {/* Sparkline */}
              <Spark data={c.spark} color={c.grad} />

              {/* Badge */}
              <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{
                  fontSize:11, fontWeight:700,
                  padding:"3px 8px", borderRadius:20,
                  background: c.up ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)",
                  color: c.up ? "#059669" : "#dc2626",
                }}>
                  {c.up ? "▲" : "▼"} {c.change}
                </span>
                <span style={{ fontSize:11, color:"#9ca3af" }}>vs last month</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ═══════════════════════════════════════
          3. QUICK ACTIONS
      ═══════════════════════════════════════ */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:17, fontWeight:700, color:"#111827", marginBottom:14, marginTop:0 }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
          {[
            { to:"/rkis/users",   label:"Manage Users",   sub:"View & edit users",  emoji:"👥", grad:"linear-gradient(135deg,#6366f1,#8b5cf6)" },
            { to:"/rkis/properties", label:"All Properties", sub:"Browse listings", emoji:"🏘️", grad:"linear-gradient(135deg,#0ea5e9,#06b6d4)" },
            { to:"/rkis/add-property", label:"Add Property", sub:"New listing",    emoji:"➕", grad:"linear-gradient(135deg,#10b981,#059669)" },
            { to:"/", label:"View Live Site",  sub:"Open frontend",                emoji:"🌐", grad:"linear-gradient(135deg,#ec4899,#a855f7)" },
          ].map((a, i) => (
            <Link key={i} to={a.to} style={{ textDecoration:"none" }}>
              <div className="qa-hover" style={{
                background:"#fff",
                borderRadius:16,
                padding:"20px 18px",
                boxShadow:"0 2px 14px rgba(0,0,0,.06)",
                border:"1px solid rgba(0,0,0,.05)",
                transition:"all .22s",
                cursor:"pointer",
                animation:`fadeUp .4s ease ${i * 0.07 + 0.4}s both`,
              }}>
                <div style={{
                  width:46, height:46,
                  background: a.grad,
                  borderRadius:13,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, marginBottom:12,
                  boxShadow:"0 4px 12px rgba(0,0,0,.15)",
                }}>
                  {a.emoji}
                </div>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#111827", marginBottom:3 }}>{a.label}</div>
                <div style={{ fontSize:11.5, color:"#9ca3af" }}>{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          4. CHART + STATUS
      ═══════════════════════════════════════ */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:28 }}>

        {/* Bar Chart */}
        <div style={{
          background:"#fff", borderRadius:18, padding:"24px",
          boxShadow:"0 2px 14px rgba(0,0,0,.06)",
          border:"1px solid rgba(0,0,0,.05)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
            <div>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>Weekly Activity</h3>
              <p style={{ margin:"4px 0 0", fontSize:12, color:"#9ca3af" }}>Users & Properties overview</p>
            </div>
            <div style={{ display:"flex", gap:16, fontSize:11, color:"#6b7280" }}>
              <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:10,height:10,background:"#6366f1",borderRadius:3,display:"inline-block" }}/>Users
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:10,height:10,background:"#10b981",borderRadius:3,display:"inline-block" }}/>Properties
              </span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:140 }}>
            {[
              { day:"Mon", u:65, p:40 },
              { day:"Tue", u:80, p:55 },
              { day:"Wed", u:72, p:48 },
              { day:"Thu", u:90, p:70 },
              { day:"Fri", u:85, p:65 },
              { day:"Sat", u:95, p:80 },
              { day:"Sun", u:100, p:88 },
            ].map((d, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:3, width:"100%", height:120 }}>
                  <div style={{
                    flex:1, borderRadius:"5px 5px 0 0",
                    background:"linear-gradient(to top,#6366f1,#a5b4fc)",
                    height:`${d.u}%`,
                    transition:"height .6s ease",
                    cursor:"pointer",
                  }} title={`Users: ${d.u}`}/>
                  <div style={{
                    flex:1, borderRadius:"5px 5px 0 0",
                    background:"linear-gradient(to top,#10b981,#6ee7b7)",
                    height:`${d.p}%`,
                    transition:"height .6s ease",
                    cursor:"pointer",
                  }} title={`Properties: ${d.p}`}/>
                </div>
                <span style={{ fontSize:11, color:"#9ca3af", fontWeight:500 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div style={{
          background:"#fff", borderRadius:18, padding:"24px",
          boxShadow:"0 2px 14px rgba(0,0,0,.06)",
          border:"1px solid rgba(0,0,0,.05)",
          display:"flex", flexDirection:"column",
        }}>
          <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700, color:"#111827" }}>🖥️ System Status</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
            {[
              { name:"API Server",     ok:true, info:"Port 5000" },
              { name:"MongoDB Atlas",  ok:true, info:"Connected" },
              { name:"File Storage",   ok:true, info:"Operational" },
              { name:"Email Service",  ok:true, info:"Operational" },
            ].map((s, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 14px",
                background:"#f9fafb",
                borderRadius:12,
                border:"1px solid #f3f4f6",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Dot on={s.ok}/>
                  <span style={{ fontSize:13, color:"#374151", fontWeight:500 }}>{s.name}</span>
                </div>
                <span style={{
                  fontSize:11.5, fontWeight:600, padding:"3px 10px", borderRadius:20,
                  background: s.ok ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)",
                  color: s.ok ? "#059669" : "#dc2626",
                }}>{s.info}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop:14, padding:"12px 14px",
            background:"linear-gradient(135deg,rgba(16,185,129,.08),rgba(5,150,105,.05))",
            borderRadius:12,
            border:"1px solid rgba(16,185,129,.2)",
          }}>
            <p style={{ margin:0, fontSize:13, color:"#059669", fontWeight:600 }}>✅ All systems operational</p>
            <p style={{ margin:"3px 0 0", fontSize:11, color:"#9ca3af" }}>Last checked just now</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          5. RECENT PROPERTIES + USERS
      ═══════════════════════════════════════ */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>

        {/* Recent Properties */}
        <div style={{
          background:"#fff", borderRadius:18, padding:"24px",
          boxShadow:"0 2px 14px rgba(0,0,0,.06)",
          border:"1px solid rgba(0,0,0,.05)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>🏠 Recent Properties</h3>
            <Link to="/rkis/properties" style={{
              fontSize:12, color:"#6366f1", fontWeight:600, textDecoration:"none",
              background:"rgba(99,102,241,.08)", padding:"4px 12px", borderRadius:20,
            }}>View all →</Link>
          </div>

          {stats?.recentProperties?.length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {stats.recentProperties.map((p) => {
                const statusColor = p.status === "approved" ? { bg:"rgba(16,185,129,.1)", text:"#059669" }
                  : p.status === "pending" ? { bg:"rgba(245,158,11,.1)", text:"#d97706" }
                  : { bg:"rgba(239,68,68,.1)", text:"#dc2626" };
                return (
                  <div key={p._id} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 14px",
                    background:"#fafafa",
                    borderRadius:12,
                    border:"1px solid #f3f4f6",
                    cursor:"pointer",
                    transition:"background .15s",
                  }}>
                    <div style={{
                      width:42, height:42, borderRadius:10, flexShrink:0,
                      background:"linear-gradient(135deg,#e0e7ff,#ede9fe)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, overflow:"hidden",
                    }}>
                      {p.image
                        ? <img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}
                            onError={e=>e.target.style.display="none"} />
                        : "🏠"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13.5, fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize:11.5, color:"#9ca3af", marginTop:2 }}>📍 {p.location}</div>
                    </div>
                    <span style={{
                      fontSize:11, fontWeight:600, flexShrink:0,
                      padding:"4px 10px", borderRadius:20,
                      background: statusColor.bg, color: statusColor.text,
                    }}>
                      {p.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"36px 0", textAlign:"center" }}>
              <div style={{ fontSize:48, opacity:.2, marginBottom:10 }}>🏘️</div>
              <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>No properties yet</p>
              <Link to="/rkis/add-property" style={{ marginTop:10, fontSize:12, color:"#6366f1", fontWeight:600, textDecoration:"none" }}>
                Add first property →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div style={{
          background:"#fff", borderRadius:18, padding:"24px",
          boxShadow:"0 2px 14px rgba(0,0,0,.06)",
          border:"1px solid rgba(0,0,0,.05)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>👥 Recent Users</h3>
            <Link to="/rkis/users" style={{
              fontSize:12, color:"#8b5cf6", fontWeight:600, textDecoration:"none",
              background:"rgba(139,92,246,.08)", padding:"4px 12px", borderRadius:20,
            }}>View all →</Link>
          </div>

          {stats?.recentUsers?.length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {stats.recentUsers.map((u) => {
                const initials = (u.name || u.email || "U").slice(0, 2).toUpperCase();
                const roleStyle = u.role === "admin"
                  ? { grad:"linear-gradient(135deg,#ef4444,#be123c)", bg:"rgba(239,68,68,.1)", text:"#dc2626" }
                  : u.role === "dealer"
                  ? { grad:"linear-gradient(135deg,#8b5cf6,#6d28d9)", bg:"rgba(139,92,246,.1)", text:"#7c3aed" }
                  : { grad:"linear-gradient(135deg,#6366f1,#4f46e5)", bg:"rgba(99,102,241,.1)", text:"#4f46e5" };
                return (
                  <div key={u._id} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 14px",
                    background:"#fafafa",
                    borderRadius:12,
                    border:"1px solid #f3f4f6",
                    cursor:"pointer",
                  }}>
                    <div style={{
                      width:42, height:42, borderRadius:"50%", flexShrink:0,
                      background: roleStyle.grad,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"#fff", fontWeight:700, fontSize:14,
                      boxShadow:"0 2px 8px rgba(0,0,0,.12)",
                    }}>{initials}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13.5, fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {u.name || "Unknown"}
                      </div>
                      <div style={{ fontSize:11.5, color:"#9ca3af", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {u.email}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                      <span style={{
                        fontSize:11, fontWeight:600,
                        padding:"3px 9px", borderRadius:20,
                        background: roleStyle.bg, color: roleStyle.text,
                      }}>{u.role || "user"}</span>
                      <span style={{ fontSize:10.5, color: u.status === "active" ? "#10b981" : "#9ca3af", fontWeight:500 }}>
                        {u.status === "active" ? "● Active" : "○ Inactive"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"36px 0", textAlign:"center" }}>
              <div style={{ fontSize:48, opacity:.2, marginBottom:10 }}>👤</div>
              <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>No registered users yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          6. CATEGORY DISTRIBUTION
      ═══════════════════════════════════════ */}
      {stats?.categoryStats?.length > 0 && (
        <div style={{
          background:"#fff", borderRadius:18, padding:"24px",
          boxShadow:"0 2px 14px rgba(0,0,0,.06)",
          border:"1px solid rgba(0,0,0,.05)",
        }}>
          <h3 style={{ margin:"0 0 20px", fontSize:15, fontWeight:700, color:"#111827" }}>📊 Property Categories</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {stats.categoryStats.map((cat, i) => {
                const total = stats.totalProperties || 1;
                const pct = Math.round((cat.count / total) * 100);
                const palettes = [
                  { bar:"linear-gradient(90deg,#6366f1,#8b5cf6)", text:"#6366f1" },
                  { bar:"linear-gradient(90deg,#0ea5e9,#06b6d4)", text:"#0ea5e9" },
                  { bar:"linear-gradient(90deg,#10b981,#059669)", text:"#10b981" },
                  { bar:"linear-gradient(90deg,#f59e0b,#d97706)", text:"#f59e0b" },
                  { bar:"linear-gradient(90deg,#ec4899,#a855f7)", text:"#ec4899" },
                ];
                const p = palettes[i % palettes.length];
                return (
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:13, color:"#374151", fontWeight:600 }}>{cat._id || "Other"}</span>
                      <span style={{ fontSize:12, color: p.text, fontWeight:700 }}>{cat.count} ({pct}%)</span>
                    </div>
                    <div style={{ height:8, background:"#f3f4f6", borderRadius:999, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", borderRadius:999,
                        background: p.bar,
                        width:`${pct}%`,
                        transition:"width .8s ease",
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Donut visual */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
              <div style={{ position:"relative", width:130, height:130 }}>
                <svg viewBox="0 0 36 36" style={{ width:"100%",height:"100%",transform:"rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f3f4f6" strokeWidth="3.5"/>
                  {(() => {
                    const colors = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ec4899"];
                    let offset = 0;
                    const total = stats.totalProperties || 1;
                    return stats.categoryStats.map((c, i) => {
                      const pct = (c.count / total) * 100;
                      const el = (
                        <circle key={i} cx="18" cy="18" r="15.9"
                          fill="transparent" stroke={colors[i % colors.length]}
                          strokeWidth="3.5"
                          strokeDasharray={`${pct} ${100 - pct}`}
                          strokeDashoffset={-offset}
                          strokeLinecap="round"
                        />
                      );
                      offset += pct;
                      return el;
                    });
                  })()}
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:22, fontWeight:900, color:"#111827" }}>{stats.totalProperties}</span>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>Total</span>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
                {stats.categoryStats.map((c, i) => {
                  const colors = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ec4899"];
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#6b7280" }}>
                      <span style={{ width:10,height:10,borderRadius:"50%",background:colors[i % colors.length],display:"inline-block" }}/>
                      {c._id || "Other"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}