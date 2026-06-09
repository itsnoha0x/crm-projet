// Customers.jsx — LuxStay Rewards · Luxury Dark Edition (aligned with Dashboard.jsx)
import React, { useState, useEffect, useMemo } from 'react';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Palette (identique à Dashboard.jsx) ───────────────────────────────── */
const C = {
  bg:        '#100B06',
  bgLayer:   '#180E08',
  bgCard:    '#1F1209',
  bgCardHov: '#251608',
  bgPanel:   '#1A0F08',
  border:    'rgba(184,137,42,0.18)',
  borderHov: 'rgba(184,137,42,0.42)',
  gold:      '#C49A2E',
  goldBrt:   '#DDB84F',
  goldLight: '#EDD080',
  goldPale:  '#F5E8B4',
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

const ITEMS_PER_PAGE = 10;

/* ─── Global styles ─────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  .lsc * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes lineDraw { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
  @keyframes orbFloat { 0%,100%{transform:scale(1) translateY(0);opacity:.3} 50%{transform:scale(1.08) translateY(-6px);opacity:.48} }
  @keyframes shimmerLoad { 0%,100%{opacity:.07} 50%{opacity:.2} }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes modalIn  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  .lsc-fu1 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .05s both; }
  .lsc-fu2 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .12s both; }
  .lsc-fu3 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .19s both; }
  .lsc-fu4 { animation: fadeUp .72s cubic-bezier(.22,1,.36,1) .26s both; }

  /* Table row */
  .lsc-tr {
    border-bottom: 1px solid rgba(196,154,46,0.07);
    transition: background .18s ease;
    cursor: default;
  }
  .lsc-tr:last-child { border-bottom: none; }
  .lsc-tr:hover { background: rgba(196,154,46,0.04); }

  /* Action buttons */
  .lsc-btn-edit {
    padding: 5px 12px; border-radius: 2px;
    background: rgba(196,154,46,0.08); border: 1px solid rgba(196,154,46,0.28);
    color: #C49A2E; font-family: 'Jost', sans-serif; font-size: 9px;
    font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: background .18s ease, transform .18s ease;
  }
  .lsc-btn-edit:hover { background: rgba(196,154,46,0.16); transform: translateY(-1px); }

  .lsc-btn-remove {
    padding: 5px 12px; border-radius: 2px;
    background: rgba(226,68,68,0.07); border: 1px solid rgba(226,68,68,0.28);
    color: #E24444; font-family: 'Jost', sans-serif; font-size: 9px;
    font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: background .18s ease, transform .18s ease;
  }
  .lsc-btn-remove:hover { background: rgba(226,68,68,0.14); transform: translateY(-1px); }

  /* Primary gold button */
  .lsc-btn-gold {
    font-family: 'Jost', sans-serif; font-weight: 300; font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 10px 22px; border-radius: 2px;
    background: linear-gradient(135deg, #C49A2E 0%, #DDB84F 100%);
    border: none; color: #0A0604; cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .lsc-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(196,154,46,0.45); }
  .lsc-btn-gold:active { transform: scale(.97); }

  /* Ghost gold button */
  .lsc-btn-ghost {
    font-family: 'Jost', sans-serif; font-weight: 300; font-size: 9px;
    letter-spacing: 0.18em; text-transform: uppercase;
    padding: 10px 22px; border-radius: 2px;
    background: rgba(196,154,46,0.08); border: 1px solid rgba(196,154,46,0.32);
    color: #C49A2E; cursor: pointer;
    transition: background .2s ease, transform .2s ease;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .lsc-btn-ghost:hover { background: rgba(196,154,46,0.15); transform: translateY(-1px); }

  /* Cancel button */
  .lsc-btn-cancel {
    flex: 1; padding: 10px; background: transparent;
    border: 1px solid rgba(196,154,46,0.22); border-radius: 2px;
    color: #B09070; font-family: 'Jost', sans-serif; font-size: 9px;
    font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s ease, color .2s ease;
  }
  .lsc-btn-cancel:hover { border-color: rgba(196,154,46,0.4); color: #F0E6D0; }

  /* Danger confirm button */
  .lsc-btn-danger {
    flex: 1; padding: 10px;
    background: rgba(226,68,68,0.12); border: 1px solid rgba(226,68,68,0.4);
    border-radius: 2px; color: #E24444;
    font-family: 'Jost', sans-serif; font-size: 9px;
    font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s ease;
  }
  .lsc-btn-danger:hover { background: rgba(226,68,68,0.2); }
  .lsc-btn-danger:disabled { opacity: .5; cursor: not-allowed; }

  /* Modal save button */
  .lsc-btn-save {
    flex: 1; padding: 10px;
    background: rgba(196,154,46,0.14); border: 1px solid rgba(196,154,46,0.45);
    border-radius: 2px; color: #C49A2E;
    font-family: 'Jost', sans-serif; font-size: 9px;
    font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s ease;
  }
  .lsc-btn-save:hover { background: rgba(196,154,46,0.22); }
  .lsc-btn-save:disabled { opacity: .5; cursor: not-allowed; }

  /* Input */
  .lsc-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(196,154,46,0.22); border-radius: 2px;
    padding: 10px 14px; color: #F0E6D0;
    font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 300;
    outline: none; transition: border-color .2s ease;
  }
  .lsc-input:focus { border-color: rgba(196,154,46,0.55); }
  .lsc-input.err { border-color: rgba(226,68,68,0.6); }
  .lsc-input::placeholder { color: rgba(176,144,112,0.4); }

  /* Search input */
  .lsc-search {
    width: 100%; background: #1A0F08;
    border: 1px solid rgba(196,154,46,0.2); border-radius: 2px;
    padding: 11px 14px 11px 40px; color: #F0E6D0;
    font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 300;
    outline: none; transition: border-color .2s ease;
  }
  .lsc-search:focus { border-color: rgba(196,154,46,0.48); }
  .lsc-search::placeholder { color: rgba(176,144,112,0.35); }

  /* Pagination button */
  .lsc-page-btn {
    width: 34px; height: 34px; border-radius: 2px; cursor: pointer;
    background: transparent; border: 1px solid rgba(196,154,46,0.18);
    color: #B09070; font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 300;
    transition: background .18s ease, border-color .18s ease, color .18s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .lsc-page-btn:hover:not(:disabled) { background: rgba(196,154,46,0.08); border-color: rgba(196,154,46,0.4); color: #C49A2E; }
  .lsc-page-btn.active { background: rgba(196,154,46,0.16); border-color: #C49A2E; color: #C49A2E; }
  .lsc-page-btn:disabled { opacity: .28; cursor: not-allowed; }

  .lsc-page-arrow {
    padding: 0 14px; height: 34px; border-radius: 2px; cursor: pointer;
    background: transparent; border: 1px solid rgba(196,154,46,0.18);
    color: #B09070; font-family: 'Jost', sans-serif; font-size: 14px;
    transition: background .18s ease, border-color .18s ease, color .18s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .lsc-page-arrow:hover:not(:disabled) { background: rgba(196,154,46,0.08); border-color: rgba(196,154,46,0.4); color: #C49A2E; }
  .lsc-page-arrow:disabled { opacity: .28; cursor: not-allowed; }

  /* Overlay */
  .lsc-overlay {
    position: fixed; inset: 0;
    background: rgba(6,3,1,0.82);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 50; padding: 24px;
    animation: overlayIn .22s ease both;
  }

  /* Modal box */
  .lsc-modal {
    background: #1A0F08;
    border: 1px solid rgba(196,154,46,0.28);
    border-radius: 2px;
    width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
    animation: modalIn .3s cubic-bezier(.22,1,.36,1) both;
    position: relative;
  }
  .lsc-modal::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(196,154,46,0.5), transparent);
  }

  /* Scrollbar */
  .lsc ::-webkit-scrollbar { width: 4px; }
  .lsc ::-webkit-scrollbar-track { background: #100B06; }
  .lsc ::-webkit-scrollbar-thumb { background: rgba(196,154,46,0.28); border-radius: 2px; }

  @media (max-width: 680px) {
    .lsc-grid2 { grid-template-columns: 1fr !important; }
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
  letterSpacing: '0.18em', textTransform: 'uppercase', color: col, ...x,
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

/* ─── StatusBadge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    ACTIVE:    { label: 'Active',    color: C.teal,    bg: 'rgba(93,202,165,0.1)',  border: 'rgba(93,202,165,0.35)'  },
    INACTIVE:  { label: 'Inactive',  color: C.silver,  bg: 'rgba(142,155,170,0.1)', border: 'rgba(142,155,170,0.35)' },
    SUSPENDED: { label: 'Suspended', color: C.red,     bg: 'rgba(226,68,68,0.08)',  border: 'rgba(226,68,68,0.35)'  },
  };
  const s = map[status] || map.INACTIVE;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 2, background: s.bg, border: `0.5px solid ${s.border}`, color: s.color }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ ...jost(9, 300, s.color), letterSpacing: '0.12em' }}>{s.label}</span>
    </span>
  );
}

/* ─── Overlay backdrop ──────────────────────────────────────────────────── */
function Overlay({ children }) {
  return <div className="lsc-overlay">{children}</div>;
}

/* ─── CustomerModal ─────────────────────────────────────────────────────── */
const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', address: '', status: 'ACTIVE' };

function CustomerModal({ customer, onClose, onSave }) {
  const [formData, setFormData] = useState(() =>
    customer
      ? { firstName: customer.firstName ?? '', lastName: customer.lastName ?? '', email: customer.email ?? '', phone: customer.phone ?? '', address: customer.address ?? '', status: customer.status ?? 'ACTIVE' }
      : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  function validate() {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim())  e.lastName  = 'Last name is required';
    if (!formData.email.trim())     e.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email address';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await onSave({
        firstName: formData.firstName.trim(),
        lastName:  formData.lastName.trim(),
        email:     formData.email.trim(),
        phone:     formData.phone?.trim()   || null,
        address:   formData.address?.trim() || null,
      });
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.code || err.message || 'Error saving guest';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (key) => `lsc-input${errors[key] ? ' err' : ''}`;
  const fieldLabel = { ...jost(9, 300, C.textSec), display: 'block', marginBottom: 6, letterSpacing: '0.12em' };
  const errMsg     = { ...jost(10, 300, C.red), textTransform: 'none', letterSpacing: 0, marginTop: 4 };

  return (
    <Overlay>
      <div className="lsc-modal">
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(196,154,46,0.18)' }}>
          <div>
            <Label color={C.gold} style={{ marginBottom: 5 }}>LuxStay Rewards</Label>
            <h2 style={{ ...serif(22, 300, C.textPrim) }}>
              {customer ? 'Edit Guest' : 'New Guest'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: C.textSec, fontSize: 16, cursor: 'pointer', opacity: 0.7, padding: 4, lineHeight: 1, transition: 'opacity .2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          >✕</button>
        </div>

        {/* Fields */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="lsc-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={fieldLabel}>First name *</label>
              <input className={inputClass('firstName')} type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="Amelia" />
              {errors.firstName && <p style={errMsg}>{errors.firstName}</p>}
            </div>
            <div>
              <label style={fieldLabel}>Last name *</label>
              <input className={inputClass('lastName')} type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Hartwell" />
              {errors.lastName && <p style={errMsg}>{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label style={fieldLabel}>Email *</label>
            <input className={inputClass('email')} type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="amelia.hartwell@luxstay.com" />
            {errors.email && <p style={errMsg}>{errors.email}</p>}
          </div>
          <div>
            <label style={fieldLabel}>Phone</label>
            <input className="lsc-input" type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+212 6XX-XXXXXX" />
          </div>
          <div>
            <label style={fieldLabel}>Address</label>
            <input className="lsc-input" type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="12 Avenue Mohammed V, Marrakesh" />
          </div>
          {customer && (
            <div>
              <label style={fieldLabel}>Status</label>
              <select
                className="lsc-input"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                style={{ appearance: 'none' }}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          )}
          {errors.submit && (
            <div style={{ background: 'rgba(226,68,68,0.08)', border: '0.5px solid rgba(226,68,68,0.35)', borderRadius: 2, padding: '10px 14px' }}>
              <p style={{ ...jost(11, 300, C.red), textTransform: 'none', letterSpacing: 0 }}>{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '1rem 1.75rem', borderTop: '1px solid rgba(196,154,46,0.14)' }}>
          <button className="lsc-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="lsc-btn-save" onClick={handleSubmit} disabled={loading}>
            {loading && (
              <span style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${C.gold}`, borderTopColor: 'transparent', animation: 'spin .8s linear infinite', display: 'inline-block', flexShrink: 0 }} />
            )}
            {customer ? '✓ Save Changes' : '✦ Create Guest'}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ─── DeleteDialog ──────────────────────────────────────────────────────── */
function DeleteDialog({ customer, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  async function handleDelete() { setLoading(true); await onConfirm(); setLoading(false); }

  return (
    <Overlay>
      <div className="lsc-modal" style={{ maxWidth: 380, padding: '2rem 1.75rem' }}>
        {/* Warning icon */}
        <div style={{ width: 46, height: 46, borderRadius: 2, background: 'rgba(226,68,68,0.1)', border: '0.5px solid rgba(226,68,68,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: C.red, fontSize: 20 }}>⚠</div>
        <h3 style={{ ...serif(22, 300, C.textPrim), textAlign: 'center', marginBottom: 10 }}>Remove this guest?</h3>
        <p style={{ ...jost(12, 200, C.textMut), textTransform: 'none', letterSpacing: 0, textAlign: 'center', marginBottom: 24, lineHeight: 1.7 }}>
          <span style={{ color: C.textPrim }}>{customer.firstName} {customer.lastName}</span> will be permanently removed. This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="lsc-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="lsc-btn-danger" onClick={handleDelete} disabled={loading}>
            {loading && (
              <span style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid #E24444', borderTopColor: 'transparent', animation: 'spin .8s linear infinite', display: 'inline-block', flexShrink: 0 }} />
            )}
            Remove guest
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function Customers({ addToast }) {
  const { authenticated } = useAuth();
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [modal, setModal]           = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ── logique inchangée ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!authenticated) { setLoading(false); return; }
    loadCustomers();
  }, [authenticated]);

  async function loadCustomers() {
    setLoading(true);
    try { const r = await customerAPI.getAll(); setCustomers(r.data); }
    catch { addToast?.('Unable to load guests', 'error'); }
    finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search]);

  async function handleSave(form) {
    if (modal === 'create') {
      const { data } = await customerAPI.create(form);
      setCustomers(prev => [data, ...prev]);
      addToast?.('Guest created', 'success');
    } else {
      const { data } = await customerAPI.update(modal.id, form);
      setCustomers(prev => prev.map(c => c.id === modal.id ? data : c));
      addToast?.('Guest updated', 'success');
    }
  }

  async function handleDelete() {
    try {
      await customerAPI.delete(deleteTarget.id);
      setCustomers(prev => prev.filter(c => c.id !== deleteTarget.id));
      addToast?.('Guest removed', 'success');
    } catch {
      addToast?.('Error removing guest', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }
  /* ── fin logique ───────────────────────────────────────────────────────── */

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="lsc" style={{ minHeight: '100vh', background: C.bg, color: C.textPrim, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <header style={{ position: 'relative', overflow: 'hidden', background: C.bgLayer, borderBottom: '1px solid rgba(196,154,46,0.18)' }}>
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

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '2.8rem 2.5rem 2.4rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            {/* Badge */}
            <div className="lsc-fu1" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 14, padding: '4px 16px', border: '0.5px solid rgba(196,154,46,0.34)', background: 'rgba(196,154,46,0.09)', backdropFilter: 'blur(8px)' }}>
              <span style={{ color: C.goldBrt, fontSize: 9 }}>✦</span>
              <Label color={C.goldPale} style={{ letterSpacing: '0.34em' }}>LuxStay Rewards · Administration</Label>
              <span style={{ color: C.goldBrt, fontSize: 9 }}>✦</span>
            </div>
            {/* Title */}
            <h1 className="lsc-fu2" style={{ ...serif(52, 300, '#FFFFFF'), lineHeight: 1.05, letterSpacing: '0.01em', marginBottom: 8 }}>
              Guest{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 200 }}>Management</span>
            </h1>
            {/* Date + count */}
            <div className="lsc-fu3" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 1, background: `linear-gradient(to right, ${C.goldBrt}, transparent)` }} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 11, color: 'rgba(240,225,200,0.52)', letterSpacing: '0.07em' }}>
                {today} · {customers.length} registered guest{customers.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {/* Add guest button */}
          <div className="lsc-fu4">
            <button className="lsc-btn-gold" onClick={() => setModal('create')}>
              ✦ Add guest
            </button>
          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '0 2.5rem 5rem' }}>

        <GoldDivider label="Guest Registry" />

        {/* Search bar */}
        <div className="lsc-fu2" style={{ position: 'relative', maxWidth: 440, marginBottom: 20 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.gold, fontSize: 15, opacity: 0.4, pointerEvents: 'none' }}>⌕</span>
          <input
            className="lsc-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
          />
        </div>

        {/* Table panel */}
        <div className="lsc-fu3" style={{ background: C.bgPanel, border: '1px solid rgba(196,154,46,0.16)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
          {/* Top shimmer line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,154,46,0.4), transparent)' }} />

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${C.gold}`, borderTopColor: 'transparent', animation: 'spin .8s linear infinite' }} />
            </div>

          ) : paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <p style={{ ...serif(38, 300, C.textSec), marginBottom: 12 }}>◈</p>
              <Label style={{ marginBottom: 8 }}>{search ? 'No results for this search' : 'No guests registered yet'}</Label>
              {!search && (
                <button
                  onClick={() => setModal('create')}
                  style={{ marginTop: 16, ...jost(11, 300, C.gold), background: 'none', border: 'none', cursor: 'pointer', opacity: 0.8 }}
                >
                  ✦ Add the first guest
                </button>
              )}
            </div>

          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(196,154,46,0.15)' }}>
                    {['ID', 'Guest', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '13px 20px', ...jost(9, 300, C.textSec), fontWeight: 300 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((customer) => (
                    <tr key={customer.id} className="lsc-tr">
                      {/* ID */}
                      <td style={{ padding: '13px 20px', fontFamily: 'monospace', fontSize: 11, color: C.textDim }}>
                        #{customer.id}
                      </td>
                      {/* Name + avatar */}
                      <td style={{ padding: '13px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 2, flexShrink: 0, background: 'rgba(196,154,46,0.12)', border: '0.5px solid rgba(196,154,46,0.28)', color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 400 }}>
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </div>
                          <p style={{ ...serif(15, 400, C.textPrim) }}>
                            {customer.firstName} {customer.lastName}
                          </p>
                        </div>
                      </td>
                      {/* Email */}
                      <td style={{ padding: '13px 20px', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: C.textSec }}>
                        {customer.email}
                      </td>
                      {/* Phone */}
                      <td style={{ padding: '13px 20px', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: C.textMut }}>
                        {customer.phone || '—'}
                      </td>
                      {/* Status */}
                      <td style={{ padding: '13px 20px' }}>
                        <StatusBadge status={customer.status || 'ACTIVE'} />
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '13px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="lsc-btn-edit" onClick={() => setModal(customer)}>Edit</button>
                          <button className="lsc-btn-remove" onClick={() => setDeleteTarget(customer)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 200, color: C.textDim, letterSpacing: '0.04em' }}>
              {filtered.length} results — Page {page} of {totalPages}
            </p>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button className="lsc-page-arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + idx;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button key={p} className={`lsc-page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button className="lsc-page-arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      {modal && (
        <CustomerModal
          key={modal === 'create' ? 'create' : modal.id}
          customer={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          customer={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}