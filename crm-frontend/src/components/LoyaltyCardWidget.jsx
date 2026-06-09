// LoyaltyCardWidget.jsx — L'Éclat d'Azur CRM · Luxury Dark Edition
// Visual loyalty card component — original logic unchanged

import React from 'react';

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
  onyx:     '#0A0604',
};

/* ─── Card Style Configurations by Type (logic unchanged) ──────────────────── */
const CARD_STYLES = {
  SILVER: {
    bg:     'linear-gradient(135deg, #2A2A2A 0%, #3D3D3D 50%, #1A1A1A 100%)',
    accent: C.silver,
    label:  'SILVER',
    icon:   '◈',
    chip:   'rgba(142,155,170,0.35)',
    shine:  'rgba(142,155,170,0.08)',
  },
  GOLD: {
    bg:     'linear-gradient(135deg, #2C2104 0%, #4A3A10 50%, #1C1508 100%)',
    accent: C.gold,
    label:  'GOLD',
    icon:   '◆',
    chip:   'rgba(196,154,46,0.4)',
    shine:  'rgba(196,154,46,0.09)',
  },
  PLATINUM: {
    bg:     'linear-gradient(135deg, #1F1533 0%, #2E1F45 50%, #151028 100%)',
    accent: C.platinum,
    label:  'PLATINUM',
    icon:   '★',
    chip:   'rgba(159,148,216,0.35)',
    shine:  'rgba(159,148,216,0.08)',
  },
};

/* ─── Helper Functions (logic unchanged) ──────────────────────────────────── */
function formatCardNumber(number) {
  if (!number) return 'XXXX-XXXX-XXXX';
  const str = String(number).replace(/\D/g, '');
  const padded = str.padEnd(12, '0');
  return `${padded.slice(0, 4)}-${padded.slice(4, 8)}-${padded.slice(8, 12)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '--/--';
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(2)}`;
}

/* ─── LoyaltyCardWidget Component ──────────────────────────────────────────── */
export default function LoyaltyCardWidget({
  cardNumber,
  customerName,
  cardType = 'SILVER',
  expiryDate,
}) {
  const s = CARD_STYLES[cardType] || CARD_STYLES.SILVER;

  return (
    <div style={{
      position: 'relative',
      width: 380,
      height: 220,
      borderRadius: 4,
      overflow: 'hidden',
      background: s.bg,
      border: `1px solid ${s.accent}35`,
      boxShadow: `0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 ${s.accent}20`,
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>

      {/* ── Diamond pattern watermark ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.06,
        backgroundImage: `repeating-linear-gradient(45deg, ${s.accent} 0, ${s.accent} 1px, transparent 0, transparent 50%)`,
        backgroundSize: '16px 16px',
      }} />

      {/* ── Decorative glows ── */}
      <div style={{
        position: 'absolute',
        right: -30,
        top: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${s.accent}18 0%, transparent 70%)`,
      }} />
      <div style={{
        position: 'absolute',
        left: -20,
        bottom: -20,
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${s.accent}10 0%, transparent 70%)`,
      }} />

      {/* ── Top gold line ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(to right, transparent, ${s.accent}80, transparent)`,
      }} />

      {/* ── Card Content ── */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px 22px',
      }}>

        {/* ── Header: Logo + Tier Badge ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              color: s.accent,
              fontSize: 8,
              fontFamily: "'Jost', sans-serif",
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: 3,
              fontWeight: 300,
            }}>L'Éclat d'Azur</div>
            <div style={{
              color: C.textPrim,
              fontSize: 15,
              letterSpacing: '0.06em',
              fontWeight: 400,
            }}>
              CRM <span style={{ color: s.accent, fontSize: 13 }}>Loyalty</span>
            </div>
          </div>

          {/* Tier badge */}
          <div style={{
            padding: '4px 12px',
            borderRadius: 2,
            border: `1px solid ${s.accent}55`,
            background: `${s.accent}15`,
            color: s.accent,
            fontSize: 9,
            fontFamily: "'Jost', sans-serif",
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 300,
          }}>
            {s.icon} {s.label}
          </div>
        </div>

        {/* ── EMV Chip + Card Number ── */}
        <div>
          {/* EMV Chip */}
          <div style={{
            width: 38,
            height: 28,
            borderRadius: 2,
            border: `1px solid ${s.accent}45`,
            background: `linear-gradient(135deg, ${s.chip}, ${s.accent}10)`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            padding: 4,
            marginBottom: 12,
          }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 1,
                  background: `${s.accent}30`,
                  border: `1px solid ${s.accent}20`,
                }}
              />
            ))}
          </div>

          {/* Card number */}
          <div style={{
            color: C.textPrim,
            fontSize: 17,
            letterSpacing: '0.22em',
            fontFamily: "'Courier New', monospace",
            fontWeight: 400,
            textShadow: `0 0 20px ${s.accent}40`,
          }}>
            {formatCardNumber(cardNumber)}
          </div>
        </div>

        {/* ── Footer: Cardholder + Expiry ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{
              color: s.accent,
              fontSize: 8,
              fontFamily: "'Jost', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: 4,
              fontWeight: 300,
            }}>Card Holder</div>
            <div style={{
              color: C.textPrim,
              fontSize: 13,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}>
              {customerName || 'FULL NAME'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              color: s.accent,
              fontSize: 8,
              fontFamily: "'Jost', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: 4,
              fontWeight: 300,
            }}>Expires</div>
            <div style={{
              color: C.textPrim,
              fontSize: 13,
              letterSpacing: '0.1em',
              fontFamily: "'Courier New', monospace",
              fontWeight: 400,
            }}>
              {formatDate(expiryDate)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&display=swap');
      `}</style>
    </div>
  );
}
