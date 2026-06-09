// Dashboard.jsx — L'Éclat d'Azur CRM · Luxury Dark Edition
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { customerAPI, loyaltyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Palette ──────────────────────────────────────────────── */
const C = {
  bg:       '#100B06',
  bgLayer:  '#180E08',
  bgCard:   '#1F1209',
  bgCardHov:'#251608',
  bgPanel:  '#1A0F08',
  border:   'rgba(184,137,42,0.18)',
  borderHov:'rgba(184,137,42,0.42)',
  borderSub:'rgba(184,137,42,0.10)',
  gold:     '#C49A2E',
  goldBrt:  '#DDB84F',
  goldLight:'#EDD080',
  goldPale: '#F5E8B4',
  goldGlow: 'rgba(196,154,46,0.25)',
  goldMuted:'rgba(196,154,46,0.12)',
  textPrim: '#F0E6D0',
  textSec:  '#B09070',
  textMut:  'rgba(176,144,112,0.55)',
  textDim:  'rgba(176,144,112,0.32)',
  silver:   '#8E9BAA',
  platinum: '#9F94D8',
  green:    '#4ade80',
  onyx:     '#0A0604',
};

const TIERS = {
  SILVER:   { label:'Silver',   range:'Up to 999 pts',       color: C.silver,   glow:'rgba(142,155,170,0.15)', icon:'◈', perks:'Welcome Amenity · Room Upgrade · Early Check-in' },
  GOLD:     { label:'Gold',     range:'1,000 – 4,999 pts',   color: C.gold,     glow: C.goldGlow,              icon:'◆', perks:'Complimentary Breakfast · Guaranteed Upgrade · Spa Credit' },
  PLATINUM: { label:'Platinum', range:'5,000+ pts',          color: C.platinum, glow:'rgba(159,148,216,0.15)', icon:'★', perks:'VIP Lounge · Butler Service · Exclusive Rate · Suite Night' },
};

const HERO_IMG = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=85&auto=format&fit=crop';

/* ─── Styles ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  .ezd * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes imgReveal {
    from { opacity: 0; transform: scale(1.06); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lineDraw {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes shimmerLoad {
    0%,100% { opacity:.08; } 50% { opacity:.22; }
  }
  @keyframes dotPulse {
    0%,100% { opacity: 1; box-shadow: 0 0 6px rgba(74,222,128,0.6); }
    50%      { opacity: .5; box-shadow: 0 0 12px rgba(74,222,128,0.9); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes orbFloat {
    0%,100% { transform: scale(1) translateY(0); opacity: .35; }
    50%      { transform: scale(1.1) translateY(-8px); opacity: .55; }
  }

  .ezd-fu1 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .06s both; }
  .ezd-fu2 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .13s both; }
  .ezd-fu3 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .20s both; }
  .ezd-fu4 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .27s both; }
  .ezd-fu5 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .34s both; }
  .ezd-si0 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .00s both; }
  .ezd-si1 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .07s both; }
  .ezd-si2 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .14s both; }
  .ezd-si3 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .21s both; }
  .ezd-hero-img { animation: imgReveal 1.8s cubic-bezier(.22,1,.36,1) both; }
  .ezd-shimmer  { animation: shimmerLoad 2s ease infinite; }
  .ezd-spin     { animation: spin 1s linear infinite; }

  .ezd-stat {
    background: #1F1209;
    border: 1px solid rgba(196,154,42,0.16);
    border-top: 2px solid #C49A2E;
    border-radius: 2px;
    padding: 1.5rem 1.35rem 1.3rem;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s ease, background .3s ease;
  }
  .ezd-stat:hover {
    transform: translateY(-5px);
    background: #251608;
    border-color: rgba(196,154,46,0.36);
    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,154,46,0.12);
  }

  .ezd-panel {
    background: #1A0F08;
    border: 1px solid rgba(196,154,46,0.14);
    border-radius: 2px;
    padding: 1.7rem;
    position: relative;
    overflow: hidden;
  }
  .ezd-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(196,154,46,0.45), transparent);
  }

  .ezd-tier {
    background: #1F1209;
    border: 1px solid rgba(196,154,46,0.13);
    border-radius: 2px;
    padding: 1.9rem 1.6rem;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, background .3s ease;
  }
  .ezd-tier:hover {
    transform: translateY(-5px);
    background: #251608;
    box-shadow: 0 18px 52px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,154,46,0.18);
  }

  .ezd-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 10px;
    border-bottom: 1px solid rgba(196,154,46,0.08);
    cursor: default;
    border-radius: 1px;
    transition: background .18s ease, padding-left .2s ease;
  }
  .ezd-row:hover { background: rgba(196,154,46,0.05); padding-left: 14px; }

  .ezd-kpi {
    padding: 14px 22px;
    background: rgba(10,6,4,0.58);
    backdrop-filter: blur(18px);
    border: 0.5px solid rgba(196,154,46,0.28);
    border-left: 2px solid #C49A2E;
    border-radius: 2px;
    min-width: 168px;
    transition: background .25s, border-color .25s, transform .25s;
  }
  .ezd-kpi:hover {
    background: rgba(10,6,4,0.72);
    border-left-color: #EDD080;
    transform: translateY(-3px);
  }

  .ezd-btn {
    font-family: 'Jost', sans-serif;
    font-weight: 400; font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 9px 20px; border-radius: 2px; border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #C49A2E 0%, #DDB84F 100%);
    color: #0A0604;
    position: relative; overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .ezd-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,154,46,0.5); }
  .ezd-btn:active { transform: scale(.97); }

  .ezd ::-webkit-scrollbar { width: 4px; }
  .ezd ::-webkit-scrollbar-track { background: #100B06; }
  .ezd ::-webkit-scrollbar-thumb { background: rgba(196,154,46,0.3); border-radius: 2px; }

  @media (max-width: 900px) {
    .ezd-grid2 { grid-template-columns: 1fr !important; }
    .ezd-grid3 { grid-template-columns: 1fr !important; }
  }
`;

/* ─── Typography ─────────────────────────────────────────────── */
const serif  = (sz, wt=400, col=C.textPrim, x={}) => ({ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:sz, fontWeight:wt, color:col, ...x });
const jost   = (sz, wt=300, col=C.textSec,  x={}) => ({ fontFamily:"'Jost',sans-serif", fontSize:sz, fontWeight:wt, letterSpacing:'0.2em', textTransform:'uppercase', color:col, ...x });

/* ─── Atoms ──────────────────────────────────────────────────── */
function Label({ children, color=C.textSec, style={} }) {
  return <p style={{ ...jost(9, 300, color), margin:0, ...style }}>{children}</p>;
}

function GoldDivider({ label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, margin:'3.2rem 0 2rem' }}>
      <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to right, transparent, rgba(196,154,46,0.4))`, animation:'lineDraw .9s ease both' }} />
      <span style={{ color:C.gold, fontSize:9, opacity:.6 }}>✦</span>
      {label && <Label color={C.gold} style={{ letterSpacing:'0.32em' }}>{label}</Label>}
      <span style={{ color:C.gold, fontSize:9, opacity:.6 }}>✦</span>
      <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to left, transparent, rgba(196,154,46,0.4))`, animation:'lineDraw .9s ease both' }} />
    </div>
  );
}

