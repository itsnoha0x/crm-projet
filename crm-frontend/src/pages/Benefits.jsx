// Benefits.jsx — L'Éclat d'Azur CRM · Luxury Dark Edition
import React, { useState, useEffect } from 'react';
import { benefitsAPI } from '../services/api';

/* ─── Palette (identique au Dashboard) ──────────────────────────────────────────────── */
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

const DEFAULT_BENEFITS = {
  SILVER: [
    'Complimentary Welcome Amenity upon arrival',
    'Reward Points ×1 on all stays',
    'Room upgrade based on availability',
    'Early check-in (subject to availability)',
    'Dedicated member support line',
  ],
  GOLD: [
    'All Silver privileges included',
    'Reward Points ×2 on all stays',
    'Guaranteed room upgrade',
    'Complimentary Breakfast for two',
    'Spa Credit — 500 MAD per stay',
    'Anniversary night complimentary',
    'Priority Gold concierge line',
  ],
  PLATINUM: [
    'All Gold privileges included',
    'Reward Points ×3 on all stays',
    'VIP Lounge access — all properties',
    'Dedicated Butler Service',
    'Complimentary Airport Transfer',
    'Suite Night Award — 4× per year',
    'Exclusive member rate on all bookings',
    'Complimentary Spa treatment',
    'Personal travel curator',
  ],
};

const TIERS = {
  SILVER:   { icon: '◈', label: 'Silver',   points: 'Up to 999 pts',     color: C.silver,   glow:'rgba(142,155,170,0.15)', highlight: false },
  GOLD:     { icon: '◆', label: 'Gold',     points: '1,000 – 4,999 pts', color: C.gold,     glow: C.goldGlow, highlight: true  },
  PLATINUM: { icon: '★', label: 'Platinum', points: '5,000+ pts',        color: C.platinum, glow:'rgba(159,148,216,0.15)', highlight: false },
};

