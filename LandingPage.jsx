import { useState, useEffect, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
:root{
  --ink:#080810;--ink-2:#0f0f1e;--ink-3:#161626;--ink-4:#1e1e32;--ink-5:#252540;
  --gold:#c9a84c;--gold-2:#ddb96a;--gold-dim:rgba(201,168,76,.35);--gold-glow:rgba(201,168,76,.1);
  --cream:#f0e8d5;--cream-dim:rgba(240,232,213,.75);--silver:#9090b0;--silver-2:#606080;
  --border:rgba(255,255,255,.07);--border-gold:rgba(201,168,76,.2);
  --success:#3ecf8e;--warn:#f5a623;--danger:#e55353;--accent:#7c6af7;--blue:#40b3e0;
  --r:14px;--r-sm:8px;--r-lg:20px;
}
body{background:var(--ink);color:var(--cream);font-family:'DM Mono',monospace;overflow-x:hidden;line-height:1.6;}
h1,h2,h3,h4{font-family:'Cormorant Garamond',serif;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--ink-2);}
::-webkit-scrollbar-thumb{background:var(--gold-dim);border-radius:2px;}
::selection{background:rgba(201,168,76,.25);color:var(--cream);}
.grad{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-2) 50%,#e8c878 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.section{padding:120px 0;position:relative;overflow:hidden;}
.section-sm{padding:72px 0;}
.container{max-width:1200px;margin:0 auto;padding:0 40px;}
.container-sm{max-width:900px;margin:0 auto;padding:0 40px;}
.section-label{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.18em;color:var(--gold);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.section-label::before{content:'';display:block;width:28px;height:1px;background:var(--gold);}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:var(--r-sm);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .2s;border:none;text-decoration:none;}
.btn-primary{background:var(--gold);color:var(--ink);}
.btn-primary:hover{background:var(--gold-2);transform:translateY(-1px);box-shadow:0 8px 32px rgba(201,168,76,.3);}
.btn-ghost{background:transparent;color:var(--cream);border:1px solid var(--border-gold);}
.btn-ghost:hover{background:var(--gold-glow);border-color:var(--gold);color:var(--gold);}
.btn-outline{background:transparent;color:var(--gold);border:1px solid var(--gold-dim);}
.btn-outline:hover{background:var(--gold-glow);border-color:var(--gold);}
.btn-lg{padding:16px 36px;font-size:14px;}
.btn-sm{padding:8px 14px;font-size:11px;}
.card{background:var(--ink-3);border:1px solid var(--border);border-radius:var(--r);transition:all .25s;}
.card:hover{border-color:var(--border-gold);box-shadow:0 0 60px rgba(201,168,76,.08);}
.card-gold{background:linear-gradient(135deg,rgba(201,168,76,.08) 0%,rgba(201,168,76,.03) 100%);border:1px solid var(--border-gold);}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:.06em;}
.badge-gold{background:rgba(201,168,76,.12);color:var(--gold);border:1px solid rgba(201,168,76,.25);}
.badge-green{background:rgba(62,207,142,.1);color:var(--success);border:1px solid rgba(62,207,142,.25);}
.badge-blue{background:rgba(64,179,224,.1);color:var(--blue);border:1px solid rgba(64,179,224,.25);}
.badge-accent{background:rgba(124,106,247,.12);color:var(--accent);border:1px solid rgba(124,106,247,.3);}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border-gold),transparent);}
.orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none;}
.orb-gold{background:radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 70%);}
.orb-accent{background:radial-gradient(circle,rgba(124,106,247,.14) 0%,transparent 70%);}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(.96);}to{opacity:1;transform:scale(1);}}
@keyframes gradShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
@keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
nav{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all .3s;}
nav.scrolled{background:rgba(8,8,16,.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 40px;height:70px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--gold);text-decoration:none;display:flex;align-items:center;gap:10px;}
.nav-links{display:flex;align-items:center;gap:32px;}
.nav-link{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--silver);text-decoration:none;transition:color .2s;}
.nav-link:hover{color:var(--cream);}
.hero{min-height:100vh;display:flex;align-items:center;padding-top:70px;background:linear-gradient(-45deg,#080810,#0d0820,#080d1a,#120820);background-size:400% 400%;animation:gradShift 15s ease infinite;}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,.08);border:1px solid var(--border-gold);border-radius:20px;padding:5px 16px;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:.08em;margin-bottom:28px;}
.stat-val{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:700;color:var(--gold);line-height:1;}
.stat-label{font-family:'Syne',sans-serif;font-size:11px;font-weight:600;letter-spacing:.1em;color:var(--silver);text-transform:uppercase;margin-top:8px;}
.stat-delta{font-family:'DM Mono',monospace;font-size:12px;color:var(--success);margin-top:6px;}
.plan-card{padding:36px;position:relative;overflow:hidden;}
.plan-card.popular{border-color:var(--gold-dim);}
.plan-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:12px;}
.plan-price{font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:var(--cream);line-height:1;}
.plan-price sup{font-size:24px;vertical-align:super;}
.plan-price sub{font-family:'DM Mono',monospace;font-size:14px;color:var(--silver);font-weight:300;}
.plan-desc{font-family:'DM Mono',monospace;font-size:12px;color:var(--silver);margin:12px 0 24px;font-weight:300;line-height:1.6;}
.plan-feature{display:flex;align-items:flex-start;gap:10px;padding:7px 0;font-family:'DM Mono',monospace;font-size:12px;color:var(--cream-dim);font-weight:300;}
.testi-card{padding:32px;}
.testi-stars{color:var(--gold);font-size:14px;margin-bottom:14px;letter-spacing:2px;}
.testi-quote{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--cream-dim);line-height:1.6;margin-bottom:20px;}
.faq-item{border-bottom:1px solid var(--border);}
.faq-q{display:flex;justify-content:space-between;align-items:center;padding:20px 0;cursor:pointer;font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:var(--cream);}
.faq-q:hover{color:var(--gold);}
.faq-a{font-family:'DM Mono',monospace;font-size:13px;color:var(--silver);line-height:1.7;padding-bottom:20px;font-weight:300;}
.cta-box{background:linear-gradient(135deg,rgba(201,168,76,.1) 0%,rgba(124,106,247,.08) 100%);border:1px solid var(--border-gold);border-radius:24px;padding:80px 60px;text-align:center;position:relative;overflow:hidden;}
footer{background:var(--ink-2);border-top:1px solid var(--border);padding:64px 0 40px;}
.footer-link{display:block;font-family:'DM Mono',monospace;font-size:12px;color:var(--silver);text-decoration:none;padding:4px 0;transition:color .15s;font-weight:300;}
.footer-link:hover{color:var(--gold);}
.footer-bottom{border-top:1px solid var(--border);margin-top:48px;padding-top:24px;display:flex;align-items:center;justify-content:space-between;font-family:'DM Mono',monospace;font-size:11px;color:var(--silver-2);font-weight:300;}
.input-field{background:var(--ink-4);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 16px;font-family:'DM Mono',monospace;font-size:13px;color:var(--cream);outline:none;transition:border-color .2s;font-weight:300;}
.input-field:focus{border-color:var(--gold-dim);}
.input-field::placeholder{color:var(--silver-2);}
.dot-live{width:7px;height:7px;border-radius:50%;background:var(--success);animation:pulse 2s ease-in-out infinite;flex-shrink:0;display:inline-block;}
.mockup{background:var(--ink-3);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.8);}
.mockup-bar{background:var(--ink-4);padding:12px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);}
.mockup-dot{width:10px;height:10px;border-radius:50%;}
.mockup-url{flex:1;background:var(--ink-5);border-radius:4px;padding:4px 12px;font-family:'DM Mono',monospace;font-size:10px;color:var(--silver);max-width:240px;margin:0 auto;}
.admin-sidebar{width:190px;flex-shrink:0;background:var(--ink-2);border-right:1px solid var(--border);display:flex;flex-direction:column;}
.admin-nav-item{display:flex;align-items:center;gap:9px;padding:9px 14px;font-family:'Syne',sans-serif;font-size:11px;font-weight:600;color:var(--silver);cursor:pointer;transition:all .15s;border-left:2px solid transparent;}
.admin-nav-item.active{color:var(--gold);background:rgba(201,168,76,.06);border-left-color:var(--gold);}
.admin-nav-item:hover:not(.active){color:var(--cream);background:rgba(255,255,255,.03);}
.admin-kpi{padding:12px;background:var(--ink-3);border:1px solid var(--border);border-radius:8px;}
.admin-kpi-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--cream);}
.admin-kpi-lbl{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:var(--silver);letter-spacing:.08em;text-transform:uppercase;margin-top:2px;}
.admin-table{width:100%;border-collapse:collapse;font-family:'DM Mono',monospace;font-size:11px;}
.admin-table th{text-align:left;padding:6px 8px;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:var(--silver-2);letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--border);}
.admin-table td{padding:7px 8px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--cream-dim);}
.admin-table tr:hover td{background:rgba(255,255,255,.02);}
@media(max-width:900px){.grid-2,.grid-3,.grid-4{grid-template-columns:1fr;}.container{padding:0 20px;}.nav-links{display:none;}.section{padding:80px 0;}}
`;

const PLANS = [
  {
    name:"Starter", price:99, desc:"Perfect for solo founders launching their first AI-powered product.", badge:null, highlight:false,
    features:[
      {t:"3 AI Agents",yes:true},{t:"2 Active Projects",yes:true},{t:"10GB RAG Memory",yes:true},
      {t:"Basic Analytics",yes:true},{t:"Email Support",yes:true},{t:"Custom Integrations",yes:false},
      {t:"Multi-tenant Clients",yes:false},{t:"Super Admin Portal",yes:false},{t:"White-label",yes:false},{t:"SLA Guarantee",yes:false},
    ],
  },
  {
    name:"Pro", price:490, desc:"For teams running multiple autonomous pipelines simultaneously.", badge:"Most Popular", highlight:true,
    features:[
      {t:"10 AI Agents",yes:true},{t:"Unlimited Projects",yes:true},{t:"100GB RAG Memory",yes:true},
      {t:"Full BI Analytics + CSV Export",yes:true},{t:"Priority Support",yes:true},{t:"50 Custom Integrations",yes:true},
      {t:"25 SaaS Clients",yes:true},{t:"99.9% SLA Guarantee",yes:true},{t:"Super Admin Portal",yes:false},{t:"White-label",yes:false},
    ],
  },
  {
    name:"Enterprise", price:null, desc:"Unlimited scale for AI-first companies managing hundreds of autonomous workstreams.", badge:null, highlight:false,
    features:[
      {t:"Unlimited AI Agents",yes:true},{t:"Unlimited Projects",yes:true},{t:"Unlimited RAG Memory",yes:true},
      {t:"Advanced BI + Predictive",yes:true},{t:"Dedicated CSM",yes:true},{t:"Unlimited Integrations",yes:true},
      {t:"Unlimited SaaS Clients",yes:true},{t:"Full Super Admin Portal",yes:true},{t:"White-label + Custom Domain",yes:true},{t:"99.99% SLA + SOC2 Type II",yes:true},
    ],
  },
];

const FEATURES = [
  {icon:"⬡",col:"rgba(201,168,76,.15)",bc:"rgba(201,168,76,.25)",title:"Autonomous Agent Workforce",desc:"Spawn, pause, orchestrate 10+ AI agents — Architect, Dev Alpha/Beta, QA, DevOps, Security, BI, Finance, UI Design, Sales. Each runs its own task queue autonomously.",tags:["Claude Sonnet","GPT-4o","DeepSeek-R1"]},
  {icon:"🚀",col:"rgba(124,106,247,.12)",bc:"rgba(124,106,247,.3)",title:"End-to-End Project Lifecycle",desc:"BRD upload to production deploy. CI/CD pipeline viewer, 8-step blue/green deploy, environment promotion, rollback — all agent-managed without interruption.",tags:["CI/CD","Blue/Green Deploy","GitHub Actions"]},
  {icon:"🛡",col:"rgba(229,83,83,.1)",bc:"rgba(229,83,83,.25)",title:"Anti-Injection Security Layer",desc:"40+ prompt injection signatures, base64/hex/homoglyph encoding detection, PII output scanning with auto-redact, rate limiting, immutable system prompt.",tags:["CIO Compliant","AIO Labels","GEO Ready"]},
  {icon:"📊",col:"rgba(64,179,224,.1)",bc:"rgba(64,179,224,.25)",title:"Full BI Analytics & Financials",desc:"7-month revenue/cost dashboards, LLM spend tracking, unit economics, 12-month forecasts, and one-click CSV export for all reports.",tags:["Revenue Tracking","CSV Export","Forecasting"]},
  {icon:"🧠",col:"rgba(62,207,142,.08)",bc:"rgba(62,207,142,.2)",title:"RAG Memory (Pinecone)",desc:"Semantic search across all projects and agent outputs. Compaction, deduplication, and vector rebuild all automated. Agents share memory cross-project.",tags:["Pinecone","Semantic Search","Vector DB"]},
  {icon:"👥",col:"rgba(245,166,35,.08)",bc:"rgba(245,166,35,.22)",title:"Multi-Tenant SaaS Clients",desc:"Onboard clients, manage plan tiers, track MRR, health scores, and upgrade paths. Full CRM for your AI-built SaaS platform.",tags:["MRR Tracking","Client Health","Plan Management"]},
];

const TESTIMONIALS = [
  {quote:"AetherOS replaced a 6-person engineering team for our MVP sprint. In 8 weeks, agents shipped 14,000 lines of production code with 94% test coverage.",name:"Rhea Kapoor",role:"CEO, Quantum Ventures",avatar:"👩‍💼"},
  {quote:"The Super Admin portal alone is worth the Enterprise plan. I manage 23 client workspaces, see every approval queue, and kill runaway agents from one screen.",name:"Marcus Chen",role:"CTO, Apex Systems",avatar:"👨‍💻"},
  {quote:"The security layer caught 3 prompt injection attempts in week one. The audit trail made our SOC2 review a breeze. Couldn't believe it was all in the platform.",name:"Priya Suresh",role:"CISO, NovaSec",avatar:"👩‍🔬"},
  {quote:"We went from idea to paying SaaS customers in 47 days. Agents built the backend, wrote tests, deployed to AWS, and even drafted the pitch deck.",name:"Leo Marten",role:"Founder, DataWave",avatar:"🧑‍🚀"},
];

const FAQS = [
  {q:"What AI models power the agents?",a:"By default, agents use Claude Sonnet 4 via Anthropic API, with GPT-4o, DeepSeek-R1, and Gemini 1.5 Pro available for specific workloads. Configure per-agent model preferences in Settings. The built-in benchmark leaderboard helps choose the best model for cost vs quality tradeoffs."},
  {q:"How does the Super Admin portal work?",a:"Super Admins get a dedicated portal with visibility into all tenant workspaces — active agents, project health, MRR, approval queues, security events, and audit logs. You can impersonate any tenant (with full audit trail), force-pause runaway agents, adjust plan limits, and manage billing across all accounts from one view."},
  {q:"Is it secure? How is prompt injection prevented?",a:"AetherOS ships with a multi-layer security system: 40+ injection pattern signatures, encoding attack detection (base64/hex/unicode homoglyphs), immutable hardened system prompt, all user input wrapped in UNTRUSTED_USER_INPUT envelopes, PII scanning with auto-redaction, rate limiting (8 msg/min), and a full security audit log. All AI responses carry AIO compliance metadata."},
  {q:"Can I attach BRDs and requirement documents?",a:"Yes — the New Project modal has a full Documents & Links tab. Upload PDFs, Word docs, wireframes, Figma links, user stories, and tech specs. The Architect Agent parses them on launch, extracts requirements, auto-generates a task backlog, and starts sprint 1 automatically. Preview the parse output before launching."},
  {q:"What does GEO and AIO compliance mean?",a:"GEO (Generative Engine Optimization) means AetherOS is structured so AI-powered search engines (Perplexity, ChatGPT Browse, Google SGE) can accurately represent it via llms.txt, semantic robots.txt, and JSON-LD schemas. AIO (AI Input/Output) compliance means every AI response is labeled with model, confidence level, data source, and compliance flags shown directly in the UI."},
  {q:"Is there a free trial?",a:"Yes — all plans include a 14-day free trial with full access. No credit card required. Enterprise trials include a dedicated onboarding call with a solutions engineer."},
];

const ADMIN_TENANTS = [
  {name:"Quantum Ventures",plan:"Enterprise",agents:10,mrr:"$2,400",health:98,status:"active"},
  {name:"Apex Systems",plan:"Pro",agents:7,mrr:"$490",health:92,status:"active"},
  {name:"DataWave Inc",plan:"Pro",agents:8,mrr:"$490",health:85,status:"active"},
  {name:"NovaSec",plan:"Enterprise",agents:10,mrr:"$2,400",health:99,status:"active"},
  {name:"LaunchForge",plan:"Starter",agents:3,mrr:"$99",health:71,status:"trial"},
  {name:"CreatorStack",plan:"Pro",agents:6,mrr:"$490",health:88,status:"active"},
];

const ADMIN_TABS = ["Overview","Tenants","Billing","Security","Agents"];

function AnimCounter({target,suffix=""}){
  const [val,setVal]=useState(0);
  const ref=useRef();
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        let s=0; const step=target/60;
        const t=setInterval(()=>{s=Math.min(s+step,target);setVal(Math.floor(s));if(s>=target)clearInterval(t);},20);
        obs.disconnect();
      }
    },{threshold:0.3});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function MiniBar({pct,color}){
  return(
    <div style={{width:"100%",height:3,background:"var(--ink-5)",borderRadius:2}}>
      <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:2}}/>
    </div>
  );
}

function StatusDot({status}){
  const c=status==="active"?"#3ecf8e":status==="trial"?"#f5a623":"#e55353";
  return <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block",marginRight:5,flexShrink:0,verticalAlign:"middle"}}/>;
}

function AdminMockup({activeTab,setActiveTab}){
  return(
    <div className="mockup" style={{height:490,display:"flex",flexDirection:"column"}}>
      <div className="mockup-bar">
        <div className="mockup-dot" style={{background:"#ff5f56"}}/>
        <div className="mockup-dot" style={{background:"#ffbd2e"}}/>
        <div className="mockup-dot" style={{background:"#27c93f"}}/>
        <div className="mockup-url">admin.aetheros.io/super</div>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div className="admin-sidebar">
          <div style={{padding:"12px 14px 12px",borderBottom:"1px solid var(--border)"}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontWeight:700,color:"var(--gold)"}}>⬡ AetherOS</div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:9,fontWeight:700,color:"var(--danger)",letterSpacing:".1em",marginTop:2}}>SUPER ADMIN</div>
          </div>
          <div style={{flex:1,padding:"6px 0",overflowY:"auto"}}>
            {ADMIN_TABS.map(t=>(
              <div key={t} className={"admin-nav-item"+(activeTab===t?" active":"")} onClick={()=>setActiveTab(t)}>
                <span style={{fontSize:13}}>{t==="Overview"?"⬡":t==="Tenants"?"👥":t==="Billing"?"💰":t==="Security"?"🛡":"🤖"}</span>
                {t}
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:9,color:"var(--silver-2)"}}>v4.1.0 · Super Admin</div>
          </div>
        </div>
        <div style={{flex:1,padding:14,overflow:"auto"}}>

          {activeTab==="Overview"&&(
            <>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)",marginBottom:10}}>Platform Overview</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:11}}>
                {[{v:"23",l:"Tenants",c:"var(--gold)"},{v:"$14.2k",l:"MRR",c:"var(--success)"},{v:"187",l:"Agents",c:"var(--accent)"},{v:"0",l:"Critical",c:"var(--success)"}].map(k=>(
                  <div className="admin-kpi" key={k.l}>
                    <div className="admin-kpi-val" style={{color:k.c}}>{k.v}</div>
                    <div className="admin-kpi-lbl">{k.l}</div>
                  </div>
                ))}
              </div>
              <table className="admin-table">
                <thead><tr><th>Tenant</th><th>Plan</th><th>MRR</th><th>Health</th><th>Status</th></tr></thead>
                <tbody>
                  {ADMIN_TENANTS.slice(0,4).map(t=>(
                    <tr key={t.name}>
                      <td style={{color:"var(--cream)",fontWeight:500}}>{t.name}</td>
                      <td><span className={"badge badge-"+(t.plan==="Enterprise"?"gold":t.plan==="Pro"?"accent":"blue")} style={{fontSize:9}}>{t.plan}</span></td>
                      <td style={{color:"var(--success)"}}>{t.mrr}</td>
                      <td style={{minWidth:70}}><MiniBar pct={t.health} color={t.health>90?"var(--success)":"var(--warn)"}/></td>
                      <td><StatusDot status={t.status}/><span style={{fontSize:10,color:"var(--silver)"}}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab==="Tenants"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)"}}>All Tenants ({ADMIN_TENANTS.length})</div>
                <button className="btn btn-primary btn-sm" style={{padding:"5px 10px",fontSize:10}}>+ Invite</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Tenant</th><th>Plan</th><th>Agents</th><th>MRR</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {ADMIN_TENANTS.map(t=>(
                    <tr key={t.name}>
                      <td style={{color:"var(--cream)",fontWeight:500}}>{t.name}</td>
                      <td><span className={"badge badge-"+(t.plan==="Enterprise"?"gold":t.plan==="Pro"?"accent":"blue")} style={{fontSize:9}}>{t.plan}</span></td>
                      <td>{t.agents}</td>
                      <td style={{color:"var(--success)"}}>{t.mrr}</td>
                      <td><StatusDot status={t.status}/><span style={{fontSize:10}}>{t.status}</span></td>
                      <td>
                        <div style={{display:"flex",gap:4}}>
                          <button className="btn btn-ghost btn-sm" style={{padding:"3px 7px",fontSize:9}}>View</button>
                          <button className="btn btn-sm" style={{padding:"3px 7px",fontSize:9,background:"rgba(124,106,247,.12)",color:"var(--accent)",border:"1px solid rgba(124,106,247,.25)"}}>Log in as</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab==="Billing"&&(
            <>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)",marginBottom:10}}>Revenue Overview</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:11}}>
                {[{l:"MRR",v:"$14,219",d:"+18% MoM",c:"var(--success)"},{l:"ARR",v:"$170,628",d:"+22% YoY",c:"var(--gold)"},{l:"ARPA",v:"$618",d:"+$42 MoM",c:"var(--accent)"},{l:"Churn",v:"0.8%",d:"-0.3% MoM",c:"var(--success)"}].map(k=>(
                  <div className="admin-kpi" key={k.l}>
                    <div className="admin-kpi-lbl">{k.l}</div>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:k.c,margin:"4px 0 2px"}}>{k.v}</div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"var(--success)"}}>{k.d}</div>
                  </div>
                ))}
              </div>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:9,fontWeight:700,color:"var(--silver-2)",letterSpacing:".08em",marginBottom:7}}>REVENUE BY PLAN</div>
              {[{plan:"Enterprise",mrr:"$9,600",pct:68,c:"var(--gold)"},{plan:"Pro",mrr:"$5,880",pct:41,c:"var(--accent)"},{plan:"Starter",mrr:"$693",pct:5,c:"var(--blue)"}].map(r=>(
                <div key={r.plan} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:60,fontFamily:"DM Mono,monospace",fontSize:10,color:"var(--silver)"}}>{r.plan}</div>
                  <div style={{flex:1,height:5,background:"var(--ink-5)",borderRadius:3}}><div style={{width:`${r.pct}%`,height:"100%",background:r.c,borderRadius:3}}/></div>
                  <div style={{width:48,fontFamily:"DM Mono,monospace",fontSize:10,color:"var(--cream)",textAlign:"right"}}>{r.mrr}</div>
                </div>
              ))}
            </>
          )}

          {activeTab==="Security"&&(
            <>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)",marginBottom:10}}>Security Events — All Tenants</div>
              {[{tenant:"LaunchForge",type:"INJECTION_BLOCKED",detail:"Instruction override attempt",ts:"2m ago",sev:"HIGH"},{tenant:"DataWave Inc",type:"RATE_LIMIT",detail:"Exceeded 8 msg/min threshold",ts:"14m ago",sev:"MED"},{tenant:"Apex Systems",type:"PII_DETECTED",detail:"Email in AI response → redacted",ts:"1h ago",sev:"LOW"}].map((e,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"8px 10px",background:"var(--ink-3)",borderRadius:6,marginBottom:5,border:"1px solid var(--border)",alignItems:"flex-start"}}>
                  <span style={{fontSize:9,padding:"2px 6px",borderRadius:10,background:e.sev==="HIGH"?"rgba(245,166,35,.12)":e.sev==="MED"?"rgba(64,179,224,.1)":"rgba(62,207,142,.08)",color:e.sev==="HIGH"?"var(--warn)":e.sev==="MED"?"var(--blue)":"var(--success)",fontFamily:"Syne,sans-serif",fontWeight:700,flexShrink:0}}>{e.sev}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:10,fontWeight:700,color:"var(--cream)"}}>{e.type} <span style={{color:"var(--silver-2)",fontWeight:400}}>· {e.tenant}</span></div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"var(--silver)",marginTop:1}}>{e.detail}</div>
                  </div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"var(--silver-2)",flexShrink:0}}>{e.ts}</div>
                </div>
              ))}
              <div style={{marginTop:8,padding:"7px 10px",background:"rgba(62,207,142,.06)",border:"1px solid rgba(62,207,142,.2)",borderRadius:6,fontFamily:"DM Mono,monospace",fontSize:10,color:"var(--success)"}}>
                ✓ Anti-injection layer active across all tenants · 0 critical events today
              </div>
            </>
          )}

          {activeTab==="Agents"&&(
            <>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)",marginBottom:10}}>Global Agent Oversight</div>
              {[{tenant:"Quantum Ventures",name:"Architect Agent",task:"Schema design for Nova v2",status:"busy",model:"Claude Sonnet"},{tenant:"Apex Systems",name:"Dev Alpha",task:"FastAPI auth endpoints",status:"active",model:"GPT-4o"},{tenant:"DataWave Inc",name:"QA Agent",task:"Adversarial test suite run",status:"active",model:"Claude Sonnet"},{tenant:"NovaSec",name:"Security Agent",task:"CVE cross-reference scan",status:"idle",model:"DeepSeek-R1"},{tenant:"CreatorStack",name:"BI Agent",task:"Q3 revenue report gen",status:"active",model:"Gemini 1.5"}].map((a,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"8px 10px",background:"var(--ink-3)",borderRadius:6,marginBottom:5,border:"1px solid var(--border)",alignItems:"center"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:a.status==="idle"?"var(--success)":a.status==="busy"?"var(--warn)":"var(--blue)",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:10,fontWeight:700,color:"var(--cream)"}}>{a.name} <span style={{color:"var(--silver-2)",fontWeight:400}}>· {a.tenant}</span></div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"var(--silver)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.task}</div>
                  </div>
                  <span style={{fontSize:9,padding:"2px 6px",borderRadius:10,background:"rgba(201,168,76,.1)",color:"var(--gold)",fontFamily:"Syne,sans-serif",fontWeight:700,flexShrink:0}}>{a.model}</span>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function LandingPage(){
  const [scrolled,setScrolled]=useState(false);
  const [openFaq,setOpenFaq]=useState(null);
  const [adminTab,setAdminTab]=useState("Overview");
  const [billing,setBilling]=useState("monthly");
  const [email,setEmail]=useState("");
  const [submitted,setSubmitted]=useState(false);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const getPrice=p=>p?(billing==="annual"?Math.floor(p*.8):p):null;

  return(
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className={scrolled?"scrolled":""}>
        <div className="nav-inner">
          <a href="#hero" className="nav-logo"><span style={{fontSize:22}}>⬡</span>AetherOS</a>
          <div className="nav-links">
            {["Features","Pricing","Super Admin","Security","FAQ"].map(l=>(
              <a key={l} href={"#"+l.toLowerCase().replace(" ","-")} className="nav-link">{l}</a>
            ))}
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <a href="#pricing" className="btn btn-ghost btn-sm">Sign In</a>
            <a href="#get-started" className="btn btn-primary btn-sm">Start Free Trial</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="orb orb-gold" style={{width:700,height:700,top:-200,right:-200,opacity:.7}}/>
        <div className="orb orb-accent" style={{width:500,height:500,bottom:-100,left:-100}}/>
        <div className="container" style={{position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
            <div style={{animation:"fadeUp .7s ease forwards"}}>
              <div className="hero-eyebrow">
                <div className="dot-live"/>
                Now in General Availability — v4.1
              </div>
              <h1 style={{fontSize:"clamp(42px,5.5vw,80px)",fontWeight:700,lineHeight:1.06,letterSpacing:"-.02em",marginBottom:24}}>
                The <em className="grad">Autonomous</em><br/>AI Software<br/>
                <span style={{color:"var(--cream-dim)"}}>Company Platform</span>
              </h1>
              <p style={{fontFamily:"DM Mono,monospace",fontSize:16,color:"var(--cream-dim)",lineHeight:1.7,maxWidth:480,marginBottom:40,fontWeight:300}}>
                One human CEO. Ten AI agents. A fully autonomous software company — architecting, building, shipping, and managing SaaS products around the clock.
              </p>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:40}}>
                <a href="#get-started" className="btn btn-primary btn-lg">
                  ⚡ Start Free Trial
                  <span style={{opacity:.6,fontSize:11}}>14 days · no card</span>
                </a>
                <a href="#super-admin" className="btn btn-ghost btn-lg">View Super Admin →</a>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:20,fontFamily:"Syne,sans-serif",fontSize:11,color:"var(--silver)",flexWrap:"wrap"}}>
                {["SOC2 Ready","Anti-Injection","GEO Compliant","CIO Audited"].map(t=>(
                  <span key={t} style={{display:"flex",alignItems:"center",gap:5}}><span style={{color:"var(--success)"}}>✓</span>{t}</span>
                ))}
              </div>
            </div>

            {/* Dashboard preview */}
            <div style={{animation:"scaleIn .8s ease forwards",animationDelay:".15s",opacity:0}}>
              <div className="mockup">
                <div className="mockup-bar">
                  <div className="mockup-dot" style={{background:"#ff5f56"}}/>
                  <div className="mockup-dot" style={{background:"#ffbd2e"}}/>
                  <div className="mockup-dot" style={{background:"#27c93f"}}/>
                  <div className="mockup-url">app.aetheros.io/dashboard</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginLeft:"auto"}}>
                    <div className="dot-live"/><span style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"var(--success)"}}>Live</span>
                  </div>
                </div>
                <div style={{padding:14}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:10}}>
                    {[{v:"8/10",l:"Agents",c:"var(--gold)"},{v:"94%",l:"Pipeline",c:"var(--success)"},{v:"$612",l:"LLM Spend",c:"var(--accent)"},{v:"4",l:"Approvals",c:"var(--warn)"}].map(k=>(
                      <div key={k.l} style={{background:"var(--ink-4)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 10px 8px"}}>
                        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:k.c}}>{k.v}</div>
                        <div style={{fontFamily:"Syne,sans-serif",fontSize:9,color:"var(--silver)",letterSpacing:".06em",marginTop:2}}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                  {[{ico:"⬡",name:"Architect Agent",task:"Designing microservices schema for Nova",s:"busy",p:78},{ico:"⚡",name:"Dev Alpha",task:"Writing FastAPI auth endpoints — 2,341 tokens",s:"active",p:62},{ico:"🧪",name:"QA Agent",task:"Running adversarial test suite — 94% pass",s:"active",p:94},{ico:"🛡",name:"Security Agent",task:"CVE scan complete — 0 critical",s:"idle",p:100}].map(a=>(
                    <div key={a.name} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"var(--ink-4)",borderRadius:6,marginBottom:5,border:"1px solid var(--border)"}}>
                      <span style={{fontSize:14,flexShrink:0}}>{a.ico}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"Syne,sans-serif",fontSize:10,fontWeight:700,color:"var(--cream)"}}>{a.name}</div>
                        <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"var(--silver)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.task}</div>
                      </div>
                      <div style={{flexShrink:0}}>
                        <div style={{width:46,height:3,background:"var(--ink-5)",borderRadius:2,marginBottom:2}}>
                          <div style={{width:`${a.p}%`,height:"100%",background:a.s==="idle"?"var(--success)":"var(--gold)",borderRadius:2}}/>
                        </div>
                        <span style={{fontSize:8,color:"var(--silver-2)",fontFamily:"DM Mono,monospace"}}>{a.s}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{background:"var(--ink-2)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"18px 0",overflow:"hidden"}}>
        <div style={{display:"flex",gap:60,animation:"ticker 22s linear infinite",whiteSpace:"nowrap",width:"max-content"}}>
          {["Anthropic","OpenAI","Google DeepMind","Pinecone","Stripe","AWS","Vercel","GitHub","Anthropic","OpenAI","Google DeepMind","Pinecone","Stripe","AWS","Vercel"].map((l,i)=>(
            <span key={i} style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--silver-2)",letterSpacing:".1em",flexShrink:0}}>{l}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="section-sm" style={{background:"var(--ink-2)"}}>
        <div className="container">
          <div className="grid-4">
            {[{val:2400,suf:"+",lbl:"AI Agents Spawned",d:"↑ 340 this month"},{val:847,suf:"",lbl:"Projects Shipped",d:"↑ 124 this month"},{val:99,suf:".9%",lbl:"Platform Uptime",d:"30-day rolling"},{val:47,suf:" days",lbl:"Avg MVP to Launch",d:"↓ 12 days vs industry"}].map(s=>(
              <div key={s.lbl} className="card" style={{padding:"28px 24px",textAlign:"center"}}>
                <div className="stat-val"><AnimCounter target={s.val} suffix={s.suf}/></div>
                <div className="stat-label">{s.lbl}</div>
                <div className="stat-delta">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* FEATURES */}
      <section className="section" id="features" style={{background:"var(--ink)"}}>
        <div className="orb orb-accent" style={{width:600,height:600,top:"10%",right:"-15%"}}/>
        <div className="container" style={{position:"relative",zIndex:1}}>
          <div className="section-label">Platform Capabilities</div>
          <h2 style={{fontSize:"clamp(32px,4vw,52px)",fontWeight:700,lineHeight:1.1,marginBottom:14,maxWidth:520}}>Everything an AI software company needs</h2>
          <p style={{fontFamily:"DM Mono,monospace",fontSize:14,color:"var(--silver)",maxWidth:520,marginBottom:56,fontWeight:300,lineHeight:1.7}}>
            AetherOS is the complete OS for running a software company with AI agents — from hiring to shipping to client billing.
          </p>
          <div className="grid-3">
            {FEATURES.map((f,i)=>(
              <div key={i} className="card" style={{padding:28}}>
                <div style={{width:48,height:48,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:16,background:f.col,border:`1px solid ${f.bc}`}}>{f.icon}</div>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"var(--cream)",marginBottom:8}}>{f.title}</div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:12,color:"var(--silver)",lineHeight:1.7,fontWeight:300}}>{f.desc}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>
                  {f.tags.map(t=><span key={t} className="badge badge-gold" style={{fontSize:9}}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{background:"var(--ink-2)"}}>
        <div className="container-sm">
          <div className="section-label">How It Works</div>
          <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:700,lineHeight:1.1,marginBottom:56}}>From idea to revenue in four steps</h2>
          {[
            {n:"01",ico:"📎",t:"Upload your BRD or requirement doc",d:"Attach a Business Requirements Document, PRD, wireframes, Figma link, or user stories. Architect Agent parses them and auto-generates a task backlog, sprint plan, and system design."},
            {n:"02",ico:"⬡",t:"Spawn and configure your agent workforce",d:"Choose which AI agents to deploy from 10 specialisations. Assign models, set approval thresholds, configure RAG memory scope per project."},
            {n:"03",ico:"🚀",t:"Agents build, test, and ship autonomously",d:"Watch agents collaborate in real-time — code commits, test runs, CI/CD pipelines, security scans. High-risk actions pause for your approval."},
            {n:"04",ico:"📊",t:"Manage clients, track revenue, scale",d:"Onboard SaaS clients into your multi-tenant platform. Track MRR, health scores, and upgrade paths. Super Admin gives full cross-workspace visibility."},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:32,padding:"28px 0",borderBottom:i<3?"1px solid var(--border)":"none"}}>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:48,fontWeight:700,color:"rgba(201,168,76,.2)",lineHeight:1,width:52,textAlign:"right",flexShrink:0}}>{s.n}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:20}}>{s.ico}</span>
                  <h3 style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:"var(--cream)"}}>{s.t}</h3>
                </div>
                <p style={{fontFamily:"DM Mono,monospace",fontSize:13,color:"var(--silver)",lineHeight:1.7,fontWeight:300}}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPER ADMIN */}
      <section className="section" id="super-admin" style={{background:"var(--ink)"}}>
        <div className="orb orb-gold" style={{width:500,height:500,bottom:"-10%",left:"-8%"}}/>
        <div className="container" style={{position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"start"}}>
            <div>
              <div className="section-label">Enterprise</div>
              <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:700,lineHeight:1.1,marginBottom:20}}>
                Super Admin <em className="grad">Portal</em>
              </h2>
              <p style={{fontFamily:"DM Mono,monospace",fontSize:13,color:"var(--silver)",lineHeight:1.7,marginBottom:28,fontWeight:300}}>
                One pane of glass across every tenant workspace. Monitor all agents, manage billing, investigate security events, and impersonate any tenant for support — with full audit trail.
              </p>
              {[
                {ico:"👥",t:"Tenant Management",d:"Invite, suspend, or impersonate any tenant. Adjust plan limits, view agent counts, one-click workspace login."},
                {ico:"💰",t:"Unified Billing Dashboard",d:"MRR, ARR, churn, ARPA — all tenants in one view. Revenue by plan and Stripe subscription management."},
                {ico:"🛡",t:"Cross-Tenant Security Console",d:"All injection events, PII detections, rate limits, and audit logs across every tenant with drill-down and export."},
                {ico:"🤖",t:"Global Agent Oversight",d:"See every running agent across all tenants. Force-pause runaway processes, compare LLM spend per workspace."},
              ].map(f=>(
                <div key={f.t} style={{display:"flex",gap:12,padding:"12px 16px",background:"var(--ink-3)",borderRadius:10,border:"1px solid var(--border)",marginBottom:10}}>
                  <span style={{fontSize:18,flexShrink:0,marginTop:1}}>{f.ico}</span>
                  <div>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:"var(--cream)",marginBottom:3}}>{f.t}</div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:11,color:"var(--silver)",fontWeight:300,lineHeight:1.5}}>{f.d}</div>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:20}}>
                <a href="#pricing" className="btn btn-primary">Get Enterprise Access</a>
                <a href="#get-started" className="btn btn-ghost">Book a Demo →</a>
              </div>
            </div>
            <div style={{position:"sticky",top:90}}>
              <AdminMockup activeTab={adminTab} setActiveTab={setAdminTab}/>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10,justifyContent:"center"}}>
                {ADMIN_TABS.map(t=>(
                  <button key={t} onClick={()=>setAdminTab(t)} className="btn btn-sm" style={{background:adminTab===t?"var(--gold-glow)":"transparent",color:adminTab===t?"var(--gold)":"var(--silver)",border:`1px solid ${adminTab===t?"var(--gold-dim)":"var(--border)"}`,padding:"4px 10px",fontSize:10}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="section" id="security" style={{background:"var(--ink-2)"}}>
        <div className="container">
          <div className="section-label">Security & Compliance</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
            <div>
              <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:700,lineHeight:1.1,marginBottom:18}}>Enterprise-grade AI security, built-in</h2>
              <p style={{fontFamily:"DM Mono,monospace",fontSize:13,color:"var(--silver)",lineHeight:1.7,fontWeight:300,marginBottom:24}}>
                Multi-layer security covering prompt injection, data exfiltration, PII compliance, and AI output integrity — all observable in real-time across all tenants.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{l:"Anti-Prompt Injection",d:"40+ patterns + encoding",i:"🛡"},{l:"CIO Compliance",d:"PII scanner & auto-redact",i:"🔒"},{l:"AIO Output Labels",d:"Model + confidence badges",i:"🏷"},{l:"GEO Ready",d:"llms.txt, JSON-LD, robots",i:"🌐"},{l:"Audit Trail",d:"500-event log + CSV",i:"📋"},{l:"Rate Limiting",d:"Per-session enforcement",i:"⏱"},{l:"Hardened Prompt",d:"Immutable system policy",i:"🔑"},{l:"SOC2 Ready",d:"Controls auto-mapped",i:"✅"}].map(s=>(
                  <div key={s.l} style={{padding:"10px 12px",background:"var(--ink-3)",borderRadius:8,border:"1px solid var(--border)",display:"flex",gap:8}}>
                    <span style={{fontSize:14,flexShrink:0}}>{s.i}</span>
                    <div>
                      <div style={{fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:"var(--cream)",marginBottom:2}}>{s.l}</div>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"var(--silver)",fontWeight:300}}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{padding:28}}>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,letterSpacing:".12em",color:"var(--gold)",marginBottom:20,textTransform:"uppercase"}}>Compliance Score</div>
              {[{cat:"Prompt Security",score:97,c:"var(--success)"},{cat:"Data Privacy (CIO)",score:94,c:"var(--success)"},{cat:"AI Output Integrity (AIO)",score:92,c:"var(--success)"},{cat:"Search Compliance (GEO/SEO)",score:100,c:"var(--gold)"},{cat:"Access Control",score:88,c:"var(--warn)"},{cat:"Audit & Logging",score:99,c:"var(--success)"}].map(s=>(
                <div key={s.cat} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontFamily:"DM Mono,monospace",fontSize:11,color:"var(--cream)",fontWeight:300}}>{s.cat}</span>
                    <span style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:s.c}}>{s.score}%</span>
                  </div>
                  <MiniBar pct={s.score} color={s.c}/>
                </div>
              ))}
              <div style={{borderTop:"1px solid var(--border)",marginTop:16,paddingTop:14,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:44,fontWeight:700,color:"var(--gold)"}}>95</div>
                <div>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)"}}>Overall Score</div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:11,color:"var(--success)",fontWeight:300}}>↑ Enterprise Grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing" style={{background:"var(--ink)"}}>
        <div className="orb orb-gold" style={{width:600,height:600,top:"-20%",right:"-10%"}}/>
        <div className="container" style={{position:"relative",zIndex:1}}>
          <div className="section-label">Pricing</div>
          <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:700,lineHeight:1.1,marginBottom:14}}>Start free, scale without limits</h2>
          <p style={{fontFamily:"DM Mono,monospace",fontSize:13,color:"var(--silver)",marginBottom:28,fontWeight:300}}>Every plan includes a 14-day free trial. No credit card required.</p>
          <div style={{display:"inline-flex",background:"var(--ink-3)",border:"1px solid var(--border)",borderRadius:8,padding:4,marginBottom:44,gap:4}}>
            {["monthly","annual"].map(c=>(
              <button key={c} onClick={()=>setBilling(c)} style={{padding:"7px 18px",borderRadius:6,fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:billing===c?"var(--gold)":"transparent",color:billing===c?"var(--ink)":"var(--silver)",transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
                {c.charAt(0).toUpperCase()+c.slice(1)}
                {c==="annual"&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:10,background:billing==="annual"?"rgba(0,0,0,.2)":"var(--gold-glow)",color:billing==="annual"?"var(--ink)":"var(--gold)"}}>−20%</span>}
              </button>
            ))}
          </div>
          <div className="grid-3">
            {PLANS.map(plan=>(
              <div key={plan.name} className={"card plan-card"+(plan.highlight?" popular card-gold":"")}>
                {plan.badge&&<div style={{position:"absolute",top:20,right:20}}><span className="badge badge-gold">{plan.badge}</span></div>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  {plan.price?(<><sup>$</sup>{getPrice(plan.price)}<sub>{billing==="annual"?"/mo billed annually":"/mo"}</sub></>):(<span style={{fontSize:36}}>Custom</span>)}
                </div>
                <div className="plan-desc">{plan.desc}</div>
                <a href="#get-started" className={"btn "+(plan.highlight?"btn-primary":"btn-outline")} style={{width:"100%",justifyContent:"center",marginBottom:20}}>
                  {plan.price?"Start Free Trial":"Contact Sales"}
                </a>
                <div style={{height:1,background:"var(--border)",marginBottom:16}}/>
                {plan.features.map((f,i)=>(
                  <div key={i} className="plan-feature">
                    <span style={{color:f.yes?"var(--success)":"var(--silver-2)",flexShrink:0,fontSize:13,marginTop:1}}>{f.yes?"✓":"–"}</span>
                    <span style={{color:f.yes?"var(--cream-dim)":"var(--silver-2)"}}>{f.t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:28,fontFamily:"DM Mono,monospace",fontSize:12,color:"var(--silver)",fontWeight:300}}>
            All plans: AES-256 encryption · TLS 1.3 · GDPR compliant · 24/7 status page
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background:"var(--ink-2)"}}>
        <div className="container">
          <div className="section-label">Customer Stories</div>
          <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:700,lineHeight:1.1,marginBottom:44}}>Companies building with AetherOS</h2>
          <div className="grid-2" style={{gap:20}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="card testi-card">
                <div className="testi-stars">{"★".repeat(5)}</div>
                <div className="testi-quote">"{t.quote}"</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"var(--ink-4)",border:"1px solid var(--border-gold)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{t.avatar}</div>
                  <div>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:"var(--cream)"}}>{t.name}</div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:11,color:"var(--silver)",fontWeight:300}}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{background:"var(--ink)"}}>
        <div className="container-sm">
          <div className="section-label">FAQ</div>
          <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:700,lineHeight:1.1,marginBottom:44}}>Frequently asked questions</h2>
          {FAQS.map((f,i)=>(
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                {f.q}
                <span style={{fontSize:20,color:"var(--gold)",transition:"transform .2s",flexShrink:0,display:"inline-block",transform:openFaq===i?"rotate(45deg)":"none"}}>+</span>
              </div>
              {openFaq===i&&<div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" id="get-started" style={{background:"var(--ink-2)"}}>
        <div className="orb orb-gold" style={{width:600,height:600,top:"-30%",left:"50%",transform:"translateX(-50%)"}}/>
        <div className="container-sm" style={{position:"relative",zIndex:1}}>
          <div className="cta-box">
            <div className="orb orb-accent" style={{width:280,height:280,top:"-10%",right:"5%",opacity:.5}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
                <span className="badge badge-gold" style={{fontSize:11,padding:"5px 14px"}}>⬡ Ready to launch your AI company?</span>
              </div>
              <h2 style={{fontSize:"clamp(32px,5vw,60px)",fontWeight:700,lineHeight:1.05,marginBottom:18}}>
                Start your autonomous<br/><em className="grad">AI company today</em>
              </h2>
              <p style={{fontFamily:"DM Mono,monospace",fontSize:14,color:"var(--cream-dim)",marginBottom:36,fontWeight:300,lineHeight:1.7}}>
                14-day free trial · No credit card required · Setup in under 5 minutes
              </p>
              {!submitted?(
                <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
                  <input className="input-field" type="email" placeholder="your@company.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&email.trim()&&setSubmitted(true)} style={{width:280}}/>
                  <button className="btn btn-primary btn-lg" onClick={()=>email.trim()&&setSubmitted(true)}>⚡ Start Free Trial</button>
                </div>
              ):(
                <div style={{padding:"18px 28px",background:"rgba(62,207,142,.1)",border:"1px solid rgba(62,207,142,.25)",borderRadius:12,marginBottom:20,display:"inline-block"}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"var(--success)",marginBottom:3}}>✓ You're on the list!</div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:12,color:"var(--silver)",fontWeight:300}}>Check your inbox for your trial activation link.</div>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,fontFamily:"DM Mono,monospace",fontSize:11,color:"var(--silver-2)",fontWeight:300,flexWrap:"wrap"}}>
                <span>✓ Anti-injection security built in</span>
                <span>✓ GEO + AIO compliant</span>
                <span>✓ SOC2 ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:40}}>
            <div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:700,color:"var(--gold)"}}>⬡ AetherOS</div>
              <div style={{fontFamily:"DM Mono,monospace",fontSize:12,color:"var(--silver)",marginTop:8,fontWeight:300,lineHeight:1.6}}>The autonomous AI software<br/>company platform.</div>
              <div style={{display:"flex",gap:8,marginTop:20}}>
                {["𝕏","in","gh"].map(s=>(
                  <a key={s} href="#" style={{width:30,height:30,borderRadius:6,background:"var(--ink-4)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:"var(--silver)",textDecoration:"none",transition:"color .15s"}}>
                    {s}
                  </a>
                ))}
              </div>
            </div>
            {[
              {t:"Product",links:["Features","Pricing","Super Admin","Security","Changelog","Roadmap"]},
              {t:"Developers",links:["Documentation","API Reference","GitHub","Installation Guide","Status Page"]},
              {t:"Company",links:["About","Blog","Careers","Contact","Partners","Press Kit"]},
              {t:"Legal",links:["Privacy Policy","Terms of Service","Cookie Policy","Security Policy","DPA","SLA"]},
            ].map(col=>(
              <div key={col.t}>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,letterSpacing:".12em",color:"var(--cream)",textTransform:"uppercase",marginBottom:14}}>{col.t}</div>
                {col.links.map(l=><a key={l} href="#" className="footer-link">{l}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2025 AetherOS. All rights reserved.</span>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span className="badge badge-green" style={{fontSize:9}}>
                <div className="dot-live" style={{width:5,height:5,marginRight:3}}/>All systems operational
              </span>
              <span className="badge badge-gold" style={{fontSize:9}}>v4.1.0</span>
              <span>Built with Claude — Anthropic</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