function StatCard({ label, value, sub, icon, topColor=C.gold, loading, anim='ezd-fu1', progress }) {
  return (
    <div className={`ezd-stat ${anim}`} style={{ borderTopColor: topColor }}>
      <div style={{ position:'absolute', top:0, right:0, width:36, height:36, borderBottom:`1px solid ${topColor}20`, borderLeft:`1px solid ${topColor}20` }} />
      <div style={{ position:'absolute', right:14, bottom:10, fontSize:54, color:topColor, opacity:.055, lineHeight:1, userSelect:'none', fontFamily:'serif' }}>{icon}</div>
      <Label style={{ marginBottom:12 }}>{label}</Label>
      {loading
        ? <div className="ezd-shimmer" style={{ height:40, width:68, background:'rgba(196,154,46,0.1)', borderRadius:2, marginBottom:10 }} />
        : <p style={{ ...serif(42,300,C.textPrim), lineHeight:1, marginBottom:8 }}>{value ?? '—'}</p>
      }
      {sub && <Label color={C.textDim}>{sub}</Label>}
      {progress != null && (
        <div style={{ background:'rgba(196,154,46,0.1)', height:3, borderRadius:2, overflow:'hidden', marginTop:10 }}>
          <div style={{ height:'100%', background:`linear-gradient(to right, #C49A2E, #EDD080)`, width:`${progress}%`, borderRadius:2, transition:'width 0.7s ease' }} />
        </div>
      )}
    </div>
  );
}