/* ─── Styles ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  .ezb * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes lineDraw {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes shimmerLoad {
    0%,100% { opacity:.08; } 50% { opacity:.22; }
  }
  @keyframes orbFloat {
    0%,100% { transform: scale(1) translateY(0); opacity: .35; }
    50%      { transform: scale(1.1) translateY(-8px); opacity: .55; }
  }

  /* ── Animation classes ── */
  .ezb-fu1 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .06s both; }
  .ezb-fu2 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .13s both; }
  .ezb-fu3 { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) .20s both; }
  .ezb-si0 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .00s both; }
  .ezb-si1 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .07s both; }
  .ezb-si2 { animation: slideIn .48s cubic-bezier(.22,1,.36,1) .14s both; }
  .ezb-shimmer { animation: shimmerLoad 2s ease infinite; }

  /* ── Benefit Card ── */
  .ezb-card {
    background: #1F1209;
    border: 1px solid rgba(196,154,42,0.16);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ezb-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(196,154,46,0.45), transparent);
  }
  .ezb-card:hover {
    transform: translateY(-5px);
    background: #251608;
    border-color: rgba(196,154,46,0.36);
    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,154,46,0.12);
  }

  .ezb-card-header {
    background: rgba(196,154,46,0.06);
    border-bottom: 1px solid rgba(196,154,46,0.15);
    padding: 1.75rem 1.5rem 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .ezb-card-icon {
    font-size: 26px;
    margin-bottom: 8px;
    line-height: 1;
  }

  .ezb-card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24px;
    font-weight: 400;
    color: #F0E6D0;
    margin-bottom: 4px;
  }

  .ezb-card-points {
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 300;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .ezb-card-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ezb-card-highlight {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 3px 10px;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 300;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .ezb-card-content {
    flex: 1;
    padding: 1.5rem;
  }

  .ezb-benefits-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ezb-benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .ezb-benefit-icon {
    font-size: 12px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .ezb-benefit-text {
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    color: #B09070;
  }

  .ezb-card-footer {
    border-top: 1px solid rgba(196,154,46,0.12);
    padding: 1.25rem 1.5rem;
  }

  .ezb-card-footer-btn {
    text-align: center;
    padding: 8px;
    border-radius: 2px;
    border: 1px solid rgba(196,154,42,0.30);
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: default;
  }

  /* ── Table ── */
  .ezb-table {
    width: 100%;
    border-collapse: collapse;
  }

  .ezb-table thead tr {
    background: rgba(10,6,4,0.4);
    border-bottom: 1px solid rgba(196,154,46,0.2);
  }

  .ezb-table thead th {
    padding: 14px 24px;
    text-align: left;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(176,144,112,0.65);
  }

  .ezb-table thead th:not(:first-child) {
    text-align: center;
  }

  .ezb-table tbody tr {
    border-bottom: 1px solid rgba(196,154,42,0.08);
    transition: background 0.18s ease;
  }

  .ezb-table tbody tr:hover {
    background: rgba(196,154,46,0.04);
  }

  .ezb-table tbody td {
    padding: 13px 24px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #B09070;
  }

  .ezb-table tbody td:not(:first-child) {
    text-align: center;
  }

  .ezb-shimmer-row {
    height: 16px;
    background: rgba(196,154,46,0.07);
    border-radius: 2px;
  }

  @media (max-width: 900px) {
    .ezb-grid { grid-template-columns: 1fr !important; }
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

function BenefitCard({ tier, benefits, loading }) {
  const cfg = TIERS[tier];
  return (
    <div className="ezb-card" style={{ borderTop: `2.5px solid ${cfg.color}` }}>
      {cfg.highlight && (
        <div className="ezb-card-highlight" style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}40`, color: cfg.color }}>
          ◆ Most Popular
        </div>
      )}

      {/* Glow orb */}
      <div style={{ 
        position:'absolute', 
        top:-55, 
        right:-55, 
        width:170, 
        height:170, 
        borderRadius:'50%', 
        background:`radial-gradient(circle,${cfg.glow} 0%,transparent 70%)`, 
        animation:`orbFloat 7s ease infinite`,
        pointerEvents:'none' 
      }} />

      {/* Header */}
      <div className="ezb-card-header">
        <p className="ezb-card-icon" style={{ color: cfg.color }}>{cfg.icon}</p>
        <h2 className="ezb-card-title">{cfg.label}</h2>
        <p className="ezb-card-points" style={{ color: cfg.color }}>{cfg.points}</p>
        <span className="ezb-card-badge" style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
          {cfg.label} Membership
        </span>
      </div>

      {/* Content */}
      <div className="ezb-card-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="ezb-shimmer-row" />
            ))}
          </div>
        ) : (
          <ul className="ezb-benefits-list">
            {benefits.map((benefit, i) => {
              const text = typeof benefit === 'string' ? benefit : benefit.description || benefit.title || JSON.stringify(benefit);
              const isInherited = text.toLowerCase().startsWith('all ');
              return (
                <li key={i} className="ezb-benefit-item">
                  <span className="ezb-benefit-icon" style={{ color: isInherited ? C.textDim : cfg.color }}>
                    {isInherited ? '↑' : '✓'}
                  </span>
                  <span className="ezb-benefit-text" style={{ color: isInherited ? C.textDim : C.textSec, fontStyle: isInherited ? 'italic' : 'normal' }}>
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="ezb-card-footer">
        <div className="ezb-card-footer-btn" style={{ color: cfg.color, border: `1px solid ${cfg.color}35` }}>
          {cfg.icon} {cfg.label} Membership
        </div>
      </div>
    </div>
  );
}

/* ─── Benefits Page ─────────────────────────────────────────────── */
export default function Benefits() {
  const [benefits, setBenefits] = useState(DEFAULT_BENEFITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, go, p] = await Promise.allSettled([
          benefitsAPI.getByCardType('SILVER'),
          benefitsAPI.getByCardType('GOLD'),
          benefitsAPI.getByCardType('PLATINUM'),
        ]);
        setBenefits({
          SILVER:   s.status === 'fulfilled' && s.value.data?.length ? s.value.data : DEFAULT_BENEFITS.SILVER,
          GOLD:     go.status === 'fulfilled' && go.value.data?.length ? go.value.data : DEFAULT_BENEFITS.GOLD,
          PLATINUM: p.status === 'fulfilled' && p.value.data?.length ? p.value.data : DEFAULT_BENEFITS.PLATINUM,
        });
      } catch (e) {
        console.warn('Utilisation des avantages par défaut:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const compareRows = [
    { label: 'Points multiplier',   values: ['×1', '×2', '×3'] },
    { label: 'Breakfast included',  values: ['—', '✓ For two', '✓ Gourmet'] },
    { label: 'Spa access',          values: ['—', '500 MAD credit', 'Full access'] },
    { label: 'Room upgrade',        values: ['On availability', 'Guaranteed', 'Suite award'] },
    { label: 'Concierge service',   values: ['Standard', 'Priority Gold', 'Personal butler'] },
    { label: 'Airport transfer',    values: ['—', '—', '✓ Complimentary'] },
  ];

  return (
    <div className="ezb" style={{ minHeight:'100vh', background:C.bg, color:C.textPrim }}>
      <style>{STYLES}</style>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth:1240, margin:'0 auto', padding:'3.5rem 2.5rem 5rem' }}>

        {/* ── Header ── */}
        <div className="ezb-fu1" style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <Label color={C.gold} style={{ marginBottom:12 }}>LuxStay Rewards Programme</Label>
          <h1 style={{ ...serif(48, 400, '#FFFFFF'), marginBottom:16 }}>
            Exclusive <span style={{ fontStyle:'italic', fontWeight:300 }}>Member Benefits</span>
          </h1>
          <p style={{ ...jost(11, 200, 'rgba(240,225,200,0.58)'), maxWidth:600, margin:'0 auto', lineHeight:1.6 }}>
            Discover the privileges reserved for each membership tier — curated experiences, dedicated concierge, and exclusive rates
          </p>
        </div>

        <GoldDivider label="Membership Tiers" />

        {/* ── Cards Grid ── */}
        <div className="ezb-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, alignItems:'start', marginBottom:'3.2rem' }}>
          {['SILVER', 'GOLD', 'PLATINUM'].map((tier, i) => (
            <div key={tier} className={`ezb-fu${i+1}`}>
              <BenefitCard tier={tier} benefits={benefits[tier]} loading={loading} />
            </div>
          ))}
        </div>

        <GoldDivider label="Quick Comparison" />

        {/* ── Comparison Table ── */}
        <div style={{ background:C.bgPanel, border:`1px solid ${C.border}`, borderRadius:2, overflow:'hidden' }}>
          <div style={{ padding:'1.25rem 1.75rem', borderBottom:`1px solid ${C.border}` }}>
            <Label color={C.gold} style={{ marginBottom:0 }}>Feature Comparison</Label>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="ezb-table">
              <thead>
                <tr>
                  <th>Benefit</th>
                  {['SILVER', 'GOLD', 'PLATINUM'].map((tier) => (
                    <th key={tier}>
                      <span style={{ ...serif(14, 400, TIERS[tier].color) }}>
                        {TIERS[tier].icon} {TIERS[tier].label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} style={{ color: (v === '—') ? C.textDim : [C.silver, C.gold, C.platinum][i] }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:'4rem', paddingTop:'2rem', borderTop:`1px solid ${C.border}` }}>
          <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to right,transparent,${C.border})` }} />
          <span style={{ color:C.gold, fontSize:11, opacity:.4 }}>✦</span>
          <Label color={C.textDim} style={{ letterSpacing:'0.28em' }}>L&apos;Éclat d&apos;Azur · Exclusive Collection</Label>
          <span style={{ color:C.gold, fontSize:11, opacity:.4 }}>✦</span>
          <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to left,transparent,${C.border})` }} />
        </div>

      </main>
    </div>
  );
}


