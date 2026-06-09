// LoyaltyCards.jsx — L'Éclat d'Azur CRM · Luxury Dark Edition
// ENHANCED with tier statistics and better organization
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { customerAPI, loyaltyAPI, pointsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoyaltyCardWidget from '../components/LoyaltyCardWidget';

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
  onyx:     '#0A0604',
};

const TIER_META = {
  SILVER:   { color: C.silver,   icon: '◈', label: 'Silver'   },
  GOLD:     { color: C.gold,     icon: '◆', label: 'Gold'     },
  PLATINUM: { color: C.platinum, icon: '★', label: 'Platinum' },
};

const TIER_THRESHOLDS = {
  SILVER:   { next: 'GOLD',     needed: 1000, label: 'Silver → Gold'     },
  GOLD:     { next: 'PLATINUM', needed: 5000, label: 'Gold → Platinum'   },
  PLATINUM: { next: null,       needed: null, label: 'Maximum Level'    },
};

/* ─── Styles ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  .ezl * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineDraw {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }

  .ezl-modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 50; padding: 16px;
  }

  .ezl-modal {
    background: #1A0F08; border: 1px solid rgba(196,154,46,0.25);
    border-radius: 2px; width: 100%; max-width: 440px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.6); overflow: hidden;
  }

  .ezl-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem; border-bottom: 1px solid rgba(196,154,46,0.15);
    background: linear-gradient(to bottom, #100B06, #1A0F08);
  }

  .ezl-modal-close {
    width: 32px; height: 32px; border-radius: 2px;
    border: 1px solid rgba(196,154,46,0.3);
    background: transparent; color: #B09070; font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease;
  }
  .ezl-modal-close:hover {
    background: rgba(196,154,46,0.15); color: #C49A2E;
  }

  .ezl-input {
    width: 100%; box-sizing: border-box;
    background: rgba(196,154,46,0.06); border: 1px solid rgba(196,154,46,0.3);
    border-radius: 2px; padding: 9px 16px 9px 34px;
    color: #F0E6D0; font-family: 'Jost', sans-serif;
    font-size: 13px; font-weight: 300;
    outline: none; transition: all 0.2s ease;
  }
  .ezl-input:focus {
    border-color: rgba(196,154,46,0.6);
    background: rgba(196,154,46,0.08);
  }

  .ezl-button {
    padding: 10px 14px; border-radius: 2px;
    border: 1px solid currentColor;
    background: transparent; color: inherit;
    font-family: 'Jost', sans-serif;
    font-size: 10px; font-weight: 300;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; display: inline-flex;
    align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s ease;
  }
  .ezl-button:disabled {
    opacity: 0.5; cursor: not-allowed;
  }

  .ezl-stat {
    background: #1F1209; border: 1px solid rgba(196,154,42,0.16);
    border-radius: 2px; padding: 1.5rem;
    position: relative; overflow: hidden;
    cursor: default; transition: all 0.3s ease;
  }
  .ezl-stat:hover {
    transform: translateY(-5px);
    background: #251608;
    border-color: rgba(196,154,46,0.36);
    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,154,46,0.12);
  }

  .ezl-panel {
    background: #1A0F08; border: 1px solid rgba(196,154,46,0.14);
    border-radius: 2px; padding: 1.7rem;
    position: relative; overflow: hidden;
  }

  .ezl-card {
    background: #1F1209; border: 1px solid rgba(196,154,42,0.16);
    border-radius: 2px; padding: 1.5rem;
    position: relative; overflow: hidden;
    transition: all 0.3s ease;
  }
  .ezl-card:hover {
    transform: translateY(-5px);
    background: #251608;
    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,154,46,0.12);
  }

  .ezl-shimmer { animation: shimmerLoad 2s ease infinite; }
  @keyframes shimmerLoad { 0%,100% { opacity:.08; } 50% { opacity:.22; } }

  @media (max-width: 900px) {
    .ezl-grid { grid-template-columns: 1fr !important; }
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

function TierProgress({ cardType, currentBalance }) {
  const tier = TIER_THRESHOLDS[cardType] || TIER_THRESHOLDS.SILVER;
  const meta = TIER_META[cardType] || TIER_META.SILVER;

  if (!tier.needed) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ color:C.platinum, fontSize:14 }}>★</span>
        <Label color={C.platinum} style={{ margin:0 }}>Maximum level reached</Label>
      </div>
    );
  }

  const progress = Math.min(100, (currentBalance / tier.needed) * 100);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Label color={C.textMut} style={{ margin:0 }}>{tier.label}</Label>
        <span style={{ ...serif(12, 300, C.textPrim) }}>
          {currentBalance.toLocaleString('en-US')} / {tier.needed.toLocaleString('en-US')}
        </span>
      </div>
      <div style={{ height:3, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden', position:'relative' }}>
        <div style={{
          position:'absolute', left:0, top:0, bottom:0,
          width:`${progress}%`,
          background:`linear-gradient(to right, ${meta.color}99, ${meta.color})`,
          borderRadius:2,
          transition:'width 0.7s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
      <p style={{ ...jost(9, 200, C.textDim), margin:0 }}>
        {Math.max(0, tier.needed - currentBalance).toLocaleString('en-US')} points remaining
      </p>
    </div>
  );
}

function CreateCardModal({ customer, onClose, onCreated }) {
  const [cardType, setCardType] = useState('SILVER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setLoading(true);
    setError('');
    try {
      const { data } = await loyaltyAPI.createCard({ customerId: customer.id, cardType });
      onCreated(data);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || '';
      if (msg.toLowerCase().includes('déjà une carte') || msg.toLowerCase().includes('deja une carte') || msg.toLowerCase().includes('already')) {
        setError('This customer already has a loyalty card.');
      } else {
        setError('Error creating the card. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ezl-modal-backdrop">
      <div className="ezl-modal">
        <div className="ezl-modal-header">
          <div>
            <Label color={C.gold} style={{ marginBottom:6 }}>LuxStay Rewards</Label>
            <h2 style={{ ...serif(20, 400, C.textPrim) }}>Issue Membership Card</h2>
          </div>
          <button className="ezl-modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:`rgba(196,154,46,0.08)`, border:`1px solid rgba(196,154,46,0.2)`, borderRadius:2, padding:'12px 16px' }}>
            <Label color={C.textMut} style={{ marginBottom:8 }}>Customer</Label>
            <p style={{ ...serif(16, 400, C.textPrim), marginBottom:4 }}>
              {customer.firstName} {customer.lastName}
            </p>
            <p style={{ ...jost(11, 200, C.textMut), margin:0 }}>{customer.email}</p>
          </div>

          <div>
            <Label color={C.gold} style={{ marginBottom:12 }}>Card Type</Label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {['SILVER', 'GOLD', 'PLATINUM'].map((type) => {
                const m = TIER_META[type];
                const selected = cardType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setCardType(type)}
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'12px 14px', borderRadius:2, cursor:'pointer',
                      textAlign:'left', width:'100%', transition:'all 0.15s',
                      border:selected ? `1px solid ${m.color}60` : `1px solid rgba(196,154,46,0.15)`,
                      background:selected ? `${m.color}12` : `rgba(196,154,46,0.05)`,
                    }}
                  >
                    <div style={{
                      width:34, height:34, borderRadius:2,
                      background:`${m.color}18`,
                      border:`1px solid ${m.color}35`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:m.color, fontSize:16, flexShrink:0,
                    }}>{m.icon}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ ...serif(15, 400, selected ? m.color : C.textPrim), marginBottom:2 }}>
                        {m.label}
                      </p>
                      <p style={{ ...jost(10, 200, C.textMut), margin:0 }}>
                        {type === 'SILVER' ? 'Entry level' : type === 'GOLD' ? 'Intermediate level' : 'Premium level'}
                      </p>
                    </div>
                    {selected && <span style={{ color:m.color, fontSize:14, flexShrink:0 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{ background:`rgba(231,76,60,0.1)`, border:`1px solid rgba(231,76,60,0.3)`, borderRadius:2, padding:'10px 14px' }}>
              <p style={{ ...jost(11, 300, '#E74C3C'), margin:0 }}>{error}</p>
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:10, padding:'1rem 1.5rem', borderTop:`1px solid rgba(196,154,46,0.15)` }}>
          <button onClick={onClose} className="ezl-button" style={{ flex:1, color:C.textSec, borderColor:`rgba(196,154,46,0.3)` }}>
            Cancel
          </button>
          <button onClick={handleCreate} disabled={loading} className="ezl-button" style={{
            flex:1, color:C.gold, borderColor:`rgba(196,154,46,0.6)`,
            background:loading ? `rgba(196,154,46,0.15)` : `rgba(196,154,46,0.2)`,
            opacity:loading ? 0.6 : 1,
          }}>
            {loading && <span style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${C.gold}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />}
            Issue Card
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main LoyaltyCards Component ─────────────────────────────────────────────── */
export default function LoyaltyCards({ addToast }) {
  const { authenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [cards, setCards] = useState({});
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [createFor, setCreateFor] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState(null);

  useEffect(() => {
    if (!authenticated) { setLoading(false); return; }
    loadAll();
  }, [authenticated]);

  async function loadAll() {
    setLoading(true);
    try {
      const { data: customerList } = await customerAPI.getAll();
      setCustomers(customerList);
      await Promise.all(
        customerList.map(async (c) => {
          try {
            const cardRes = await loyaltyAPI.getCardByCustomer(c.id);
            setCards((prev) => ({ ...prev, [c.id]: cardRes.data }));
          } catch { }
          try {
            const balRes = await pointsAPI.getBalance(c.id);
            setBalances((prev) => ({ ...prev, [c.id]: balRes.data?.currentBalance || 0 }));
          } catch {
            setBalances((prev) => ({ ...prev, [c.id]: 0 }));
          }
        })
      );
    } catch {
      addToast?.('Unable to load data', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleCardCreated(card) {
    setCards((prev) => ({ ...prev, [card.customerId]: card }));
    addToast?.('Card created successfully', 'success');
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    const matchesTier = !filterTier || cards[c.id]?.cardType === filterTier;
    return matchesSearch && matchesTier;
  });

  const withCard    = filtered.filter((c) =>  cards[c.id]);
  const withoutCard = filtered.filter((c) => !cards[c.id]);

  // Tier statistics
  const tierStats = [
    { tier: 'SILVER', count: Object.values(cards).filter(c => c.cardType === 'SILVER').length, color: C.silver },
    { tier: 'GOLD', count: Object.values(cards).filter(c => c.cardType === 'GOLD').length, color: C.gold },
    { tier: 'PLATINUM', count: Object.values(cards).filter(c => c.cardType === 'PLATINUM').length, color: C.platinum },
  ];
  const totalCards = tierStats.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="ezl" style={{ minHeight:'100vh', background:C.bg, color:C.textPrim }}>
      <style>{STYLES}</style>

      {/* ══ HEADER ══ */}
      <header style={{ borderBottom:`1px solid ${C.border}`, padding:'2rem 2.5rem 1.75rem', background:`linear-gradient(to bottom, ${C.bgLayer}, ${C.bg})`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.015, backgroundImage:'repeating-linear-gradient(45deg,#C49A2E 0,#C49A2E 1px,transparent 0,transparent 50%)', backgroundSize:'20px 20px' }} />
        <div style={{ position:'relative', maxWidth:1240, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <div style={{ width:52, height:52, borderRadius:2, border:`1px solid rgba(196,154,46,0.45)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:C.gold, background:`rgba(196,154,46,0.1)` }}>
              ✦
            </div>
            <div>
              <Label color={C.gold} style={{ marginBottom:6 }}>LuxStay Hotels & Resorts</Label>
              <h1 style={{ ...serif(32, 400, '#FFFFFF'), margin:0 }}>Loyalty Cards</h1>
            </div>

            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
              <div style={{ textAlign:'right' }}>
                <p style={{ ...serif(22, 400, C.textPrim), margin:0 }}>
                  {totalCards}
                </p>
                <Label style={{ margin:0, opacity:0.7 }}>total cards issued</Label>
              </div>

              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.textMut, fontSize:14, opacity:0.5, pointerEvents:'none' }}>⌕</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer…"
                  className="ezl-input"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth:1240, margin:'0 auto', padding:'2rem 2.5rem 5rem' }}>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'6rem 0' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${C.gold}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* ── Tier Statistics Section ── */}
            <section>
              <GoldDivider label="Tier Statistics" />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:'3.2rem' }}>
                {tierStats.map((stat, i) => {
                  const meta = TIER_META[stat.tier];
                  const percentage = totalCards > 0 ? Math.round((stat.count / totalCards) * 100) : 0;
                  return (
                    <div key={stat.tier} className="ezl-stat" style={{ borderTop:`2.5px solid ${stat.color}`, animation:`fadeUp .75s cubic-bezier(.22,1,.36,1) ${i*0.07}s both` }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                        <span style={{ color:stat.color, fontSize:20 }}>{meta.icon}</span>
                        <span style={{ ...jost(10, 300, stat.color) }}>{percentage}%</span>
                      </div>
                      <Label color={stat.color} style={{ marginBottom:8 }}>{stat.tier}</Label>
                      <p style={{ ...serif(32, 300, C.textPrim), margin:'0 0 12px', lineHeight:1 }}>{stat.count}</p>
                      <div style={{ height:3, borderRadius:2, background:`${stat.color}12`, overflow:'hidden' }}>
                        <div style={{ height:'100%', background:stat.color, width:`${percentage}%`, transition:'width 0.7s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Filter by tier */}
              <div style={{ display:'flex', gap:8, marginBottom:32 }}>
                <button onClick={() => setFilterTier(null)} style={{
                  padding:'8px 16px', borderRadius:2, cursor:'pointer',
                  border:`1px solid ${!filterTier ? C.gold : 'rgba(196,154,46,0.2)'}`,
                  background:`${!filterTier ? 'rgba(196,154,46,0.15)' : 'transparent'}`,
                  color:!filterTier ? C.gold : C.textSec,
                  ...jost(9, 300),
                  transition:'all 0.2s ease',
                }}>All Tiers</button>
                {Object.entries(TIER_META).map(([tier, meta]) => (
                  <button key={tier} onClick={() => setFilterTier(tier)} style={{
                    padding:'8px 16px', borderRadius:2, cursor:'pointer',
                    border:`1px solid ${filterTier === tier ? meta.color : 'rgba(196,154,46,0.2)'}`,
                    background:`${filterTier === tier ? `${meta.color}15` : 'transparent'}`,
                    color:filterTier === tier ? meta.color : C.textSec,
                    ...jost(9, 300),
                    transition:'all 0.2s ease',
                  }}>
                    {meta.icon} {meta.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Cards Issued Section ── */}
            {withCard.length > 0 && (
              <section>
                <GoldDivider label={`Membership Cards · ${withCard.length}`} />
                <div className="ezl-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(460px, 1fr))', gap:20 }}>
                  {withCard.map((customer) => {
                    const card    = cards[customer.id];
                    const balance = balances[customer.id] || 0;
                    const meta    = TIER_META[card.cardType] || TIER_META.SILVER;
                    return (
                      <div key={customer.id} className="ezl-card" style={{ borderTop:`2.5px solid ${meta.color}` }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.borderColor = 'rgba(196,154,46,0.36)';
                          e.currentTarget.style.background = C.bgCardHov;
                          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,154,46,0.12)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = 'rgba(196,154,42,0.16)';
                          e.currentTarget.style.background = C.bgCard;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ position:'absolute', bottom:0, left:0, width:40, height:40, borderRight:`1px solid ${meta.color}18`, borderTop:`1px solid ${meta.color}18` }} />
                        <div style={{ position:'absolute', right:20, top:14, fontSize:52, opacity:0.04, color:meta.color, lineHeight:1 }}>
                          {meta.icon}
                        </div>

                        <span style={{
                          position:'absolute', top:14, right:16,
                          padding:'3px 12px', borderRadius:2,
                          background:`${meta.color}12`, border:`1px solid ${meta.color}30`,
                          color:meta.color,
                          ...jost(9, 300),
                        }}>{meta.icon} {meta.label}</span>

                        <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.25rem' }}>
                          <LoyaltyCardWidget
                            cardNumber={card.cardNumber}
                            customerName={`${customer.firstName} ${customer.lastName}`}
                            cardType={card.cardType}
                            issueDate={card.issueDate}
                            expiryDate={card.expiryDate}
                          />
                        </div>

                        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
                          <div>
                            <p style={{ ...serif(18, 400, C.textPrim), marginBottom:4 }}>
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p style={{ ...jost(11, 200, C.textMut), margin:0 }}>
                              {customer.email}
                            </p>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ ...serif(28, 400, C.textPrim), margin:0, lineHeight:1 }}>
                              {balance.toLocaleString('en-US')}
                            </p>
                            <Label style={{ margin:0, opacity:0.6 }}>points</Label>
                          </div>
                        </div>

                        <div style={{ background:`${meta.color}0C`, border:`1px solid ${meta.color}20`, borderRadius:2, padding:'12px 14px' }}>
                          <TierProgress cardType={card.cardType} currentBalance={balance} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── No Card Section ── */}
            {withoutCard.length > 0 && (
              <section>
                <GoldDivider label={`No Card · ${withoutCard.length}`} />
                <div className="ezl-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:14 }}>
                  {withoutCard.map((customer) => (
                    <div key={customer.id} className="ezl-card" style={{
                      background:C.bgCard,
                      border:`1px dashed rgba(196,154,46,0.2)`,
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(196,154,46,0.5)`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(196,154,46,0.2)`}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                        <div style={{
                          width:38, height:38, borderRadius:2,
                          background:`rgba(196,154,46,0.1)`,
                          border:`1px solid rgba(196,154,46,0.3)`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          color:C.gold, fontSize:13, fontWeight:400, flexShrink:0,
                        }}>
                          {customer.firstName?.[0]}{customer.lastName?.[0]}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ ...serif(14, 400, C.textPrim), marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p style={{ ...jost(10, 200, C.textMut), margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', opacity:0.7 }}>
                            {customer.email}
                          </p>
                        </div>
                      </div>

                      <button onClick={() => setCreateFor(customer)} style={{
                        width:'100%', padding:'9px 0', borderRadius:2, cursor:'pointer',
                        border:`1px solid rgba(196,154,46,0.35)`,
                        background:`rgba(196,154,46,0.1)`,
                        color:C.gold,
                        ...jost(11, 300),
                        transition:'all 0.15s ease',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = `rgba(196,154,46,0.2)`;
                          e.currentTarget.style.borderColor = `rgba(196,154,46,0.6)`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = `rgba(196,154,46,0.1)`;
                          e.currentTarget.style.borderColor = `rgba(196,154,46,0.35)`;
                        }}
                      >
                        ✦ Issue Card
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'5rem 0', color:C.textMut, opacity:0.5 }}>
                <p style={{ fontSize:36, margin:'0 0 12px', color:C.gold }}>◈</p>
                <p style={{ ...jost(16, 300, C.textMut), margin:0 }}>No results found</p>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop:'3rem', paddingTop:'1.5rem', borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ height:'0.5px', flex:1, background:`linear-gradient(to right,transparent,${C.border})` }} />
          <span style={{ color:C.gold, fontSize:11, opacity:0.4 }}>✦</span>
          <div style={{ height:'0.5px', flex:1, background:`linear-gradient(to left,transparent,${C.border})` }} />
        </div>

      </main>

      {createFor && (
        <CreateCardModal
          customer={createFor}
          onClose={() => setCreateFor(null)}
          onCreated={handleCardCreated}
        />
      )}
    </div>
  );
}