function LiveDot() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
      <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:C.green, animation:'dotPulse 2s ease infinite' }} />
      <Label color={C.green}>Live</Label>
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#1F1209', border:`1px solid rgba(196,154,46,0.3)`, borderLeft:`2px solid ${C.gold}`, borderRadius:2, padding:'10px 18px', boxShadow:'0 8px 30px rgba(0,0,0,0.6)' }}>
      <Label style={{ marginBottom:5 }}>{label}</Label>
      <p style={{ ...serif(22,300,C.textPrim) }}>{payload[0].value} <span style={{ ...jost(9,300,C.textSec) }}>guests</span></p>
    </div>
  );
}

function Particles() {
  const ps = Array.from({length:14}, (_,i) => ({
    id:i,
    left:`${6+Math.random()*88}%`,
    bottom:`${Math.random()*25}%`,
    delay:`${Math.random()*7}s`,
    dur:`${5+Math.random()*8}s`,
    sz: Math.random()>.6 ? 2 : 1.5,
  }));
  return <>{ps.map(p=>(
    <div key={p.id} style={{ position:'absolute', borderRadius:'50%', background:'#EDD080', pointerEvents:'none', left:p.left, bottom:p.bottom, width:p.sz, height:p.sz, animation:`particleRise linear infinite`, animationDuration:p.dur, animationDelay:p.delay }} />
  ))}</>;
}

