// Page Gestion des Points - Consultation et transactions
import React, { useState, useMemo, useEffect } from 'react';
import { customerAPI, loyaltyAPI, pointsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Badge de type de transaction
function TxBadge({ type }) {
  const isEarned = type === 'EARNED' || type === 'BONUS' || type === 'ADJUSTMENT';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
      ${isEarned ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}
    >
      <span>{isEarned ? '▲' : '▼'}</span>
      {isEarned ? 'Gagné' : 'Utilisé'}
    </span>
  );
}

// Formulaire de gain de points
function EarnForm({ customerId, card, onSuccess, addToast }) {
  const [form, setForm] = useState({ points: '', reference: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.points || isNaN(form.points) || Number(form.points) <= 0)
      e.points = 'Entrez un nombre de points valide';
    if (!form.reference.trim()) e.reference = 'Référence obligatoire';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await pointsAPI.earn({
        customerId,
        loyaltyCardId: card.id,
        points: Number(form.points),
        reference: form.reference,
        description: form.description,
      });
      setForm({ points: '', reference: '', description: '' });
      setErrors({});
      onSuccess();
      addToast?.(`${form.points} points ajoutés`, 'success');
    } catch (err) {
      addToast?.(err.userMessage || 'Erreur lors de l\'ajout de points', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-5">
      <h3 className="text-emerald-400 font-semibold text-sm mb-4 flex items-center gap-2">
        <span>▲</span> Ajouter des points
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-slate-500 text-xs mb-1.5 block">Points *</label>
          <input
            type="number"
            value={form.points}
            onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
            placeholder="100"
            min="1"
            className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:ring-2 transition-all
              ${errors.points ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
          />
          {errors.points && <p className="text-red-400 text-xs mt-1">{errors.points}</p>}
        </div>
        <div>
          <label className="text-slate-500 text-xs mb-1.5 block">Référence *</label>
          <input
            type="text"
            value={form.reference}
            onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
            placeholder="ACHAT-2024-001"
            className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:ring-2 transition-all
              ${errors.reference ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
          />
          {errors.reference && <p className="text-red-400 text-xs mt-1">{errors.reference}</p>}
        </div>
        <div>
          <label className="text-slate-500 text-xs mb-1.5 block">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Achat en boutique..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Ajouter les points
        </button>
      </div>
    </div>
  );
}

// Formulaire de remboursement de points
function RedeemForm({ customerId, card, currentBalance, onSuccess, addToast }) {
  const [form, setForm] = useState({ points: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    const pts = Number(form.points);
    if (!form.points || isNaN(pts) || pts <= 0) e.points = 'Entrez un nombre de points valide';
    else if (pts > currentBalance) e.points = `Solde insuffisant (max: ${currentBalance})`;
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await pointsAPI.redeem({
        customerId,
        loyaltyCardId: card.id,
        points: Number(form.points),
        reference: `REDEEM-${Date.now()}`,
        description: form.description,
      });
      setForm({ points: '', description: '' });
      setErrors({});
      onSuccess();
      addToast?.(`${form.points} points utilisés`, 'success');
    } catch (err) {
      addToast?.(err.userMessage || 'Erreur lors de l\'utilisation de points', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-5">
      <h3 className="text-red-400 font-semibold text-sm mb-4 flex items-center gap-2">
        <span>▼</span> Utiliser des points
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-slate-500 text-xs mb-1.5 block">Points à utiliser *</label>
          <input
            type="number"
            value={form.points}
            onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
            placeholder="50"
            min="1"
            max={currentBalance}
            className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:ring-2 transition-all
              ${errors.points ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-red-500 focus:ring-red-500/20'}`}
          />
          {errors.points && <p className="text-red-400 text-xs mt-1">{errors.points}</p>}
        </div>
        <div>
          <label className="text-slate-500 text-xs mb-1.5 block">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Remise sur achat..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || currentBalance === 0}
          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Utiliser les points
        </button>
      </div>
    </div>
  );
}

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
    customerAPI.getAll().then((res) => setAllCustomers(res.data)).catch(() => {});
  }, [authenticated]);

  // Recherche filtrée
  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allCustomers
      .filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [search, allCustomers]);

  async function selectCustomer(customer) {
    setSelectedCustomer(customer);
    setSearch('');
    setLoading(true);
    try {
      const [cardRes, balRes, histRes] = await Promise.allSettled([
        loyaltyAPI.getCardByCustomer(customer.id),
        pointsAPI.getBalance(customer.id),
        pointsAPI.getHistory(customer.id),
      ]);
      setCard(cardRes.status === 'fulfilled' ? cardRes.value.data : null);
      setBalance(balRes.status === 'fulfilled' ? balRes.value.data?.currentBalance || 0 : 0);
      setHistory(histRes.status === 'fulfilled' ? histRes.value.data : []);
    } catch {
      addToast?.('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    if (!selectedCustomer) return;
    try {
      const [balRes, histRes] = await Promise.all([
        pointsAPI.getBalance(selectedCustomer.id),
        pointsAPI.getHistory(selectedCustomer.id),
      ]);
      setBalance(balRes.data?.currentBalance || 0);
      setHistory(histRes.data || []);
    } catch {}
  }

  // Calcul du solde courant par transaction
  const historyWithBalance = useMemo(() => {
    let running = balance;
    return history.map((tx) => {
      const current = running;
      running -= tx.points || 0;
      return { ...tx, runningBalance: current };
    });
  }, [history, balance]);

  const CARD_TYPE_LABELS = { SILVER: '◈ Silver', GOLD: '◆ Gold', PLATINUM: '★ Platinum' };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* En-tête */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-2xl font-bold">Gestion des Points</h1>
          <p className="text-slate-500 text-sm mt-0.5">Consultation du solde et enregistrement des transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Recherche client */}
        <div className="max-w-lg mb-8 relative">
          <label className="text-slate-400 text-sm font-medium mb-2 block">Rechercher un client</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom ou email du client..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          {/* Dropdown de résultats */}
          {filtered.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCustomer(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                    {c.firstName?.[0]}{c.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{c.firstName} {c.lastName}</p>
                    <p className="text-slate-500 text-xs">{c.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contenu selon l'état */}
        {!selectedCustomer ? (
          <div className="text-center py-24 text-slate-600">
            <div className="text-5xl mb-3">◇</div>
            <p className="text-slate-500 font-medium">Recherchez un client pour gérer ses points</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info client + solde */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-blue-500/20 flex items-center justify-center text-white text-xl font-bold">
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-xl">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h2>
                    <p className="text-slate-500 text-sm">{selectedCustomer.email}</p>
                    {card && (
                      <span className="text-xs text-slate-500 mt-1 inline-block">
                        Carte {CARD_TYPE_LABELS[card.cardType] || card.cardType}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-slate-500 text-sm mb-1">Solde actuel</p>
                  <p className="text-5xl font-bold text-white tracking-tight">
                    {balance.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-slate-500 text-sm">points</p>
                </div>
              </div>
            </div>

            {!card ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
                <p className="text-amber-400 font-medium">Ce client n'a pas encore de carte de fidélité</p>
                <p className="text-slate-500 text-sm mt-1">Créez d'abord une carte depuis la page "Cartes Fidélité"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EarnForm customerId={selectedCustomer.id} card={card} onSuccess={refreshData} addToast={addToast} />
                <RedeemForm customerId={selectedCustomer.id} card={card} currentBalance={balance} onSuccess={refreshData} addToast={addToast} />
              </div>
            )}

            {/* Historique des transactions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-800">
                <h3 className="text-white font-semibold">Historique des transactions</h3>
              </div>
              {historyWithBalance.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <p>Aucune transaction enregistrée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        {['Date', 'Type', 'Points', 'Référence', 'Description', 'Solde'].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {historyWithBalance.map((tx, i) => {
                        const txType = tx.transactionType;
                        const isEarned = txType === 'EARNED' || txType === 'BONUS' || txType === 'ADJUSTMENT';
                        return (
                          <tr key={tx.id || i} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 text-slate-400 text-sm whitespace-nowrap">
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('fr-FR') : '—'}
                            </td>
                            <td className="px-6 py-4"><TxBadge type={txType} /></td>
                            <td className={`px-6 py-4 font-bold text-sm ${isEarned ? 'text-emerald-400' : 'text-red-400'}`}>
                              {tx.points > 0 ? '+' : ''}{tx.points?.toLocaleString('fr-FR') || 0}
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm font-mono">{tx.reference || '—'}</td>
                            <td className="px-6 py-4 text-slate-400 text-sm max-w-48 truncate">{tx.description || '—'}</td>
                            <td className="px-6 py-4 text-white font-medium text-sm">
                              {tx.runningBalance?.toLocaleString('fr-FR')} pts
                            </td>
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
      </div>
    </div>
  );
}
