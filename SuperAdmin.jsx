/**
 * AetherOS — Super Admin System v4.1.0
 * ══════════════════════════════════════
 * Includes:
 *  1. useAuth()         — role-based auth hook (CEO / SuperAdmin / Viewer)
 *  2. LoginScreen       — login UI with role selector
 *  3. SuperAdminPortal  — full portal (Tenants, Billing, Security, Agents, Settings)
 *  4. withSuperAdmin()  — HOC to gate any component behind super-admin role
 *  5. RoleBadge         — inline role indicator
 *
 * HOW TO ADD SUPER ADMIN TO THE APP:
 * ─────────────────────────────────────
 * In App.jsx:
 *   import { useAuth, LoginScreen, SuperAdminPortal } from './SuperAdmin';
 *
 *   export default function App() {
 *     const { user, login, logout } = useAuth();
 *     if (!user) return <LoginScreen onLogin={login} />;
 *     ...your existing app...
 *     // Add to nav:  {user.role === 'superadmin' && <SuperAdminPortal user={user} onLogout={logout} />}
 *   }
 *
 * CREDENTIALS (change in SUPER_ADMIN_USERS below before production):
 *   CEO:        ceo@aetheros.io   / AetherCEO2025!
 *   Super Admin: admin@aetheros.io / SuperAdmin2025!
 *   Viewer:     viewer@aetheros.io / Viewer2025!
 */

import { useState, useCallback, createContext, useContext } from "react";

// ─── AUTH CONFIG ──────────────────────────────────────────────────────────────
// In production: replace with real backend auth (JWT, OAuth, Clerk, Auth0, etc.)
// These are demo credentials stored client-side for development only.

const SUPER_ADMIN_USERS = [
  {
    id: "sa-001",
    email: "admin@aetheros.io",
    password: "SuperAdmin2025!",       // ← CHANGE BEFORE PRODUCTION
    name: "Platform Admin",
    role: "superadmin",
    avatar: "🔑",
    permissions: ["read:all", "write:tenants", "write:billing", "write:settings",
                  "impersonate:tenants", "pause:agents", "export:audit"],
    createdAt: "2025-01-01",
    lastLogin: null,
    mfaEnabled: false,                 // ← Enable MFA in production
  },
  {
    id: "ceo-001",
    email: "ceo@aetheros.io",
    password: "AetherCEO2025!",        // ← CHANGE BEFORE PRODUCTION
    name: "CEO",
    role: "ceo",
    avatar: "⬡",
    permissions: ["read:all", "write:all"],
    createdAt: "2025-01-01",
    lastLogin: null,
    mfaEnabled: false,
  },
  {
    id: "view-001",
    email: "viewer@aetheros.io",
    password: "Viewer2025!",
    name: "Read-Only Viewer",
    role: "viewer",
    avatar: "👁",
    permissions: ["read:dashboard", "read:agents", "read:projects"],
    createdAt: "2025-01-01",
    lastLogin: null,
    mfaEnabled: false,
  },
];

