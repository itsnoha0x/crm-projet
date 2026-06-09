// Points.jsx — L'Éclat d'Azur CRM · Luxury Dark Edition
// ENHANCED with analytics and better organization
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { customerAPI, loyaltyAPI, pointsAPI } from '../services/api';
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
  red:      '#E74C3C',
  onyx:     '#0A0604',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  .ezp * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineDraw {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes shimmerLoad {
    0%,100% { opacity:.08; } 50% { opacity:.22; }
  }

  .ezp-panel {
    background: #1A0F08;
    border: 1px solid rgba(196,154,46,0.14);
    border-radius: 2px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .ezp-stat {
    background: #1F1209;
    border: 1px solid rgba(196,154,42,0.16);
    border-radius: 2px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .ezp-stat:hover {
    transform: translateY(-5px);
    background: #251608;
    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,154,46,0.12);
  }

  .ezp-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(196,154,46,0.06);
    border: 1px solid rgba(196,154,46,0.3);
    border-radius: 2px;
    padding: 9px 16px 9px 34px;
    color: #F0E6D0;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 300;
    outline: none;
    transition: all 0.2s ease;
  }
  .ezp-input:focus {
    border-color: rgba(196,154,46,0.6);
    background: rgba(196,154,46,0.08);
  }

  .ezp-button {
    padding: 10px 14px;
    border-radius: 2px;
    border: 1px solid currentColor;
    background: transparent;
    color: inherit;
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }
  .ezp-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ezp-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: #1A0F08;
    border: 1px solid rgba(196,154,42,0.25);
    border-radius: 2px;
    overflow: hidden;
    z-index: 20;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }

  .ezp-dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(196,154,46,0.08);
    cursor: pointer;
    text-align: left;
    transition: background 0.12s ease;
  }
  .ezp-dropdown-item:hover {
    background: rgba(196,154,46,0.08);
  }

  .ezp-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .ezp-badge.earned {
    background: rgba(74,222,128,0.12);
    border: 1px solid rgba(74,222,128,0.3);
    color: #4ade80;
  }
  .ezp-badge.redeemed {
    background: rgba(231,76,60,0.12);
    border: 1px solid rgba(231,76,60,0.3);
    color: #E74C3C;
  }

  .ezp-table {
    width: 100%;
    border-collapse: collapse;
  }
  .ezp-table thead tr {
    background: rgba(10,6,4,0.4);
    border-bottom: 1px solid rgba(196,154,46,0.2);
  }
  .ezp-table thead th {
    padding: 12px 20px;
    text-align: left;
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(176,144,112,0.65);
  }
  .ezp-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.18s ease;
  }
  .ezp-table tbody tr:hover {
    background: rgba(196,154,46,0.04);
  }
  .ezp-table tbody td {
    padding: 12px 20px;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #B09070;
  }

  .ezp-shimmer { animation: shimmerLoad 2s ease infinite; }

  @media (max-width: 900px) {
    .ezp-grid2 { grid-template-columns: 1fr !important; }
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

function TxBadge({ type }) {
  const isEarned = type === 'EARNED' || type === 'BONUS' || type === 'ADJUSTMENT';
  return (
    <span className={`ezp-badge ${isEarned ? 'earned' : 'redeemed'}`}>
      {isEarned ? '▲' : '▼'} {isEarned ? 'Earned' : 'Redeemed'}
    </span>
  );
}

function EarnForm({ customerId, card, onSuccess, addToast }) {
  const [form, setForm] = useState({ points: '', reference: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.points || isNaN(form.points) || Number(form.points) <= 0) e.points = 'Enter a valid number';
    if (!form.reference.trim()) e.reference = 'Reference is required';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await pointsAPI.earn({ customerId, loyaltyCardId: card.id, points: Number(form.points), reference: form.reference, description: form.description });
      setForm({ points: '', reference: '', description: '' });
      setErrors({});
      onSuccess();
      addToast?.(`${form.points} reward points credited`, 'success');
    } catch (err) {
      addToast?.(err.userMessage || 'Error', 'error');
    } finally { setLoading(false); }
  }

  return (
    <div className="ezp-panel" style={{ borderTop:`2px solid ${C.green}` }}>
      <Label color={C.gold} style={{ marginBottom:12 }}>Credit Points</Label>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div>
          <Label style={{ marginBottom:6 }}>Points</Label>
          <input type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} placeholder="100" className="ezp-input" />
          {errors.points && <p style={{ ...jost(9, 300, '#E74C3C'), marginTop:4 }}>{errors.points}</p>}
        </div>
        <div>
          <Label style={{ marginBottom:6 }}>Reference</Label>
          <input type="text" value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="STAY-2024-001" className="ezp-input" />
          {errors.reference && <p style={{ ...jost(9, 300, '#E74C3C'), marginTop:4 }}>{errors.reference}</p>}
        </div>
        <div>
          <Label style={{ marginBottom:6 }}>Description</Label>
          <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Reason..." className="ezp-input" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="ezp-button" style={{ color:C.green, borderColor:C.green }}>
          {loading && <span style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${C.green}`, borderTopColor:'transparent', animation:'spin .8s linear infinite' }} />}
          ▲ Credit
        </button>
      </div>
    </div>
  );
}

function RedeemForm({ customerId, card, currentBalance, onSuccess, addToast }) {
  const [form, setForm] = useState({ points: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    const pts = Number(form.points);
    if (!form.points || isNaN(pts) || pts <= 0) e.points = 'Invalid amount';
    else if (pts > currentBalance) e.points = `Insufficient (max: ${currentBalance})`;
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await pointsAPI.redeem({ customerId, loyaltyCardId: card.id, points: Number(form.points), reference: `REDEEM-${Date.now()}`, description: form.description });
      setForm({ points: '', description: '' });
      setErrors({});
      onSuccess();
      addToast?.(`${form.points} points redeemed`, 'success');
    } catch (err) {
      addToast?.(err.userMessage || 'Error', 'error');
    } finally { setLoading(false); }
  }

  return (
    <div className="ezp-panel" style={{ borderTop:`2px solid ${C.red}` }}>
      <Label color={C.gold} style={{ marginBottom:12 }}>Redeem Points</Label>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div>
          <Label style={{ marginBottom:6 }}>Points</Label>
          <input type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} placeholder="50" max={currentBalance} className="ezp-input" />
          {errors.points && <p style={{ ...jost(9, 300, '#E74C3C'), marginTop:4 }}>{errors.points}</p>}
        </div>
        <div>
          <Label style={{ marginBottom:6 }}>Description</Label>
          <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Reward..." className="ezp-input" />
        </div>
        <button onClick={handleSubmit} disabled={loading || currentBalance === 0} className="ezp-button" style={{ color:C.red, borderColor:C.red }}>
          {loading && <span style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${C.red}`, borderTopColor:'transparent', animation:'spin .8s linear infinite' }} />}
          ▼ Redeem
        </button>
      </div>
    </div>
  );
}

