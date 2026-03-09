import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

/* ────────────── NAV CONFIG ────────────── */
const adminNav = [
  {
    section: "OVERVIEW",
    items: [
      { path: "/rkis",            label: "Dashboard",         exact: true,  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { path: "/rkis/users",      label: "Manage Users",      exact: false, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
      { path: "/rkis/properties", label: "Properties",        exact: false, icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
      { path: "/rkis/add-property", label: "Add Property",   exact: false, icon: "M12 4v16m8-8H4" },
      { path: "/rkis/reviews",      label: "Manage Reviews",  exact: false, icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
      { path: "/rkis/visits",       label: "Visit Bookings",  exact: false, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { path: "/rkis/wishlists",    label: "User Wishlists",  exact: false, icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    ],
  },
  {
    section: "SITE PAGES",
    items: [
      { path: "/",              label: "Home Page",          ext: true, icon: "M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" },
      { path: "/properties",   label: "Property Listing",   ext: true, icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
      { path: "/property/1",   label: "Property Detail",    ext: true, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { path: "/agent-profile", label: "Agent Profile",     ext: true, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
      { path: "/dealer/add",   label: "Add/Edit Property",  ext: true, icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    ],
  },
];

function SvgIcon({ d, size = "5" }) {
  return (
    <svg className={`w-${size} h-${size} flex-shrink-0`} fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const pageTitle = (() => {
    const p = location.pathname;
    if (p === "/rkis")                 return "Dashboard";
    if (p.includes("users"))           return "Manage Users";
    if (p.includes("add-property"))    return "Add Property";
    if (p.includes("edit-property"))   return "Edit Property";
    if (p.includes("reviews"))         return "Manage Reviews";
    if (p.includes("visits"))          return "Visit Bookings";
    if (p.includes("wishlists"))        return "User Wishlists";
    if (p.includes("properties"))      return "Manage Properties";
    return "Admin";
  })();

  return (
    /* Root — full viewport, no scroll on outer container */
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside style={{
        width: collapsed ? 72 : 240,
        minWidth: collapsed ? 72 : 240,
        transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,#1e1b4b 0%,#312e81 40%,#4338ca 100%)",
        boxShadow: "4px 0 24px rgba(67,56,202,.35)",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}>

        {/* subtle pattern overlay */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:"radial-gradient(circle at 80% 20%,rgba(165,180,252,.12) 0%,transparent 60%)",
          pointerEvents:"none"
        }}/>

        {/* ── Logo ── */}
        <div style={{
          display:"flex", alignItems:"center", gap:12,
          padding: collapsed ? "20px 16px" : "20px 20px",
          borderBottom:"1px solid rgba(255,255,255,.1)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width:40, height:40, flexShrink:0,
            background:"linear-gradient(135deg,#818cf8,#c084fc)",
            borderRadius:12,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 16px rgba(129,140,248,.5)",
            fontSize:20,
          }}>🏠</div>
          {!collapsed && (
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15, lineHeight:1.2 }}>RealEstate</div>
              <div style={{ color:"#a5b4fc", fontSize:11, fontWeight:500 }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav style={{ flex:1, overflowY:"auto", padding:"12px 10px" }}>
          {adminNav.map((group) => (
            <div key={group.section} style={{ marginBottom:8 }}>
              {!collapsed && (
                <div style={{
                  color:"rgba(165,180,252,.6)",
                  fontSize:10, fontWeight:700,
                  letterSpacing:"0.1em",
                  padding:"8px 10px 4px",
                }}>
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : ""}
                    style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding: collapsed ? "10px 0" : "9px 12px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius:10,
                      marginBottom:2,
                      textDecoration:"none",
                      transition:"all .18s",
                      background: active
                        ? "rgba(255,255,255,.18)"
                        : "transparent",
                      color: active ? "#fff" : "rgba(199,210,254,.75)",
                      fontWeight: active ? 600 : 500,
                      fontSize:13.5,
                      boxShadow: active ? "0 2px 10px rgba(0,0,0,.2)" : "none",
                      backdropFilter: active ? "blur(4px)" : "none",
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255,255,255,.1)";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(199,210,254,.75)";
                      }
                    }}
                  >
                    {/* Active indicator bar */}
                    {active && !collapsed && (
                      <div style={{
                        position:"absolute", left:0, width:3, height:28,
                        background:"linear-gradient(#a5b4fc,#818cf8)",
                        borderRadius:"0 4px 4px 0",
                      }}/>
                    )}
                    <SvgIcon d={item.icon} />
                    {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
                    {!collapsed && item.ext && (
                      <svg style={{ width:12,height:12,opacity:.4,flexShrink:0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Collapse btn ── */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,.1)" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              padding:"9px 0", borderRadius:10, border:"none", cursor:"pointer",
              background:"rgba(255,255,255,.08)",
              color:"rgba(199,210,254,.8)",
              fontSize:12, fontWeight:500, transition:"all .18s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.15)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(199,210,254,.8)";}}
          >
            <svg style={{ width:16,height:16,transform:collapsed?"rotate(180deg)":"rotate(0deg)",transition:"transform .3s" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN AREA ══════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* ── Top Header (ADMIN'S OWN — NOT public navbar) ── */}
        <header style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 24px",
          height:60,
          background:"#fff",
          borderBottom:"1px solid #e5e7eb",
          flexShrink:0,
          boxShadow:"0 1px 8px rgba(0,0,0,.06)",
        }}>
          {/* Left — breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              width:32,height:32,
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              borderRadius:8,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:15, boxShadow:"0 2px 8px rgba(99,102,241,.3)",
            }}>🏠</div>
            <span style={{ color:"#9ca3af", fontSize:13 }}>Admin</span>
            <svg style={{ width:14,height:14,color:"#d1d5db" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
            <span style={{ color:"#111827", fontWeight:600, fontSize:14 }}>{pageTitle}</span>
          </div>

          {/* Right — controls */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Notification */}
            <div style={{ position:"relative" }}>
              <button style={{
                width:36,height:36,borderRadius:10,border:"1px solid #e5e7eb",
                background:"#f9fafb",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#6b7280",
              }}>
                <svg style={{ width:17,height:17 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </button>
              <span style={{
                position:"absolute",top:6,right:6,
                width:8,height:8,
                background:"#6366f1",borderRadius:"50%",
                border:"2px solid #fff",
              }}/>
            </div>

            {/* Admin pill */}
            <div style={{
              display:"flex",alignItems:"center",gap:9,
              padding:"6px 14px 6px 6px",
              borderRadius:24, border:"1px solid #e5e7eb",
              background:"#f9fafb", cursor:"pointer",
            }}>
              <div style={{
                width:28,height:28,
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#fff",fontWeight:700,fontSize:13,
              }}>A</div>
              <div>
                <div style={{ color:"#111827",fontSize:12,fontWeight:600,lineHeight:1.2 }}>Admin</div>
                <div style={{ color:"#10b981",fontSize:10,display:"flex",alignItems:"center",gap:3 }}>
                  <span style={{ width:6,height:6,background:"#10b981",borderRadius:"50%",display:"inline-block" }}/>
                  Online
                </div>
              </div>
            </div>

            {/* Back to site */}
            <Link to="/" style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"8px 16px",
              borderRadius:10,
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              color:"#fff",fontSize:12,fontWeight:600,
              textDecoration:"none",
              boxShadow:"0 2px 8px rgba(99,102,241,.35)",
              transition:"all .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >
              ← Back to Site
            </Link>
          </div>
        </header>

        {/* ── Scrollable Page Content ── */}
        <main style={{
          flex:1,
          overflowY:"auto",
          background:"linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#f0fdf4 100%)",
          padding:"28px",
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
