// CustomerDashboard.jsx — LuxStay Rewards · Luxury Dark Edition (aligned with Dashboard.jsx)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { benefitsAPI, loyaltyAPI, pointsAPI } from '../services/api';

/* ─── Palette (identique à Dashboard.jsx) ───────────────────────────────── */
const C = {
  bg:        '#100B06',
  bgLayer:   '#180E08',
  bgCard:    '#1F1209',
  bgCardHov: '#251608',
  bgPanel:   '#1A0F08',
  border:    'rgba(184,137,42,0.18)',
  borderHov: 'rgba(184,137,42,0.42)',
  borderSub: 'rgba(184,137,42,0.10)',
  gold:      '#C49A2E',
  goldBrt:   '#DDB84F',
  goldLight: '#EDD080',
  goldPale:  '#F5E8B4',
  goldGlow:  'rgba(196,154,46,0.25)',
  goldMuted: 'rgba(196,154,46,0.12)',
  textPrim:  '#F0E6D0',
  textSec:   '#B09070',
  textMut:   'rgba(176,144,112,0.55)',
  textDim:   'rgba(176,144,112,0.32)',
  silver:    '#8E9BAA',
  platinum:  '#9F94D8',
  green:     '#4ade80',
  teal:      '#5DCAA5',
  red:       '#E24444',
  onyx:      '#0A0604',
};

const TIER_META = {
  SILVER:   { accent: C.silver,   icon: '◈', next: 1000,  glow: 'rgba(142,155,170,0.14)' },
  GOLD:     { accent: C.gold,     icon: '◆', next: 5000,  glow: C.goldGlow               },
  PLATINUM: { accent: C.platinum, icon: '★', next: null,  glow: 'rgba(159,148,216,0.14)' },
};