/* ─── Main Points Component ─────────────────────────────────────────────– */
export default function Points({ addToast }) {
  const { authenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [card, setCard] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    if (!authenticated) return;
    customerAPI.getAll().then(res => setAllCustomers(res.data)).catch(() => {});
  }, [authenticated]);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allCustomers.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [search, allCustomers]);

  async function selectCustomer(customer) {
    setSelectedCustomer(customer); setSearch(''); setLoading(true);
    try {
      const [cardRes, balRes, histRes] = await Promise.allSettled([
        loyaltyAPI.getCardByCustomer(customer.id),
        pointsAPI.getBalance(customer.id),
        pointsAPI.getHistory(customer.id),
      ]);
      setCard(cardRes.status === 'fulfilled' ? cardRes.value.data : null);
      setBalance(balRes.status === 'fulfilled' ? balRes.value.data?.currentBalance || 0 : 0);
      setHistory(histRes.status === 'fulfilled' ? histRes.value.data : []);
    } catch { addToast?.('Error loading data', 'error'); }
    finally { setLoading(false); }
  }

  async function refreshData() {
    if (!selectedCustomer) return;
    try {
      const [balRes, histRes] = await Promise.all([pointsAPI.getBalance(selectedCustomer.id), pointsAPI.getHistory(selectedCustomer.id)]);
      setBalance(balRes.data?.currentBalance || 0);
      setHistory(histRes.data || []);
    } catch {}
  }

  const historyWithBalance = useMemo(() => {
    let running = balance;
    return history.map(tx => { const current = running; running -= tx.points || 0; return { ...tx, runningBalance: current }; });
  }, [history, balance]);

  // Points Analytics
  const pointsAnalytics = useMemo(() => {
    const earned = historyWithBalance.filter(tx => tx.transactionType === 'EARNED' || tx.transactionType === 'BONUS' || tx.transactionType === 'ADJUSTMENT').reduce((sum, tx) => sum + (tx.points || 0), 0);
    const redeemed = historyWithBalance.filter(tx => tx.transactionType === 'REDEEMED').reduce((sum, tx) => sum + (tx.points || 0), 0);
    return { earned, redeemed };
  }, [historyWithBalance]);

  return (
    <div className="ezp" style={{ minHeight:'100vh', background:C.bg, color:C.textPrim }}>
      <style>{STYLES}</style>

      {/* ══ HEADER ══ */}
      <header style={{ background:C.bgLayer, borderBottom:`1px solid ${C.border}`, padding:'2rem 2.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.015, backgroundImage:'repeating-linear-gradient(45deg,#C49A2E 0,#C49A2E 1px,transparent 0,transparent 50%)', backgroundSize:'20px 20px' }} />
        <div style={{ position:'relative', maxWidth:1240, margin:'0 auto' }}>
          <Label color={C.gold} style={{ marginBottom:8 }}>LuxStay Rewards</Label>
          <h1 style={{ ...serif(32, 400, '#FFFFFF'), marginBottom:6 }}>Reward Points</h1>
          <p style={{ ...jost(11, 200, C.textMut), margin:0 }}>Manage guest points — credit stays, redeem privileges</p>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth:1240, margin:'0 auto', padding:'2rem 2.5rem' }}>

        {/* ── Guest Search ── */}
        <div style={{ maxWidth:520, marginBottom:32, position:'relative' }}>
          <Label style={{ marginBottom:8 }}>Search Guest</Label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.gold, fontSize:14, opacity:0.5 }}>⌕</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Guest name or email..." className="ezp-input" />
          </div>
          {filtered.length > 0 && (
            <div className="ezp-dropdown">
              {filtered.map(c => (
                <button key={c.id} className="ezp-dropdown-item" onClick={() => selectCustomer(c)}>
                  <div style={{ width:32, height:32, borderRadius:2, background:`${C.gold}12`, color:C.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:400 }}>
                    {c.firstName?.[0]}{c.lastName?.[0]}
                  </div>
                  <div>
                    <p style={{ ...serif(14, 400, C.textPrim), marginBottom:2 }}>{c.firstName} {c.lastName}</p>
                    <p style={{ ...jost(10, 200, C.textMut), margin:0 }}>{c.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {!selectedCustomer ? (
          <div style={{ textAlign:'center', padding:'5rem 0', color:C.textMut, opacity:0.5 }}>
            <p style={{ fontSize:36, margin:'0 0 12px' }}>◇</p>
            <p style={{ ...jost(14, 300, C.textMut) }}>Search a guest to manage their reward points</p>
          </div>
        ) : loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'5rem 0' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${C.gold}`, borderTopColor:'transparent', animation:'spin .8s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* ── Guest Info + Balance ── */}
            <div className="ezp-panel">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:52, height:52, borderRadius:2, background:`${C.gold}12`, color:C.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:400, border:`1px solid ${C.gold}30` }}>
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                  <div>
                    <h2 style={{ ...serif(22, 400, C.textPrim), marginBottom:3 }}>
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h2>
                    <p style={{ ...jost(12, 200, C.textMut), marginBottom:4 }}>{selectedCustomer.email}</p>
                    {card && <Label color={C.gold}>{card.cardType} Membership</Label>}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <Label color={C.textMut} style={{ marginBottom:4 }}>Current Balance</Label>
                  <p style={{ ...serif(42, 300, C.textPrim), margin:'0 0 4px', lineHeight:1 }}>
                    {balance.toLocaleString('en-US')}
                  </p>
                  <p style={{ ...jost(11, 200, C.textMut), margin:0 }}>reward points</p>
                </div>
              </div>
            </div>

            {/* ── Points Analytics ── */}
            {card && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
                <div className="ezp-stat" style={{ borderTop:`2px solid ${C.green}` }}>
                  <Label color={C.green} style={{ marginBottom:12 }}>Total Earned</Label>
                  <p style={{ ...serif(32, 300, C.textPrim), margin:0 }}>{pointsAnalytics.earned.toLocaleString('en-US')}</p>
                </div>
                <div className="ezp-stat" style={{ borderTop:`2px solid ${C.red}` }}>
                  <Label color={C.red} style={{ marginBottom:12 }}>Total Redeemed</Label>
                  <p style={{ ...serif(32, 300, C.textPrim), margin:0 }}>{pointsAnalytics.redeemed.toLocaleString('en-US')}</p>
                </div>
                <div className="ezp-stat">
                  <Label style={{ marginBottom:12 }}>Transactions</Label>
                  <p style={{ ...serif(32, 300, C.textPrim), margin:0 }}>{history.length}</p>
                </div>
              </div>
            )}

            {!card ? (
              <div className="ezp-panel" style={{ background:`rgba(196,154,46,0.08)`, textAlign:'center' }}>
                <p style={{ ...serif(15, 400, C.gold), marginBottom:6 }}>No membership card found</p>
                <p style={{ ...jost(12, 200, C.textMut), margin:0 }}>Issue a card first from the Loyalty Cards page</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <EarnForm customerId={selectedCustomer.id} card={card} onSuccess={refreshData} addToast={addToast} />
                <RedeemForm customerId={selectedCustomer.id} card={card} currentBalance={balance} onSuccess={refreshData} addToast={addToast} />
              </div>
            )}

            {/* ── Transaction History ── */}
            <div className="ezp-panel">
              <Label color={C.gold} style={{ marginBottom:12 }}>Transaction History</Label>
              {historyWithBalance.length === 0 ? (
                <p style={{ textAlign:'center', color:C.textMut, fontSize:13, padding:'3rem 0', opacity:0.5 }}>
                  No transactions recorded
                </p>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table className="ezp-table">
                    <thead>
                      <tr>
                        {['Date', 'Type', 'Points', 'Reference', 'Description', 'Balance'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {historyWithBalance.map((tx, i) => {
                        const isEarned = tx.transactionType === 'EARNED' || tx.transactionType === 'BONUS' || tx.transactionType === 'ADJUSTMENT';
                        return (
                          <tr key={tx.id || i}>
                            <td style={{ color:C.textMut, whiteSpace:'nowrap' }}>
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB') : '—'}
                            </td>
                            <td><TxBadge type={tx.transactionType} /></td>
                            <td style={{ color:isEarned ? C.green : C.red, ...serif(14, 400) }}>
                              {tx.points > 0 ? '+' : ''}{tx.points?.toLocaleString('en-US') || 0}
                            </td>
                            <td style={{ color:C.textMut, fontSize:11, opacity:0.75 }}>{tx.reference || '—'}</td>
                            <td style={{ color:C.textMut, opacity:0.7, maxWidth:150, overflow:'hidden', textOverflow:'ellipsis' }}>{tx.description || '—'}</td>
                            <td style={{ color:C.textPrim, ...serif(14, 400) }}>{tx.runningBalance?.toLocaleString('en-US')} pts</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

