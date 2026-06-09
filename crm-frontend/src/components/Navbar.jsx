// Navbar.jsx — L'Éclat d'Azur CRM · Aligned with Dashboard Dark Theme
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Palette — miroir exact du Dashboard ─────────────────────── */
const C = {
  bg:       '#100B06',
  onyx:     '#0A0604',
  bgCard:   '#1F1209',
  gold:     '#C49A2E',
  goldBrt:  '#DDB84F',
  goldLight:'#EDD080',
  goldPale: '#F5E8B4',
  textPrim: '#F0E6D0',
  textSec:  '#B09070',
  textMut:  'rgba(176,144,112,0.55)',
  border:   'rgba(196,154,46,0.18)',
  borderHov:'rgba(196,154,46,0.42)',
};

const NAV_ITEMS = [
  { path: '/',          label: 'Dashboard',    icon: '◆' },
  { path: '/customers', label: 'Clients',      icon: '◈' },
  { path: '/loyalty',   label: 'Loyalty Cards',icon: '◇' },
  { path: '/points',    label: 'Points',       icon: '◈' },
  { path: '/benefits',  label: 'Benefits',     icon: '★' },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,300&family=Jost:wght@200;300;400;500&display=swap');

  @keyframes navScan {
    0%   { top: -1px; opacity: 0; }
    5%   { opacity: .45; }
    95%  { opacity: .45; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes logoGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(196,154,46,0); }
    50%      { box-shadow: 0 0 22px 5px rgba(196,154,46,0.28); }
  }
  @keyframes shimmerText {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes mobileSlide {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes activeUnderline {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .lux-shimmer {
    background: linear-gradient(90deg, #C49A2E 0%, #EDD080 45%, #C49A2E 80%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerText 4s linear infinite;
  }

  .lux-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(196,154,46,0.35), transparent);
    animation: navScan 6s linear infinite;
    pointer-events: none;
  }

  .lux-logo-icon {
    animation: logoGlow 3.5s ease infinite;
  }

  .lux-nav-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border-radius: 2px;
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    font-size: 9.5px;
    font-weight: 400;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    white-space: nowrap;
    color: rgba(176,144,112,0.65);
    border: 1px solid transparent;
    position: relative;
    transition: color .22s ease, background .22s ease, border-color .22s ease;
  }
  .lux-nav-link::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 14px; right: 14px;
    height: 1px;
    background: #C49A2E;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .28s ease;
  }
  .lux-nav-link:hover {
    color: #F0E6D0;
    background: rgba(196,154,46,0.06);
  }
  .lux-nav-link:hover::after { transform: scaleX(1); }
  .lux-nav-link.active {
    color: #EDD080;
    background: rgba(196,154,46,0.1);
    border-color: rgba(196,154,46,0.28);
  }
  .lux-nav-link.active::after { transform: scaleX(1); background: #EDD080; }

  .lux-logout {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 16px; border-radius: 2px; cursor: pointer;
    border: 1px solid rgba(196,154,46,0.28);
    background: transparent;
    color: rgba(176,144,112,0.7);
    font-family: 'Jost', sans-serif;
    font-size: 9px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    transition: all .2s ease;
  }
  .lux-logout:hover {
    background: rgba(196,154,46,0.12);
    border-color: rgba(196,154,46,0.55);
    color: #EDD080;
  }

  .lux-burger {
    display: none;
    width: 36px; height: 36px; border-radius: 2px;
    border: 1px solid rgba(196,154,46,0.28);
    background: transparent; cursor: pointer;
    color: #B09070; font-size: 16px;
    align-items: center; justify-content: center;
    transition: all .2s;
  }
  .lux-burger:hover { background: rgba(196,154,46,0.1); color: #EDD080; }

  .lux-mobile-menu {
    animation: mobileSlide .25s ease both;
  }

  .lux-mobile-link {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 2px;
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    font-size: 10px; font-weight: 300;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(176,144,112,0.7);
    border: 1px solid transparent;
    transition: all .18s ease;
  }
  .lux-mobile-link:hover { background: rgba(196,154,46,0.07); color: #F0E6D0; }
  .lux-mobile-link.active { color: #EDD080; border-color: rgba(196,154,46,0.25); background: rgba(196,154,46,0.09); }

  @media (max-width: 860px) {
    .lux-desktop-nav  { display: none !important; }
    .lux-desktop-user { display: none !important; }
    .lux-burger       { display: flex !important; }
  }
`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth() ?? {};
  const username = user?.username;
  const location = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: C.onyx,
      borderBottom: `1px solid ${C.border}`,
      fontFamily: "'Jost', sans-serif",
    }}>
      <style>{STYLES}</style>
      <div className="lux-scan" />

      {/* ── Diamond pattern ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .022,
        backgroundImage: 'repeating-linear-gradient(45deg,#C49A2E 0,#C49A2E 1px,transparent 0,transparent 50%)',
        backgroundSize: '18px 18px',
      }} />

      {/* ── Main bar ── */}
      <div style={{
        position: 'relative', maxWidth: 1240, margin: '0 auto',
        padding: '0 2.5rem', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0, paddingRight: 40, borderRight: `1px solid ${C.border}`, marginRight: 36 }}>
          <div className="lux-logo-icon" style={{
            width: 34, height: 34, borderRadius: 2,
            background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldBrt} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: C.onyx, fontWeight: 700, flexShrink: 0,
          }}>✦</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 300, letterSpacing: '0.34em', textTransform: 'uppercase', color: C.goldPale, marginBottom: 3 }}>
              LuxStay
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: C.textPrim }}>
              CRM <span className="lux-shimmer" style={{ fontStyle: 'italic', fontWeight: 300 }}>Loyalty</span>
            </div>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="lux-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `lux-nav-link${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: 9, opacity: .55 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop user */}
        <div className="lux-desktop-user" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, paddingLeft: 36, borderLeft: `1px solid ${C.border}` }}>
          {username && (
            <>
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: 2,
                border: `1px solid rgba(196,154,46,0.32)`,
                background: 'rgba(196,154,46,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 11,
                color: C.goldLight, letterSpacing: '0.04em', flexShrink: 0,
              }}>
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 400, color: C.textPrim, marginBottom: 3 }}>
                  {username}
                </div>
                <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.textMut }}>
                  Concierge
                </div>
              </div>
              <div style={{ width: 1, height: 24, background: C.border }} />
            </>
          )}
          <button type="button" onClick={() => logout?.()} className="lux-logout">
            <span style={{ fontSize: 12, opacity: .75 }}>⎋</span>
            Sign Out
          </button>
        </div>

        {/* Burger */}
        <button type="button" className="lux-burger" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lux-mobile-menu" style={{
          borderTop: `1px solid ${C.border}`,
          background: '#0D0906',
          padding: '10px 2rem 16px',
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          {username && (
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: C.textPrim, margin: '4px 0 10px 14px' }}>
              {username} <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textMut, marginLeft: 6 }}>Concierge</span>
            </p>
          )}

          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `lux-mobile-link${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: 10, opacity: .6 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div style={{ height: '0.5px', background: C.border, margin: '8px 0' }} />

          <button type="button" onClick={() => logout?.()} style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: 2,
            border: `1px solid rgba(196,154,46,0.22)`, background: 'transparent',
            fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.textMut, cursor: 'pointer',
            transition: 'all .18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.goldLight; e.currentTarget.style.borderColor = 'rgba(196,154,46,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textMut; e.currentTarget.style.borderColor = 'rgba(196,154,46,0.22)'; }}>
            ⎋ Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}