/* ─── Global styles ─────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  .lscd * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes lineDraw { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
  @keyframes orbFloat { 0%,100%{transform:scale(1) translateY(0);opacity:.3} 50%{transform:scale(1.08) translateY(-6px);opacity:.48} }
  @keyframes shimmerLoad { 0%,100%{opacity:.07} 50%{opacity:.2} }
  @keyframes progressFill { from{width:0%} to{width:var(--target-width,60%)} }
  @keyframes borderPulse  { 0%,100%{border-color:rgba(196,154,46,0.15)} 50%{border-color:rgba(196,154,46,0.5)} }
  @keyframes dotPulse     { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(74,222,128,0.6)} 50%{opacity:.5;box-shadow:0 0 12px rgba(74,222,128,0.9)} }

  .lscd-fu1 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .05s both; }
  .lscd-fu2 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .12s both; }
  .lscd-fu3 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .19s both; }
  .lscd-fu4 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .26s both; }
  .lscd-fu5 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .33s both; }

  /* Panel */
  .lscd-panel {
    background: #1A0F08;
    border: 1px solid rgba(196,154,46,0.14);
    border-radius: 2px;
    padding: 1.6rem;
    position: relative;
    overflow: hidden;
  }
  .lscd-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(196,154,46,0.42), transparent);
  }

  /* Tier card */
  .lscd-tier {
    background: #1F1209;
    border: 1px solid rgba(196,154,46,0.13);
    border-radius: 2px;
    padding: 1.7rem 1.5rem;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, background .3s ease;
  }
  .lscd-tier:hover {
    transform: translateY(-4px);
    background: #251608;
    box-shadow: 0 16px 48px rgba(0,0,0,0.55);
  }

  /* Transaction row */
  .lscd-tx-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 10px;
    border-bottom: 1px solid rgba(196,154,46,0.08);
    border-radius: 1px; cursor: default;
    transition: background .18s ease, padding-left .2s ease;
  }
  .lscd-tx-row:last-child { border-bottom: none; }
  .lscd-tx-row:hover { background: rgba(196,154,46,0.05); padding-left: 14px; }

  /* KPI pill */
  .lscd-kpi {
    padding: 12px 20px;
    background: rgba(10,6,4,0.55);
    border: 0.5px solid rgba(196,154,46,0.26);
    border-left: 2px solid #C49A2E;
    border-radius: 2px;
    min-width: 154px;
    transition: background .25s, border-left-color .25s, transform .25s;
  }
  .lscd-kpi:hover {
    background: rgba(10,6,4,0.7);
    border-left-color: #EDD080;
    transform: translateY(-2px);
  }

  /* Primary button (gold) */
  .lscd-btn-gold {
    font-family: 'Jost', sans-serif; font-weight: 400; font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 9px 20px; border-radius: 2px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #C49A2E 0%, #DDB84F 100%);
    color: #0A0604;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .lscd-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(196,154,46,0.45); }
  .lscd-btn-gold:active { transform: scale(.97); }

  /* Teal button (simulator) */
  .lscd-btn-teal {
    font-family: 'Jost', sans-serif; font-weight: 400; font-size: 9px;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 9px 20px; border-radius: 2px;
    border: 1px solid rgba(93,202,165,0.35);
    background: rgba(93,202,165,0.08); color: #5DCAA5; cursor: pointer;
    transition: background .2s ease, transform .2s ease;
  }
  .lscd-btn-teal:hover { background: rgba(93,202,165,0.15); transform: translateY(-1px); }

  /* Teal submit button */
  .lscd-btn-teal-submit {
    font-family: 'Jost', sans-serif; font-weight: 400; font-size: 9px;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 10px; border-radius: 2px; width: 100%;
    border: 1px solid rgba(93,202,165,0.35);
    background: rgba(93,202,165,0.12); color: #5DCAA5; cursor: pointer;
    transition: background .2s ease, transform .2s ease;
  }
  .lscd-btn-teal-submit:hover { background: rgba(93,202,165,0.2); }

  /* Input */
  .lscd-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(196,154,46,0.28);
    border-radius: 2px; padding: 10px 14px;
    color: #F0E6D0; font-size: 14px;
    font-family: 'Jost', sans-serif;
    outline: none; width: 100%;
    transition: border-color .2s ease;
  }
  .lscd-input:focus { border-color: rgba(196,154,46,0.6); }

  /* Progress */
  .lscd-progress-track {
    height: 3px; border-radius: 2px;
    background: rgba(196,154,46,0.12);
    overflow: hidden; margin-top: 10px;
  }
  .lscd-progress-bar {
    height: 100%; border-radius: 2px;
    background: linear-gradient(to right, #C49A2E, #EDD080);
    animation: progressFill 1.1s cubic-bezier(.22,1,.36,1) .5s both;
  }

  /* Scrollbar */
  .lscd ::-webkit-scrollbar { width: 4px; }
  .lscd ::-webkit-scrollbar-track { background: #100B06; }
  .lscd ::-webkit-scrollbar-thumb { background: rgba(196,154,46,0.28); border-radius: 2px; }

  @media (max-width: 680px) {
    .lscd-grid2 { grid-template-columns: 1fr !important; }
    .lscd-grid3 { grid-template-columns: 1fr !important; }
  }
`;

/* ─── Typography helpers ────────────────────────────────────────────────── */
const serif = (sz, wt = 400, col = C.textPrim, x = {}) => ({
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: sz, fontWeight: wt, color: col, ...x,
});
const jost = (sz, wt = 300, col = C.textSec, x = {}) => ({
  fontFamily: "'Jost', sans-serif",
  fontSize: sz, fontWeight: wt,
  letterSpacing: '0.2em', textTransform: 'uppercase', color: col, ...x,
});

/* ─── Atoms ─────────────────────────────────────────────────────────────── */
function Label({ children, color = C.textSec, style = {} }) {
  return <p style={{ ...jost(9, 300, color), margin: 0, ...style }}>{children}</p>;
}

function GoldDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '2.8rem 0 1.8rem' }}>
      <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(196,154,46,0.38))', animation: 'lineDraw .9s ease both' }} />
      <span style={{ color: C.gold, fontSize: 9, opacity: 0.55 }}>✦</span>
      {label && <Label color={C.gold} style={{ letterSpacing: '0.32em' }}>{label}</Label>}
      <span style={{ color: C.gold, fontSize: 9, opacity: 0.55 }}>✦</span>
      <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(196,154,46,0.38))', animation: 'lineDraw .9s ease both' }} />
    </div>
  );
}

function MiniField({ label, value, accent }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 2, padding: '11px 13px', border: `1px solid ${accent}18` }}>
      <p style={{ ...jost(9, 300, C.textSec), letterSpacing: '0.1em', marginBottom: 4 }}>{label}</p>
      <p style={{ ...serif(14, 400, C.textPrim) }}>{value || '—'}</p>
    </div>
  );
}

/* ─── MembershipProgress ────────────────────────────────────────────────── */
function MembershipProgress({ tier, currentPoints, next, accent }) {
  if (!next) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: accent, fontSize: 16 }}>★</span>
        <span style={{ ...jost(11, 300, accent) }}>Maximum tier reached — Platinum Elite</span>
      </div>
    );
  }
  const base      = tier === 'GOLD' ? 1000 : 0;
  const span      = next - base;
  const pct       = Math.min(100, Math.round((Math.max(0, currentPoints - base) / span) * 100));
  const remaining = Math.max(0, next - currentPoints).toLocaleString('fr-FR');
  const nextTier  = tier === 'SILVER' ? 'Gold' : 'Platinum';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ ...jost(11, 300, C.textSec) }}>
          {currentPoints.toLocaleString('fr-FR')} pts toward {nextTier}
        </span>
        <span style={{ ...jost(11, 300, accent) }}>{pct}%</span>
      </div>
      <div className="lscd-progress-track">
        <div className="lscd-progress-bar" style={{ '--target-width': `${pct}%` }} />
      </div>
      <p style={{ ...jost(10, 200, C.textDim), marginTop: 6 }}>
        {remaining} points to {nextTier} membership
      </p>
    </div>
  );
}

/* ─── TierCards (overview at bottom) ───────────────────────────────────── */
function TierCards({ activeTier }) {
  const tiers = [
    { key: 'SILVER',   ...TIER_META.SILVER,   label: 'Silver',   range: 'Up to 999 pts',       perks: 'Welcome Amenity · Room Upgrade · Early Check-in' },
    { key: 'GOLD',     ...TIER_META.GOLD,      label: 'Gold',     range: '1 000 – 4 999 pts',   perks: 'Complimentary Breakfast · Guaranteed Upgrade · Spa Credit' },
    { key: 'PLATINUM', ...TIER_META.PLATINUM,  label: 'Platinum', range: '5 000+ pts',           perks: 'VIP Lounge · Butler Service · Suite Night Award' },
  ];
  return (
    <div className="lscd-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {tiers.map((t, i) => (
        <div key={t.key} className="lscd-tier" style={{ borderTop: `2.5px solid ${t.accent}`, animation: t.key === activeTier ? 'borderPulse 3s ease infinite' : 'none' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: `radial-gradient(circle,${t.glow} 0%,transparent 70%)`, animation: `orbFloat ${5 + i}s ease infinite`, animationDelay: `${i * 1.5}s`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <span style={{ color: t.accent, fontSize: 20, display: 'block', marginBottom: 7 }}>{t.icon}</span>
            <p style={{ ...serif(22, 400, C.textPrim), marginBottom: 3 }}>{t.label}</p>
            <Label color={t.accent} style={{ marginBottom: 14 }}>{t.range}</Label>
            <div style={{ height: '0.5px', background: `linear-gradient(to right, ${t.accent}50, transparent)`, marginBottom: 14 }} />
            {t.key === activeTier && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 2, marginBottom: 14, background: `${t.accent}0e`, border: `0.5px solid ${t.accent}28` }}>
                <Label color={t.accent}>Current tier</Label>
              </div>
            )}
            <div className="lscd-progress-track">
              <div className="lscd-progress-bar" style={{ '--target-width': t.key === activeTier ? '69%' : t.key === 'SILVER' ? '100%' : '0%', background: `linear-gradient(to right, ${t.accent}99, ${t.accent})` }} />
            </div>
            <p style={{ ...jost(11, 200, C.textMut), lineHeight: 1.9, marginTop: 14, letterSpacing: '0.04em', textTransform: 'none' }}>{t.perks}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function CustomerDashboard({ addToast }) {
  const { customerId } = useParams();
  const [card, setCard]       = useState(null);
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reservationForm, setReservationForm] = useState({ nbNuits: 1, prixNuitEuros: 1200 });

  const tier         = card?.cardType || 'SILVER';
  const meta         = TIER_META[tier] || TIER_META.SILVER;
  const currentPoints = balance?.currentBalance || 0;

  /* ── logique inchangée ─────────────────────────────────────────────────── */
  const load = async () => {
    setLoading(true);
    try {
      const [cardRes, balanceRes, historyRes] = await Promise.all([
        loyaltyAPI.getCardByCustomer(customerId),
        pointsAPI.getBalance(customerId),
        pointsAPI.getHistory(customerId, 5),
      ]);
      setCard(cardRes.data);
      setBalance(balanceRes.data);
      setHistory((historyRes.data || []).slice(0, 5));
      if (cardRes.data?.cardType) {
        const benefitsRes = await benefitsAPI.getByCardType(cardRes.data.cardType);
        setBenefits(benefitsRes.data || []);
      }
    } catch {
      addToast?.('Error loading guest dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (customerId) load(); }, [customerId]);

  const simulateReservation = async (e) => {
    e.preventDefault();
    try {
      await pointsAPI.simulateReservation({
        customerId,
        nbNuits:         Number(reservationForm.nbNuits),
        prixNuitEuros:   Number(reservationForm.prixNuitEuros),
        typeChambres:    'DOUBLE',
        dateArrivee:     new Date().toISOString().slice(0, 10),
      });
      addToast?.('Stay simulated — reward points credited', 'success');
      setShowForm(false);
      await load();
    } catch {
      addToast?.('Stay simulation failed', 'error');
    }
  };
  /* ── fin logique ───────────────────────────────────────────────────────── */

  /* ── Loading screen ────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${C.gold}`, borderTopColor: 'transparent', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="lscd" style={{ minHeight: '100vh', background: C.bg, color: C.textPrim, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <header style={{ position: 'relative', overflow: 'hidden', background: C.bgLayer, borderBottom: `1px solid rgba(196,154,46,0.18)` }}>
        {/* Decorative layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(196,154,46,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.02, backgroundImage: 'repeating-linear-gradient(45deg,#C49A2E 0,#C49A2E 1px,transparent 0,transparent 50%)', backgroundSize: '18px 18px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '-6%', top: '-40%', width: '42%', height: '200%', background: 'radial-gradient(ellipse, rgba(196,154,46,0.11) 0%, transparent 65%)', animation: 'orbFloat 7s ease infinite', pointerEvents: 'none' }} />
        {/* Corner ornament */}
        <div style={{ position: 'absolute', top: 18, right: 22, opacity: 0.22 }}>
          <div style={{ width: 58, height: 58, border: `1px solid ${C.goldLight}` }} />
          <div style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, border: `0.5px solid ${C.goldLight}` }} />
        </div>
        {/* Gold bottom line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, rgba(196,154,46,0.65) 25%, rgba(237,208,128,0.85) 50%, rgba(196,154,46,0.65) 75%, transparent)' }} />

        <div style={{ position: 'relative', maxWidth: 920, margin: '0 auto', padding: '2.8rem 2.5rem 2.4rem' }}>
          {/* Badge */}
          <div className="lscd-fu1" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 14, padding: '4px 16px', border: '0.5px solid rgba(196,154,46,0.34)', background: 'rgba(196,154,46,0.09)', backdropFilter: 'blur(8px)' }}>
            <span style={{ color: C.goldBrt, fontSize: 9 }}>✦</span>
            <Label color={C.goldPale} style={{ letterSpacing: '0.34em' }}>LuxStay Rewards · Guest Portal</Label>
            <span style={{ color: C.goldBrt, fontSize: 9 }}>✦</span>
          </div>

          {/* Title */}
          <h1 className="lscd-fu2" style={{ ...serif(52, 300, '#FFFFFF'), lineHeight: 1.05, letterSpacing: '0.01em', marginBottom: 8 }}>
            Guest{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 200 }}>Dashboard</span>
          </h1>

          {/* Date */}
          <div className="lscd-fu3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 34, height: 1, background: `linear-gradient(to right, ${C.goldBrt}, transparent)` }} />
            <p style={{ ...jost(11, 200, 'rgba(240,225,200,0.52)'), letterSpacing: '0.07em', textTransform: 'none' }}>{today}</p>
          </div>

          {/* KPI pills */}
          <div className="lscd-fu4" style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {[
              { label: 'Current Points',   value: currentPoints.toLocaleString('fr-FR') },
              { label: 'Membership Tier',  value: <span style={{ color: meta.accent }}>{meta.icon} {tier}</span> },
              { label: 'Card Number',      value: card?.cardNumber || '—' },
            ].map((k, i) => (
              <div key={i} className="lscd-kpi">
                <Label color="rgba(240,225,200,0.46)" style={{ marginBottom: 6 }}>{k.label}</Label>
                <p style={{ ...serif(26, 300, '#FFFFFF'), lineHeight: 1 }}>{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 2.5rem 5rem' }}>

        <GoldDivider label="Membership Status" />

        {/* Membership panel */}
        <div className="lscd-panel lscd-fu2" style={{ borderColor: `${meta.accent}25` }}>
          <div className="lscd-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Left: tier + progress */}
            <div>
              <Label color={C.gold} style={{ marginBottom: 12 }}>Membership Tier</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ color: meta.accent, fontSize: 24 }}>{meta.icon}</span>
                <span style={{ ...serif(24, 400, C.textPrim) }}>{tier} Member</span>
              </div>
              <MembershipProgress tier={tier} currentPoints={currentPoints} next={meta.next} accent={meta.accent} />
            </div>
            {/* Right: card details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Card number',     card?.cardNumber],
                ['Membership tier', card?.cardType],
                ['Status',          card?.status],
                ['Issue date',      card?.issueDate],
              ].map(([label, val]) => (
                <MiniField key={label} label={label} value={val} accent={meta.accent} />
              ))}
            </div>
          </div>
        </div>

        <GoldDivider label="Analytics" />

        {/* Transactions + Benefits */}
        <div className="lscd-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>

          {/* Transactions */}
          <div className="lscd-panel lscd-fu3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <div>
                <Label color={C.gold} style={{ marginBottom: 5 }}>Recent Transactions</Label>
                <p style={{ ...jost(12, 200, C.textMut), textTransform: 'none', letterSpacing: 0 }}>Latest reward activity</p>
              </div>
              {/* Live dot */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: C.green, animation: 'dotPulse 2s ease infinite' }} />
                <Label color={C.green}>Live</Label>
              </span>
            </div>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <p style={{ ...serif(30, 300, C.textSec), marginBottom: 8 }}>◈</p>
                <Label>No transactions recorded</Label>
              </div>
            ) : (
              history.map((tx) => {
                const isPos = tx.transactionType === 'EARNED' || tx.transactionType === 'BONUS' || tx.transactionType === 'ADJUSTMENT';
                return (
                  <div key={tx.id} className="lscd-tx-row">
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPos ? 'rgba(93,202,165,0.1)' : 'rgba(226,68,68,0.08)', border: `0.5px solid ${isPos ? 'rgba(93,202,165,0.35)' : 'rgba(226,68,68,0.35)'}`, color: isPos ? C.teal : C.red, fontFamily: 'Jost, sans-serif', fontSize: 13 }}>
                      {isPos ? '+' : '−'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...serif(14, 400, C.textPrim), marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.transactionType}</p>
                      <Label color={C.textDim}>{tx.reference || '—'}</Label>
                    </div>
                    <span style={{ ...serif(15, 400, isPos ? C.teal : C.red), flexShrink: 0 }}>
                      {isPos ? '+' : '−'}{Math.abs(tx.points)} pts
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Benefits */}
          <div className="lscd-panel lscd-fu4">
            <Label color={C.gold} style={{ marginBottom: 5 }}>Active Benefits</Label>
            <p style={{ ...jost(12, 200, C.textMut), textTransform: 'none', letterSpacing: 0, marginBottom: '1.4rem' }}>{tier} tier privileges</p>

            {benefits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ ...serif(30, 300, C.textSec), marginBottom: 8 }}>◈</p>
                <Label>No benefits found</Label>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {benefits.map((b) => (
                  <div key={b.id} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                    <span style={{ color: meta.accent, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <div>
                      <p style={{ ...serif(14, 400, C.textPrim), marginBottom: 2 }}>{b.title}</p>
                      <p style={{ ...jost(10, 200, C.textMut), textTransform: 'none', letterSpacing: 0 }}>{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stay Simulator */}
        <GoldDivider label="Stay Simulator" />

        <div className="lscd-panel lscd-fu5" style={{ borderColor: 'rgba(93,202,165,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: showForm ? '1.4rem' : 0 }}>
            <div>
              <Label color={C.teal} style={{ marginBottom: 5 }}>Stay Simulator</Label>
              <p style={{ ...jost(12, 200, C.textMut), textTransform: 'none', letterSpacing: 0 }}>
                Estimate reward points for your next stay
              </p>
            </div>
            <button
              type="button"
              className="lscd-btn-teal"
              onClick={() => setShowForm(v => !v)}
            >
              {showForm ? '✕ Cancel simulation' : '✦ Simulate a stay'}
            </button>
          </div>

          {showForm && (
            <div style={{ marginTop: 16 }}>
              <div className="lscd-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <Label style={{ marginBottom: 6 }}>Nights</Label>
                  <input
                    className="lscd-input"
                    type="number" min="1"
                    value={reservationForm.nbNuits}
                    onChange={(e) => setReservationForm(f => ({ ...f, nbNuits: e.target.value }))}
                  />
                </div>
                <div>
                  <Label style={{ marginBottom: 6 }}>Rate per night (MAD)</Label>
                  <input
                    className="lscd-input"
                    type="number" min="1"
                    value={reservationForm.prixNuitEuros}
                    onChange={(e) => setReservationForm(f => ({ ...f, prixNuitEuros: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="button"
                className="lscd-btn-teal-submit"
                onClick={simulateReservation}
              >
                ✦ Credit reward points
              </button>
            </div>
          )}
        </div>

        {/* Tier overview */}
        <GoldDivider label="Membership Tiers" />
        <TierCards activeTier={tier} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '4rem', paddingTop: '1.8rem', borderTop: '1px solid rgba(196,154,46,0.14)' }}>
          <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(196,154,46,0.32))' }} />
          <span style={{ color: C.gold, fontSize: 10, opacity: 0.4 }}>✦</span>
          <Label color="rgba(196,154,46,0.35)" style={{ letterSpacing: '0.28em' }}>LuxStay Rewards · Exclusive Collection</Label>
          <span style={{ color: C.gold, fontSize: 10, opacity: 0.4 }}>✦</span>
          <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(196,154,46,0.32))' }} />
        </div>

      </main>
    </div>
  );
}