export const ROLES = {
  superadmin: { label: "Super Admin", color: "#e55353", bg: "rgba(229,83,83,.12)", icon: "🔑" },
  ceo:        { label: "CEO",         color: "#c9a84c", bg: "rgba(201,168,76,.12)", icon: "⬡"  },
  viewer:     { label: "Viewer",      color: "#9090b0", bg: "rgba(144,144,176,.1)", icon: "👁"  },
};

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────
export function useAuth() {
  const stored = (() => {
    try {
      const s = sessionStorage.getItem("aetheros_user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();

  const [user, setUser] = useState(stored);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    // Simulate async auth (replace with real API call)
    await new Promise(r => setTimeout(r, 800));

    const found = SUPER_ADMIN_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      setError("Invalid email or password.");
      setLoading(false);
      return false;
    }

    const sessionUser = {
      ...found,
      password: undefined,          // never store password in state
      lastLogin: new Date().toISOString(),
      sessionId: `sess-${Date.now()}`,
    };

    try {
      sessionStorage.setItem("aetheros_user", JSON.stringify(sessionUser));
    } catch { /* storage unavailable */ }

    setUser(sessionUser);
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    try { sessionStorage.removeItem("aetheros_user"); } catch { /* ok */ }
    setUser(null);
    setError(null);
  }, []);

  const hasPermission = useCallback((perm) => {
    if (!user) return false;
    return user.permissions?.includes(perm) || user.permissions?.includes("write:all");
  }, [user]);

  const isSuperAdmin = user?.role === "superadmin";
  const isCEO        = user?.role === "ceo";
  const isViewer     = user?.role === "viewer";

  return { user, login, logout, error, loading, hasPermission, isSuperAdmin, isCEO, isViewer };
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const SA_STYLES = `
.sa-overlay{position:fixed;inset:0;background:rgba(8,8,16,.96);backdrop-filter:blur(8px);z-index:2000;display:flex;align-items:center;justify-content:center;}
.sa-panel{background:var(--ink-2,#0f0f1e);border:1px solid rgba(201,168,76,.25);border-radius:20px;width:96%;max-width:1100px;height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.8);}
.sa-head{padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:rgba(229,83,83,.04);}
.sa-body{display:flex;flex:1;overflow:hidden;}
.sa-sidebar{width:200px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;padding:10px 0;}
.sa-nav{display:flex;align-items:center;gap:9px;padding:9px 16px;font-family:'Syne',sans-serif;font-size:11px;font-weight:600;color:#9090b0;cursor:pointer;transition:all .15s;border-left:2px solid transparent;}
.sa-nav.active{color:#c9a84c;background:rgba(201,168,76,.07);border-left-color:#c9a84c;}
.sa-nav:hover:not(.active){color:#f0e8d5;background:rgba(255,255,255,.03);}
.sa-content{flex:1;padding:20px;overflow-y:auto;}
.sa-content::-webkit-scrollbar{width:3px;}
.sa-content::-webkit-scrollbar-thumb{background:rgba(201,168,76,.3);border-radius:2px;}
.sa-card{background:rgba(22,22,38,.8);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:16px;margin-bottom:12px;}
.sa-table{width:100%;border-collapse:collapse;font-family:'DM Mono',monospace;font-size:11px;}
.sa-table th{text-align:left;padding:7px 10px;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:#606080;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.07);}
.sa-table td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.04);color:rgba(240,232,213,.75);}
.sa-table tr:hover td{background:rgba(255,255,255,.025);}
.sa-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.sa-kpi{background:rgba(22,22,38,.8);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px;}
.sa-kpi-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;line-height:1;}
.sa-kpi-lbl{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:#606080;letter-spacing:.08em;text-transform:uppercase;margin-top:3px;}
.sa-kpi-delta{font-family:'DM Mono',monospace;font-size:10px;color:#3ecf8e;margin-top:4px;}
.sa-section-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:#f0e8d5;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.sa-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
.sa-bar-track{flex:1;height:5px;background:#252540;border-radius:3px;}
.sa-bar-fill{height:100%;border-radius:3px;transition:width .6s ease;}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(-45deg,#080810,#0d0820,#080d1a,#120820);background-size:400% 400%;animation:gradShift 15s ease infinite;padding:20px;}
.login-card{background:#0f0f1e;border:1px solid rgba(201,168,76,.2);border-radius:20px;padding:44px;width:100%;max-width:420px;box-shadow:0 40px 100px rgba(0,0,0,.7);}
.login-input{width:100%;background:#1e1e32;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px 16px;font-family:'DM Mono',monospace;font-size:13px;color:#f0e8d5;outline:none;transition:border-color .2s;font-weight:300;}
.login-input:focus{border-color:rgba(201,168,76,.4);}
.login-input::placeholder{color:#606080;}
.login-btn{width:100%;background:#c9a84c;color:#080810;border:none;border-radius:8px;padding:14px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;margin-top:8px;}
.login-btn:hover{background:#ddb96a;transform:translateY(-1px);}
.login-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner{width:16px;height:16px;border:2px solid rgba(8,8,16,.3);border-top-color:#080810;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;}
`;

// ─── ROLE BADGE ───────────────────────────────────────────────────────────────
export function RoleBadge({ role, size = "sm" }) {
  const r = ROLES[role] || ROLES.viewer;
  const pad = size === "lg" ? "5px 14px" : "2px 8px";
  const fs  = size === "lg" ? 11 : 9;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: pad, borderRadius: 20,
      background: r.bg, color: r.color,
      border: `1px solid ${r.color}40`,
      fontFamily: "Syne,sans-serif", fontSize: fs, fontWeight: 700, letterSpacing: ".06em",
    }}>
      {r.icon} {r.label}
    </span>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
export function LoginScreen({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [show,  setShow]    = useState(false);
  const [err,   setErr]     = useState(null);
  const [busy,  setBusy]    = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !pass.trim()) { setErr("Please enter email and password."); return; }
    setBusy(true); setErr(null);
    const ok = await onLogin(email.trim(), pass);
    if (!ok) { setErr("Invalid email or password. Please try again."); }
    setBusy(false);
  };

  return (
    <>
      <style>{SA_STYLES}</style>
      <div className="login-wrap">
        {/* Glow orbs */}
        <div style={{ position:"fixed", width:500, height:500, borderRadius:"50%", filter:"blur(120px)", background:"radial-gradient(circle,rgba(201,168,76,.15) 0%,transparent 70%)", top:-100, right:-100, pointerEvents:"none" }}/>
        <div style={{ position:"fixed", width:400, height:400, borderRadius:"50%", filter:"blur(100px)", background:"radial-gradient(circle,rgba(124,106,247,.12) 0%,transparent 70%)", bottom:-100, left:-100, pointerEvents:"none" }}/>

        <div className="login-card">
          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:36, fontWeight:700, color:"#c9a84c", marginBottom:6 }}>⬡ AetherOS</div>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:12, color:"#9090b0", fontWeight:300 }}>Autonomous AI Platform</div>
          </div>

          {/* Form */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, color:"#9090b0", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Email</div>
              <input
                className="login-input"
                type="email"
                placeholder="your@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                autoComplete="email"
              />
            </div>
            <div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, color:"#9090b0", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6, display:"flex", justifyContent:"space-between" }}>
                Password
                <span style={{ cursor:"pointer", color:"#c9a84c", fontWeight:600 }} onClick={() => setShow(p => !p)}>{show ? "Hide" : "Show"}</span>
              </div>
              <input
                className="login-input"
                type={show ? "text" : "password"}
                placeholder="••••••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                autoComplete="current-password"
              />
            </div>

            {err && (
              <div style={{ padding:"10px 14px", background:"rgba(229,83,83,.1)", border:"1px solid rgba(229,83,83,.3)", borderRadius:8, fontFamily:"DM Mono,monospace", fontSize:12, color:"#e55353" }}>
                ⚠ {err}
              </div>
            )}

            <button className="login-btn" onClick={submit} disabled={busy}>
              {busy ? <><span className="spinner"/> Authenticating…</> : "Sign In →"}
            </button>
          </div>

          {/* Demo credentials hint */}
          <div style={{ marginTop:24, padding:"12px 16px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:8 }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, color:"#606080", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Demo Accounts</div>
            {[
              { role:"superadmin", email:"admin@aetheros.io",  pass:"SuperAdmin2025!" },
              { role:"ceo",        email:"ceo@aetheros.io",    pass:"AetherCEO2025!"  },
              { role:"viewer",     email:"viewer@aetheros.io", pass:"Viewer2025!"      },
            ].map(d => (
              <div key={d.role} onClick={() => { setEmail(d.email); setPass(d.pass); }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <RoleBadge role={d.role} />
                <span style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", fontWeight:300 }}>{d.email}</span>
              </div>
            ))}
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#606080", marginTop:6, fontWeight:300 }}>Click any row to auto-fill credentials</div>
          </div>

          <div style={{ textAlign:"center", marginTop:20, fontFamily:"DM Mono,monospace", fontSize:10, color:"#606080", fontWeight:300 }}>
            🔒 Session-scoped · TLS 1.3 · AIO Audited
          </div>
        </div>
      </div>
    </>
  );
}

// ─── TENANT DATA ──────────────────────────────────────────────────────────────
const DEMO_TENANTS = [
  { id:"t1", name:"Quantum Ventures", plan:"enterprise", agents:10, mrr:2400, health:98, status:"active", since:"Jan 2025", agents_running:8  },
  { id:"t2", name:"Apex Systems",     plan:"pro",        agents:7,  mrr:490,  health:92, status:"active", since:"Feb 2025", agents_running:5  },
  { id:"t3", name:"DataWave Inc",     plan:"pro",        agents:8,  mrr:490,  health:85, status:"active", since:"Feb 2025", agents_running:6  },
  { id:"t4", name:"NovaSec",          plan:"enterprise", agents:10, mrr:2400, health:99, status:"active", since:"Jan 2025", agents_running:10 },
  { id:"t5", name:"LaunchForge",      plan:"starter",    agents:3,  mrr:99,   health:71, status:"trial",  since:"Mar 2025", agents_running:2  },
  { id:"t6", name:"CreatorStack",     plan:"pro",        agents:6,  mrr:490,  health:88, status:"active", since:"Feb 2025", agents_running:4  },
  { id:"t7", name:"PixelRoute",       plan:"starter",    agents:3,  mrr:99,   health:60, status:"trial",  since:"Mar 2025", agents_running:1  },
];

// ─── SUPER ADMIN PORTAL ───────────────────────────────────────────────────────
export function SuperAdminPortal({ user, onLogout, onClose }) {
  const [tab, setTab]     = useState("overview");
  const [tenants, setTenants] = useState(DEMO_TENANTS);
  const [impersonating, setImpersonating] = useState(null);
  const [confirm, setConfirm] = useState(null);   // {type, tenant}

  const totalMRR   = tenants.reduce((a, t) => a + t.mrr, 0);
  const activeCount= tenants.filter(t => t.status === "active").length;
  const totalAgents= tenants.reduce((a, t) => a + t.agents_running, 0);

  const planColor  = p => p === "enterprise" ? "#c9a84c" : p === "pro" ? "#7c6af7" : "#40b3e0";
  const healthColor= h => h >= 90 ? "#3ecf8e" : h >= 75 ? "#f5a623" : "#e55353";
  const statusDot  = s => <span style={{ width:6, height:6, borderRadius:"50%", background: s === "active" ? "#3ecf8e" : s === "trial" ? "#f5a623" : "#e55353", display:"inline-block", marginRight:5, verticalAlign:"middle", flexShrink:0 }}/>;

  const upgradeTenant = (id) => {
    setTenants(p => p.map(t => {
      if (t.id !== id) return t;
      const next = t.plan === "starter" ? { plan:"pro", mrr:490 } : { plan:"enterprise", mrr:2400 };
      return { ...t, ...next };
    }));
  };

  const pauseAgents = (id) => {
    setTenants(p => p.map(t => t.id === id ? { ...t, agents_running: 0 } : t));
  };

  const TABS = [
    { id:"overview",  icon:"⬡", label:"Overview"   },
    { id:"tenants",   icon:"👥", label:"Tenants"    },
    { id:"billing",   icon:"💰", label:"Billing"    },
    { id:"security",  icon:"🛡", label:"Security"   },
    { id:"agents",    icon:"🤖", label:"Agents"     },
    { id:"audit",     icon:"📋", label:"Audit Log"  },
    { id:"settings",  icon:"⚙️", label:"Settings"   },
  ];

  return (
    <>
      <style>{SA_STYLES}</style>
      <div className="sa-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
        <div className="sa-panel" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="sa-head">
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:700, color:"#c9a84c" }}>⬡ AetherOS</div>
              <div style={{ width:1, height:20, background:"rgba(255,255,255,.1)" }}/>
              <span style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#e55353", letterSpacing:".1em" }}>SUPER ADMIN PORTAL</span>
              <RoleBadge role={user.role} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#f0e8d5" }}>{user.name}</div>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#9090b0", fontWeight:300 }}>{user.email}</div>
              </div>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(201,168,76,.15)", border:"1px solid rgba(201,168,76,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{user.avatar}</div>
              <button onClick={onLogout} style={{ background:"rgba(229,83,83,.1)", border:"1px solid rgba(229,83,83,.3)", borderRadius:6, padding:"5px 12px", fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#e55353", cursor:"pointer" }}>Sign Out</button>
              {onClose && <button onClick={onClose} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, padding:"5px 10px", fontFamily:"Syne,sans-serif", fontSize:11, color:"#9090b0", cursor:"pointer" }}>✕</button>}
            </div>
          </div>

          <div className="sa-body">
            {/* Sidebar */}
            <div className="sa-sidebar">
              {TABS.map(t => (
                <div key={t.id} className={"sa-nav" + (tab === t.id ? " active" : "")} onClick={() => setTab(t.id)}>
                  <span style={{ fontSize:14 }}>{t.icon}</span>
                  {t.label}
                </div>
              ))}
              <div style={{ flex:1 }}/>
              <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:9, color:"#606080", letterSpacing:".06em" }}>AetherOS v4.1.0</div>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#3ecf8e", fontWeight:300, marginTop:2 }}>● All systems operational</div>
              </div>
            </div>

            {/* Content */}
            <div className="sa-content">

              {/* ── OVERVIEW ── */}
              {tab === "overview" && (
                <>
                  <div className="sa-section-title">⬡ Platform Overview</div>
                  <div className="sa-kpi-row">
                    {[
                      { val: tenants.length,                  lbl:"Total Tenants",  delta:`${activeCount} active`, c:"#c9a84c" },
                      { val: `$${totalMRR.toLocaleString()}`, lbl:"Monthly MRR",    delta:"+18% MoM",              c:"#3ecf8e" },
                      { val: totalAgents,                     lbl:"Running Agents", delta:"across all tenants",    c:"#7c6af7" },
                      { val: "0",                             lbl:"Critical Events",delta:"all clear today",       c:"#3ecf8e" },
                    ].map((k, i) => (
                      <div className="sa-kpi" key={i}>
                        <div className="sa-kpi-val" style={{ color:k.c }}>{k.val}</div>
                        <div className="sa-kpi-lbl">{k.lbl}</div>
                        <div className="sa-kpi-delta">{k.delta}</div>
                      </div>
                    ))}
                  </div>

                  <div className="sa-card">
                    <div className="sa-section-title">Recent Tenant Activity</div>
                    <table className="sa-table">
                      <thead><tr><th>Tenant</th><th>Plan</th><th>MRR</th><th>Health</th><th>Status</th><th>Since</th></tr></thead>
                      <tbody>
                        {tenants.slice(0, 5).map(t => (
                          <tr key={t.id}>
                            <td style={{ color:"#f0e8d5", fontWeight:500 }}>{t.name}</td>
                            <td><span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:`${planColor(t.plan)}18`, color:planColor(t.plan), border:`1px solid ${planColor(t.plan)}35`, fontFamily:"Syne,sans-serif", fontWeight:700 }}>{t.plan}</span></td>
                            <td style={{ color:"#3ecf8e" }}>${t.mrr.toLocaleString()}</td>
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:80 }}>
                                <div style={{ flex:1, height:3, background:"#252540", borderRadius:2 }}>
                                  <div style={{ width:`${t.health}%`, height:"100%", background:healthColor(t.health), borderRadius:2 }}/>
                                </div>
                                <span style={{ fontSize:9, color:"#9090b0", width:26 }}>{t.health}%</span>
                              </div>
                            </td>
                            <td>{statusDot(t.status)}<span style={{ fontSize:10 }}>{t.status}</span></td>
                            <td style={{ color:"#606080", fontSize:10 }}>{t.since}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div className="sa-card">
                      <div className="sa-section-title">Revenue by Plan</div>
                      {[{plan:"Enterprise",c:"#c9a84c"},{plan:"Pro",c:"#7c6af7"},{plan:"Starter",c:"#40b3e0"}].map(({plan, c}) => {
                        const planMRR = tenants.filter(t => t.plan === plan.toLowerCase()).reduce((a, t) => a + t.mrr, 0);
                        const pct = totalMRR > 0 ? Math.round((planMRR / totalMRR) * 100) : 0;
                        return (
                          <div key={plan} className="sa-bar-row">
                            <div style={{ width:65, fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0" }}>{plan}</div>
                            <div className="sa-bar-track"><div className="sa-bar-fill" style={{ width:`${pct}%`, background:c }}/></div>
                            <div style={{ width:48, fontFamily:"DM Mono,monospace", fontSize:10, color:"#f0e8d5", textAlign:"right" }}>${planMRR.toLocaleString()}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="sa-card">
                      <div className="sa-section-title">Compliance Status</div>
                      {[
                        { lbl:"Anti-Injection", score:100, c:"#3ecf8e" },
                        { lbl:"PII Scanning",   score:100, c:"#3ecf8e" },
                        { lbl:"AIO Labels",     score:100, c:"#3ecf8e" },
                        { lbl:"GEO/SEO",        score:100, c:"#c9a84c" },
                        { lbl:"Audit Logging",  score:99,  c:"#3ecf8e" },
                      ].map(s => (
                        <div key={s.lbl} className="sa-bar-row">
                          <div style={{ width:90, fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0" }}>{s.lbl}</div>
                          <div className="sa-bar-track"><div className="sa-bar-fill" style={{ width:`${s.score}%`, background:s.c }}/></div>
                          <div style={{ width:30, fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, color:s.c, textAlign:"right" }}>{s.score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── TENANTS ── */}
              {tab === "tenants" && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <div className="sa-section-title" style={{ marginBottom:0 }}>👥 All Tenants ({tenants.length})</div>
                    <button style={{ background:"#c9a84c", color:"#080810", border:"none", borderRadius:6, padding:"7px 14px", fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, cursor:"pointer" }}>+ Invite Tenant</button>
                  </div>
                  <div className="sa-card" style={{ padding:0, overflow:"hidden" }}>
                    <table className="sa-table">
                      <thead><tr><th>Tenant</th><th>Plan</th><th>Agents</th><th>MRR</th><th>Health</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {tenants.map(t => (
                          <tr key={t.id}>
                            <td style={{ color:"#f0e8d5", fontWeight:500 }}>{t.name}</td>
                            <td><span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:`${planColor(t.plan)}18`, color:planColor(t.plan), border:`1px solid ${planColor(t.plan)}35`, fontFamily:"Syne,sans-serif", fontWeight:700 }}>{t.plan}</span></td>
                            <td>{t.agents_running}/{t.agents}</td>
                            <td style={{ color:"#3ecf8e" }}>${t.mrr}</td>
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                <div style={{ width:50, height:3, background:"#252540", borderRadius:2 }}>
                                  <div style={{ width:`${t.health}%`, height:"100%", background:healthColor(t.health), borderRadius:2 }}/>
                                </div>
                                <span style={{ fontSize:9, color:"#9090b0" }}>{t.health}%</span>
                              </div>
                            </td>
                            <td>{statusDot(t.status)}<span style={{ fontSize:10 }}>{t.status}</span></td>
                            <td>
                              <div style={{ display:"flex", gap:5 }}>
                                <button onClick={() => setImpersonating(t)} title="Log in as this tenant" style={{ background:"rgba(124,106,247,.12)", color:"#7c6af7", border:"1px solid rgba(124,106,247,.25)", borderRadius:5, padding:"3px 8px", fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, cursor:"pointer" }}>Log in as</button>
                                {t.plan !== "enterprise" && (
                                  <button onClick={() => upgradeTenant(t.id)} title="Upgrade plan" style={{ background:"rgba(201,168,76,.1)", color:"#c9a84c", border:"1px solid rgba(201,168,76,.25)", borderRadius:5, padding:"3px 8px", fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, cursor:"pointer" }}>Upgrade</button>
                                )}
                                <button onClick={() => setConfirm({ type:"pause", tenant:t })} title="Pause all agents" style={{ background:"rgba(229,83,83,.08)", color:"#e55353", border:"1px solid rgba(229,83,83,.2)", borderRadius:5, padding:"3px 8px", fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, cursor:"pointer" }}>Pause</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Impersonate banner */}
                  {impersonating && (
                    <div style={{ marginTop:12, padding:"12px 16px", background:"rgba(124,106,247,.1)", border:"1px solid rgba(124,106,247,.3)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <span style={{ fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:700, color:"#7c6af7" }}>🔍 Impersonating: {impersonating.name}</span>
                        <span style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", marginLeft:10, fontWeight:300 }}>Full audit trail is being recorded</span>
                      </div>
                      <button onClick={() => setImpersonating(null)} style={{ background:"transparent", border:"1px solid rgba(124,106,247,.4)", borderRadius:5, padding:"4px 10px", fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, color:"#7c6af7", cursor:"pointer" }}>Exit Impersonation</button>
                    </div>
                  )}
                </>
              )}

              {/* ── BILLING ── */}
              {tab === "billing" && (
                <>
                  <div className="sa-section-title">💰 Revenue Overview</div>
                  <div className="sa-kpi-row">
                    {[
                      { val:`$${totalMRR.toLocaleString()}`, lbl:"Monthly MRR",   delta:"+18% MoM",  c:"#3ecf8e" },
                      { val:`$${(totalMRR*12).toLocaleString()}`, lbl:"Annual Run Rate", delta:"+22% YoY",  c:"#c9a84c" },
                      { val:`$${Math.round(totalMRR/tenants.length)}`, lbl:"ARPA",     delta:"+$42 MoM",  c:"#7c6af7" },
                      { val:"0.8%",                          lbl:"Churn Rate",   delta:"-0.3% MoM", c:"#3ecf8e" },
                    ].map((k, i) => (
                      <div className="sa-kpi" key={i}>
                        <div className="sa-kpi-val" style={{ color:k.c }}>{k.val}</div>
                        <div className="sa-kpi-lbl">{k.lbl}</div>
                        <div className="sa-kpi-delta">{k.delta}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sa-card">
                    <div className="sa-section-title">Billing by Tenant</div>
                    <table className="sa-table">
                      <thead><tr><th>Tenant</th><th>Plan</th><th>MRR</th><th>Next Bill</th><th>Status</th></tr></thead>
                      <tbody>
                        {tenants.map(t => (
                          <tr key={t.id}>
                            <td style={{ color:"#f0e8d5", fontWeight:500 }}>{t.name}</td>
                            <td><span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:`${planColor(t.plan)}18`, color:planColor(t.plan), border:`1px solid ${planColor(t.plan)}35`, fontFamily:"Syne,sans-serif", fontWeight:700 }}>{t.plan}</span></td>
                            <td style={{ color:"#3ecf8e" }}>${t.mrr.toLocaleString()}/mo</td>
                            <td style={{ color:"#9090b0", fontSize:10 }}>Apr 1, 2025</td>
                            <td>{statusDot(t.status)}<span style={{ fontSize:10 }}>{t.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ── SECURITY ── */}
              {tab === "security" && (
                <>
                  <div className="sa-section-title">🛡 Cross-Tenant Security Events</div>
                  <div style={{ marginBottom:12, padding:"10px 14px", background:"rgba(62,207,142,.06)", border:"1px solid rgba(62,207,142,.2)", borderRadius:8, fontFamily:"DM Mono,monospace", fontSize:11, color:"#3ecf8e" }}>
                    ✓ Anti-injection layer active on all {tenants.length} tenants · 0 critical events today
                  </div>
                  {[
                    { tenant:"LaunchForge",   type:"INJECTION_BLOCKED", detail:"Instruction override attempt in AI Chat", risk:"0.72", ts:"2m ago",  sev:"HIGH"   },
                    { tenant:"DataWave Inc",  type:"RATE_LIMIT",        detail:"Exceeded 8 messages/min threshold",       risk:"0.40", ts:"14m ago", sev:"MEDIUM" },
                    { tenant:"Apex Systems",  type:"PII_DETECTED",      detail:"Email address in AI response → redacted", risk:"0.30", ts:"1h ago",  sev:"LOW"    },
                    { tenant:"PixelRoute",    type:"INJECTION_BLOCKED", detail:"Base64 encoded payload detected",         risk:"0.65", ts:"2h ago",  sev:"HIGH"   },
                    { tenant:"CreatorStack",  type:"INPUT_TRUNCATED",   detail:"Message truncated at 1200 char limit",    risk:"0.10", ts:"3h ago",  sev:"INFO"   },
                  ].map((e, i) => {
                    const sc = { HIGH:"#f5a623", MEDIUM:"#40b3e0", LOW:"#3ecf8e", INFO:"#9090b0" };
                    return (
                      <div key={i} style={{ display:"flex", gap:10, padding:"9px 12px", background:"rgba(22,22,38,.8)", borderRadius:8, marginBottom:6, border:"1px solid rgba(255,255,255,.07)", alignItems:"flex-start" }}>
                        <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:`${sc[e.sev]}18`, color:sc[e.sev], border:`1px solid ${sc[e.sev]}35`, fontFamily:"Syne,sans-serif", fontWeight:700, flexShrink:0, marginTop:1 }}>{e.sev}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, color:"#f0e8d5" }}>
                            {e.type} <span style={{ color:"#606080", fontWeight:400 }}>· {e.tenant}</span>
                          </div>
                          <div style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", marginTop:2 }}>{e.detail}</div>
                        </div>
                        <div style={{ flexShrink:0, textAlign:"right" }}>
                          <div style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#606080" }}>{e.ts}</div>
                          <div style={{ fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, color:sc[e.sev], marginTop:2 }}>risk {e.risk}</div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── AGENTS ── */}
              {tab === "agents" && (
                <>
                  <div className="sa-section-title">🤖 Global Agent Oversight — {totalAgents} running</div>
                  {[
                    { tenant:"Quantum Ventures", name:"Architect Agent", task:"Microservices schema — Nova v2",   status:"busy",   model:"Claude Sonnet 4" },
                    { tenant:"Apex Systems",     name:"Dev Alpha",       task:"FastAPI auth endpoints",           status:"active", model:"GPT-4o"          },
                    { tenant:"DataWave Inc",     name:"QA Agent",        task:"Adversarial test suite run",       status:"active", model:"Claude Sonnet 4" },
                    { tenant:"NovaSec",          name:"Security Agent",  task:"CVE cross-reference scan",         status:"idle",   model:"DeepSeek-R1"     },
                    { tenant:"CreatorStack",     name:"BI Agent",        task:"Q3 revenue report generation",     status:"active", model:"Gemini 1.5 Pro"  },
                    { tenant:"LaunchForge",      name:"Dev Alpha",       task:"MVP landing page — first sprint",  status:"busy",   model:"Claude Sonnet 4" },
                  ].map((a, i) => {
                    const sc = { busy:"#f5a623", active:"#40b3e0", idle:"#3ecf8e" };
                    return (
                      <div key={i} style={{ display:"flex", gap:10, padding:"10px 14px", background:"rgba(22,22,38,.8)", borderRadius:8, marginBottom:6, border:"1px solid rgba(255,255,255,.07)", alignItems:"center" }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:sc[a.status], flexShrink:0 }}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#f0e8d5" }}>{a.name} <span style={{ color:"#606080", fontWeight:400 }}>· {a.tenant}</span></div>
                          <div style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.task}</div>
                        </div>
                        <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:"rgba(201,168,76,.1)", color:"#c9a84c", border:"1px solid rgba(201,168,76,.25)", fontFamily:"Syne,sans-serif", fontWeight:700, flexShrink:0 }}>{a.model}</span>
                        <button style={{ background:"rgba(229,83,83,.08)", color:"#e55353", border:"1px solid rgba(229,83,83,.2)", borderRadius:5, padding:"3px 8px", fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, cursor:"pointer", flexShrink:0 }}>Force Stop</button>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── AUDIT LOG ── */}
              {tab === "audit" && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <div className="sa-section-title" style={{ marginBottom:0 }}>📋 Platform Audit Log</div>
                    <button style={{ background:"rgba(201,168,76,.1)", color:"#c9a84c", border:"1px solid rgba(201,168,76,.25)", borderRadius:6, padding:"5px 12px", fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, cursor:"pointer" }}>↓ Export CSV</button>
                  </div>
                  {[
                    { actor:"admin@aetheros.io", action:"IMPERSONATE_TENANT",    target:"Quantum Ventures", ts:"just now",  risk:"medium" },
                    { actor:"admin@aetheros.io", action:"UPGRADE_PLAN",          target:"DataWave Inc → Pro",ts:"5m ago",   risk:"low"    },
                    { actor:"admin@aetheros.io", action:"FORCE_PAUSE_AGENTS",    target:"PixelRoute",        ts:"1h ago",   risk:"high"   },
                    { actor:"ceo@aetheros.io",   action:"APPROVE_SCHEMA_CHANGE", target:"Project Nova",      ts:"2h ago",   risk:"low"    },
                    { actor:"admin@aetheros.io", action:"EXPORT_AUDIT_LOG",      target:"Security Events",   ts:"3h ago",   risk:"low"    },
                    { actor:"admin@aetheros.io", action:"LOGIN",                 target:"Super Admin Portal","ts":"3h ago", risk:"low"    },
                  ].map((e, i) => {
                    const rc = { high:"#f5a623", medium:"#40b3e0", low:"#3ecf8e" };
                    return (
                      <div key={i} style={{ display:"flex", gap:10, padding:"9px 12px", background:"rgba(22,22,38,.8)", borderRadius:7, marginBottom:5, border:"1px solid rgba(255,255,255,.06)", alignItems:"center" }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:rc[e.risk], flexShrink:0 }}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <span style={{ fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, color:"#c9a84c" }}>{e.action}</span>
                          <span style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", marginLeft:8, fontWeight:300 }}>{e.target}</span>
                        </div>
                        <div style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#606080", flexShrink:0 }}>by {e.actor} · {e.ts}</div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── SETTINGS ── */}
              {tab === "settings" && (
                <>
                  <div className="sa-section-title">⚙️ Platform Settings</div>

                  {/* User Management */}
                  <div className="sa-card">
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#c9a84c", marginBottom:12, letterSpacing:".08em", textTransform:"uppercase" }}>Admin User Management</div>
                    {SUPER_ADMIN_USERS.map(u => (
                      <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                        <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(201,168,76,.12)", border:"1px solid rgba(201,168,76,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{u.avatar}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#f0e8d5" }}>{u.name}</div>
                          <div style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", fontWeight:300 }}>{u.email}</div>
                        </div>
                        <RoleBadge role={u.role} />
                        <button style={{ background:"rgba(229,83,83,.08)", color:"#e55353", border:"1px solid rgba(229,83,83,.2)", borderRadius:5, padding:"3px 8px", fontFamily:"Syne,sans-serif", fontSize:9, fontWeight:700, cursor:"pointer" }}>Edit</button>
                      </div>
                    ))}
                    <button style={{ marginTop:12, background:"rgba(201,168,76,.1)", color:"#c9a84c", border:"1px solid rgba(201,168,76,.25)", borderRadius:6, padding:"7px 14px", fontFamily:"Syne,sans-serif", fontSize:10, fontWeight:700, cursor:"pointer" }}>+ Add Admin User</button>
                  </div>

                  {/* Feature Flags */}
                  <div className="sa-card">
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#c9a84c", marginBottom:12, letterSpacing:".08em", textTransform:"uppercase" }}>Platform Feature Flags</div>
                    {[
                      { lbl:"Anti-Injection Layer",   desc:"Block prompt injection attempts",      on:true  },
                      { lbl:"PII Auto-Redact",         desc:"Scan and redact PII in AI outputs",   on:true  },
                      { lbl:"AIO Compliance Labels",   desc:"Show model/confidence on AI replies", on:true  },
                      { lbl:"GEO Crawler Access",      desc:"Allow AI search engine crawlers",     on:true  },
                      { lbl:"Tenant Impersonation",    desc:"Allow super admins to impersonate",   on:true  },
                      { lbl:"Self-Improvement Mode",   desc:"Agents optimise their own prompts",   on:false },
                    ].map((f, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:"#f0e8d5" }}>{f.lbl}</div>
                          <div style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#9090b0", fontWeight:300 }}>{f.desc}</div>
                        </div>
                        <div style={{ width:36, height:20, borderRadius:10, background:f.on?"#c9a84c":"#252540", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0, border:`1px solid ${f.on?"#c9a84c":"rgba(255,255,255,.1)"}` }}>
                          <div style={{ width:14, height:14, borderRadius:"50%", background:f.on?"#080810":"#9090b0", position:"absolute", top:2, left:f.on?18:2, transition:"left .2s" }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Confirm dialog */}
          {confirm && (
            <div style={{ position:"absolute", inset:0, background:"rgba(8,8,16,.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, borderRadius:20 }}>
              <div style={{ background:"#0f0f1e", border:"1px solid rgba(229,83,83,.3)", borderRadius:14, padding:28, maxWidth:360, textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"#f0e8d5", marginBottom:8 }}>
                  {confirm.type === "pause" ? "Pause All Agents?" : "Confirm Action"}
                </div>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:12, color:"#9090b0", fontWeight:300, marginBottom:20 }}>
                  This will force-stop all {confirm.tenant.agents_running} running agents for <strong style={{ color:"#f0e8d5" }}>{confirm.tenant.name}</strong>. This is logged in the audit trail.
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => setConfirm(null)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.15)", borderRadius:6, padding:"8px 18px", fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:700, color:"#9090b0", cursor:"pointer" }}>Cancel</button>
                  <button onClick={() => { pauseAgents(confirm.tenant.id); setConfirm(null); }} style={{ background:"rgba(229,83,83,.15)", border:"1px solid rgba(229,83,83,.4)", borderRadius:6, padding:"8px 18px", fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:700, color:"#e55353", cursor:"pointer" }}>Confirm Pause</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── HOC: withSuperAdmin ──────────────────────────────────────────────────────
// Wraps any component and blocks access unless user has the required role.
// Usage: export default withSuperAdmin(MyAdminPage, 'superadmin');
export function withSuperAdmin(Component, requiredRole = "superadmin") {
  return function ProtectedComponent(props) {
    const { user } = useAuth();

    if (!user) {
      return (
        <div style={{ padding:40, textAlign:"center", fontFamily:"Syne,sans-serif", color:"#9090b0" }}>
          🔒 Not authenticated
        </div>
      );
    }

    const roleOrder = { viewer:0, ceo:1, superadmin:2 };
    const hasAccess = (roleOrder[user.role] || 0) >= (roleOrder[requiredRole] || 0);

    if (!hasAccess) {
      return (
        <div style={{ padding:40, textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🔑</div>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"#f0e8d5", marginBottom:6 }}>Access Denied</div>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:12, color:"#9090b0", fontWeight:300 }}>
            This area requires <RoleBadge role={requiredRole} /> access.<br/>Your current role: <RoleBadge role={user.role} />
          </div>
        </div>
      );
    }

    return <Component {...props} user={user} />;
  };
}