/* ─── Dashboard ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { authenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cards, setCards]         = useState([]);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    if (!authenticated) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      let list = [];
      try {
        const { data } = await customerAPI.getAll();
        list = Array.isArray(data) ? data : [];
        setCustomers(list);
      } catch(e) { console.error(e); setCustomers([]); }
      try {
        const res = await Promise.all(list.slice(0,20).map(c => loyaltyAPI.getCardByCustomer(c.id).catch(()=>null)));
        setCards(res.filter(Boolean).map(r=>r.data));
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [authenticated]);

  const tierCounts = cards.reduce((a,c)=>{ const t=c?.cardType||'SILVER'; a[t]=(a[t]||0)+1; return a; }, {SILVER:0,GOLD:0,PLATINUM:0});
  const total = cards.length || 1;

  const chartData = [
    { name:'Silver',   count:tierCounts.SILVER,   fill:C.silver   },
    { name:'Gold',     count:tierCounts.GOLD,     fill:C.gold     },
    { name:'Platinum', count:tierCounts.PLATINUM, fill:C.platinum },
  ];

  const recentActivity = customers.slice(0,5).map((c,i)=>({
    id:c.id,
    name:`${c.firstName} ${c.lastName}`,
    action: i%3===0?'Membership card issued': i%3===1?'Reward points earned':'Points redeemed',
    time:`${i+1}h ago`,
    type:i%3,
  }));

  const actMeta = [
    { icon:'◆', bg:'rgba(196,154,46,0.1)',  color:C.gold     },
    { icon:'+', bg:'rgba(74,222,128,0.08)', color:C.green    },
    { icon:'−', bg:'rgba(159,148,216,0.1)', color:C.platinum },
  ];

  const today = new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="ezd" style={{ minHeight:'100vh', background:C.bg, color:C.textPrim }}>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <header style={{ position:'relative', overflow:'hidden', minHeight:440 }}>
        <img src={HERO_IMG} alt="" aria-hidden="true" className="ezd-hero-img"
          onLoad={()=>setHeroLoaded(true)}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 35%', opacity:heroLoaded?1:0, transition:'opacity .9s ease' }} />
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${C.onyx} 0%,#3D2510 60%,#5E3D22 100%)`, opacity:heroLoaded?0:1, transition:'opacity .9s ease' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(8,4,2,0.62)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(8,4,2,0.85) 0%,rgba(8,4,2,0.35) 55%,transparent 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(8,4,2,0.8) 100%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(to right,transparent 0%,${C.gold}70 25%,${C.goldLight}90 50%,${C.gold}70 75%,transparent 100%)` }} />
        <div style={{ position:'absolute', inset:0, opacity:.025, pointerEvents:'none', backgroundImage:'repeating-linear-gradient(45deg,#C49A2E 0,#C49A2E 1px,transparent 0,transparent 50%)', backgroundSize:'18px 18px' }} />
        <div style={{ position:'absolute', left:'-8%', top:'-40%', width:'45%', height:'200%', background:`radial-gradient(ellipse,rgba(196,154,46,0.14) 0%,transparent 65%)`, animation:'orbFloat 7s ease infinite', pointerEvents:'none' }} />
        <Particles />
        <div style={{ position:'absolute', top:20, right:24, opacity:.28 }}>
          <div style={{ width:68, height:68, border:`1px solid ${C.goldLight}` }} />
          <div style={{ position:'absolute', top:7, left:7, right:7, bottom:7, border:`0.5px solid ${C.goldLight}` }} />
        </div>

        {/* Content */}
        <div style={{ position:'relative', maxWidth:1240, margin:'0 auto', padding:'4rem 2.5rem 3.4rem' }}>
          <div className="ezd-fu1" style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16, padding:'5px 18px', border:`0.5px solid rgba(196,154,46,0.36)`, background:'rgba(196,154,46,0.1)', backdropFilter:'blur(8px)' }}>
            <span style={{ color:C.goldBrt, fontSize:9 }}>✦</span>
            <Label color={C.goldPale} style={{ letterSpacing:'0.34em' }}>Administration · Exclusive Collection</Label>
            <span style={{ color:C.goldBrt, fontSize:9 }}>✦</span>
          </div>

          <h1 className="ezd-fu2" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:62, fontWeight:300, color:'#FFFFFF', lineHeight:1.04, letterSpacing:'0.01em', marginBottom:10, textShadow:'0 2px 28px rgba(0,0,0,0.5)' }}>
            Rewards <span style={{ fontStyle:'italic', fontWeight:200 }}>Management</span>
          </h1>

          <div className="ezd-fu3" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:36 }}>
            <div style={{ width:38, height:1, background:`linear-gradient(to right,${C.goldBrt},transparent)` }} />
            <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:200, fontSize:11, color:'rgba(240,225,200,0.58)', letterSpacing:'0.07em' }}>{today}</p>
          </div>

          <div className="ezd-fu4" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[
              { label:"Tonight's Occupancy", value: loading?'…':'94%' },
              { label:'Active Stays',         value: loading?'…':customers.length },
              { label:'Points Issued (month)',value: loading?'…':`${(cards.length*312).toLocaleString('en-US')} pts` },
            ].map(k=>(
              <div key={k.label} className="ezd-kpi">
                <Label color="rgba(240,225,200,0.48)" style={{ marginBottom:7 }}>{k.label}</Label>
                <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:30, fontWeight:300, color:'#FFFFFF', lineHeight:1 }}>{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth:1240, margin:'0 auto', padding:'0 2.5rem 5rem' }}>

        <GoldDivider label="Portfolio Overview" />

        {/* Stat grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(218px,1fr))', gap:14, marginBottom:'3.2rem' }}>
          <StatCard anim="ezd-fu1" label="Total Guests"       value={customers.length}    sub="All membership tiers"    icon="◈" loading={loading} progress={customers.length?72:null} />
          <StatCard anim="ezd-fu2" label="Active Memberships" value={cards.length}        sub="Loyalty cards issued"    icon="◆" loading={loading} progress={cards.length?85:null} />
          <StatCard anim="ezd-fu3" label="Gold Members"       value={tierCounts.GOLD}     sub="Premium tier guests"     icon="◆" topColor={C.gold}     loading={loading} progress={tierCounts.GOLD?Math.round(tierCounts.GOLD/total*100):null} />
          <StatCard anim="ezd-fu4" label="Platinum Members"   value={tierCounts.PLATINUM} sub="Top-tier VIP guests"     icon="★" topColor={C.platinum} loading={loading} progress={tierCounts.PLATINUM?Math.round(tierCounts.PLATINUM/total*100):null} />
        </div>

        {/* Tier badges */}
        <div style={{ display:'flex', gap:8, marginBottom:32, flexWrap:'wrap' }}>
          {Object.entries(TIERS).map(([k,m])=>(
            <div key={k} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 16px', borderRadius:2, background:`${m.color}12`, border:`0.5px solid ${m.color}30`, cursor:'default', transition:'all .2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${m.color}22`; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=`${m.color}12`; e.currentTarget.style.transform=''; }}>
              <span style={{ color:m.color, fontSize:10 }}>{m.icon}</span>
              <Label color={m.color}>{m.label} · {tierCounts[k]}</Label>
            </div>
          ))}
        </div>

        <GoldDivider label="Loyalty Overview" />

        {/* Loyalty Analytics Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:'3.2rem' }}>
          <div className="ezd-stat ezd-fu1" style={{ borderTopColor:C.silver }}>
            <Label color={C.silver} style={{ marginBottom:12 }}>Silver Cards</Label>
            {loading ? <div className="ezd-shimmer" style={{ height:40, background:'rgba(196,154,46,0.1)', borderRadius:2 }} /> : <p style={{ ...serif(42,300,C.textPrim), margin:0 }}>{tierCounts.SILVER}</p>}
            <div style={{ marginTop:12, background:'rgba(142,155,170,0.1)', height:3, borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', background:C.silver, width:`${total>0?(tierCounts.SILVER/total*100):0}%`, transition:'width 0.7s ease' }} />
            </div>
          </div>
          <div className="ezd-stat ezd-fu2" style={{ borderTopColor:C.gold }}>
            <Label color={C.gold} style={{ marginBottom:12 }}>Gold Cards</Label>
            {loading ? <div className="ezd-shimmer" style={{ height:40, background:'rgba(196,154,46,0.1)', borderRadius:2 }} /> : <p style={{ ...serif(42,300,C.textPrim), margin:0 }}>{tierCounts.GOLD}</p>}
            <div style={{ marginTop:12, background:C.goldMuted, height:3, borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', background:C.gold, width:`${total>0?(tierCounts.GOLD/total*100):0}%`, transition:'width 0.7s ease' }} />
            </div>
          </div>
          <div className="ezd-stat ezd-fu3" style={{ borderTopColor:C.platinum }}>
            <Label color={C.platinum} style={{ marginBottom:12 }}>Platinum Cards</Label>
            {loading ? <div className="ezd-shimmer" style={{ height:40, background:'rgba(196,154,46,0.1)', borderRadius:2 }} /> : <p style={{ ...serif(42,300,C.textPrim), margin:0 }}>{tierCounts.PLATINUM}</p>}
            <div style={{ marginTop:12, background:'rgba(159,148,216,0.1)', height:3, borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', background:C.platinum, width:`${total>0?(tierCounts.PLATINUM/total*100):0}%`, transition:'width 0.7s ease' }} />
            </div>
          </div>
        </div>

        <GoldDivider label="Analytics" />

        {/* Chart + Activity */}
        <div className="ezd-grid2" style={{ display:'grid', gridTemplateColumns:'1fr 350px', gap:14 }}>

          {/* Bar chart */}
          <div className="ezd-panel ezd-fu2">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
              <div>
                <Label color={C.gold} style={{ marginBottom:6 }}>Membership Distribution</Label>
                <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:200, fontSize:12, color:C.textMut }}>Guests by loyalty tier</p>
              </div>
              <button className="ezd-btn">Export</button>
            </div>
            {loading
              ? <div style={{ height:240, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div className="ezd-spin" style={{ width:26, height:26, borderRadius:'50%', border:`2px solid ${C.gold}`, borderTopColor:'transparent' }} />
                </div>
              : <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={48}>
                    <CartesianGrid strokeDasharray="2 5" stroke="rgba(196,154,46,0.1)" />
                    <XAxis dataKey="name"
                      tick={{ fill:C.textSec, fontSize:14, fontFamily:"'Cormorant Garamond',Georgia,serif" }}
                      axisLine={{ stroke:'rgba(196,154,46,0.2)' }} tickLine={false} />
                    <YAxis allowDecimals={false}
                      tick={{ fill:C.textMut, fontSize:10, fontFamily:'Jost,sans-serif', fontWeight:300 }}
                      axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(196,154,46,0.04)' }} />
                    <Bar dataKey="count" radius={[3,3,0,0]}>
                      {chartData.map(e=><Cell key={e.name} fill={e.fill} opacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </div>

          {/* Activity */}
          <div className="ezd-panel ezd-fu3">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <div>
                <Label color={C.gold} style={{ marginBottom:6 }}>Recent Activity</Label>
                <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:200, fontSize:12, color:C.textMut }}>Latest guest interactions</p>
              </div>
              <LiveDot />
            </div>
            {loading
              ? <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {[...Array(5)].map((_,i)=>(
                    <div key={i} className="ezd-shimmer" style={{ height:52, background:'rgba(196,154,46,0.07)', borderRadius:2, opacity:1-i*.12 }} />
                  ))}
                </div>
              : recentActivity.length===0
                ? <div style={{ textAlign:'center', padding:'3rem 0' }}>
                    <p style={{ ...serif(30,300,C.textSec), marginBottom:8 }}>◈</p>
                    <Label>No recent activity</Label>
                  </div>
                : recentActivity.map((item,idx)=>{
                    const m=actMeta[item.type];
                    return (
                      <div key={item.id} className={`ezd-row ezd-si${idx}`}>
                        <div style={{ width:34, height:34, flexShrink:0, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', background:m.bg, color:m.color, border:`0.5px solid ${m.color}22`, fontFamily:"'Cormorant Garamond',serif", fontSize:16 }}>{m.icon}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ ...serif(14,400,C.textPrim), marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</p>
                          <Label color={C.textMut}>{item.action}</Label>
                        </div>
                        <Label color={C.textDim} style={{ flexShrink:0 }}>{item.time}</Label>
                      </div>
                    );
                  })
            }
          </div>
        </div>

        {/* ══ Tiers ══ */}
        <GoldDivider label="Membership Tiers" />

        <div className="ezd-grid3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {Object.entries(TIERS).map(([k,m],i)=>(
            <div key={k} className={`ezd-tier ezd-fu${i+2}`} style={{ borderTop:`2.5px solid ${m.color}` }}>
              <div style={{ position:'absolute', top:-55, right:-55, width:170, height:170, borderRadius:'50%', background:`radial-gradient(circle,${m.glow} 0%,transparent 70%)`, animation:`orbFloat ${5+i}s ease infinite`, animationDelay:`${i*1.5}s`, pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:0, right:0, width:22, height:22, borderTop:`1px solid ${m.color}18`, borderLeft:`1px solid ${m.color}18` }} />

              <div style={{ position:'relative' }}>
                <span style={{ color:m.color, fontSize:22, display:'block', marginBottom:8 }}>{m.icon}</span>
                <p style={{ ...serif(27,400,C.textPrim), marginBottom:4 }}>{m.label}</p>
                <Label color={m.color} style={{ marginBottom:18 }}>{m.range}</Label>
                <div style={{ height:'0.5px', background:`linear-gradient(to right,${m.color}55,transparent)`, marginBottom:18 }} />
                <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:200, fontSize:11.5, color:C.textMut, lineHeight:1.9, marginTop:0 }}>{m.perks}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:'4rem', paddingTop:'2rem', borderTop:`1px solid rgba(196,154,46,0.14)` }}>
          <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to right,transparent,rgba(196,154,46,0.35))` }} />
          <span style={{ color:C.gold, fontSize:11, opacity:.4 }}>✦</span>
          <Label color="rgba(196,154,46,0.35)" style={{ letterSpacing:'0.28em' }}>L&apos;Éclat d&apos;Azur · Exclusive Collection</Label>
          <span style={{ color:C.gold, fontSize:11, opacity:.4 }}>✦</span>
          <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to left,transparent,rgba(196,154,46,0.35))` }} />
        </div>

      </main>
    </div>
  );
}
