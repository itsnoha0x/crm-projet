import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { benefitsAPI, loyaltyAPI, pointsAPI } from '../services/api';

const TIER_META = {
  SILVER: { color: 'bg-slate-400', next: 1000 },
  GOLD: { color: 'bg-amber-400', next: 5000 },
  PLATINUM: { color: 'bg-violet-500', next: null },
};

export default function CustomerDashboard({ addToast }) {
  const { customerId } = useParams();
  const [card, setCard] = useState(null);
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reservationForm, setReservationForm] = useState({ nbNuits: 1, prixNuitEuros: 120 });

  const tier = card?.cardType || 'SILVER';
  const tierMeta = TIER_META[tier] || TIER_META.SILVER;
  const currentPoints = balance?.currentBalance || 0;
  const progress = useMemo(() => {
    if (!tierMeta.next) return 100;
    const base = tier === 'GOLD' ? 1000 : 0;
    const span = tierMeta.next - base;
    const inTier = Math.max(0, currentPoints - base);
    return Math.min(100, Math.round((inTier / span) * 100));
  }, [tier, tierMeta.next, currentPoints]);

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
    } catch (error) {
      addToast?.('Erreur chargement dashboard client', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) load();
  }, [customerId]);

  const simulateReservation = async (e) => {
    e.preventDefault();
    try {
      await pointsAPI.simulateReservation({
        customerId,
        nbNuits: Number(reservationForm.nbNuits),
        prixNuitEuros: Number(reservationForm.prixNuitEuros),
        typeChambres: 'DOUBLE',
        dateArrivee: new Date().toISOString().slice(0, 10),
      });
      addToast?.('Sejour simule et points credites', 'success');
      setShowForm(false);
      await load();
    } catch (error) {
      addToast?.('Echec simulation sejour', 'error');
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-200">Chargement du dashboard...</div>;
  }

  return (
    <div className="p-6 text-slate-100 space-y-6">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <span className={`inline-block h-3 w-3 rounded-full ${tierMeta.color}`} />
          <p className="font-semibold">Tier actuel: {tier}</p>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-700">
          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-300">
          {tierMeta.next ? `${currentPoints} / ${tierMeta.next} points` : 'Niveau maximum atteint'}
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="font-semibold mb-2">Carte de fidelite</h2>
        <p>Numero: {card?.cardNumber}</p>
        <p>Type: {card?.cardType}</p>
        <p>Status: {card?.status}</p>
        <p>Date creation: {card?.issueDate}</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="font-semibold mb-2">5 dernieres transactions</h2>
        <ul className="space-y-2 text-sm">
          {history.map((tx) => (
            <li key={tx.id} className="border-b border-slate-800 pb-2">
              {tx.transactionType} | {tx.points} pts | {tx.reference || 'N/A'}
            </li>
          ))}
          {history.length === 0 && <li>Aucune transaction</li>}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="font-semibold mb-2">Avantages actifs ({tier})</h2>
        <ul className="space-y-2 text-sm">
          {benefits.map((b) => (
            <li key={b.id}>
              <strong>{b.title}</strong> - {b.description}
            </li>
          ))}
          {benefits.length === 0 && <li>Aucun avantage</li>}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded bg-emerald-500 px-4 py-2 font-medium text-slate-900"
        >
          Simuler un sejour
        </button>
        {showForm && (
          <form onSubmit={simulateReservation} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              type="number"
              min="1"
              value={reservationForm.nbNuits}
              onChange={(e) => setReservationForm((f) => ({ ...f, nbNuits: e.target.value }))}
              className="rounded bg-slate-800 p-2"
              placeholder="Nombre de nuits"
            />
            <input
              type="number"
              min="1"
              value={reservationForm.prixNuitEuros}
              onChange={(e) => setReservationForm((f) => ({ ...f, prixNuitEuros: e.target.value }))}
              className="rounded bg-slate-800 p-2"
              placeholder="Prix par nuit"
            />
            <button type="submit" className="rounded bg-indigo-500 px-4 py-2 font-medium md:col-span-2">
              Lancer la simulation
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
