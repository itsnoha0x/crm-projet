// Page Cartes de Fidélité - Affichage visuel et gestion des cartes
import React, { useState, useEffect } from 'react';
import { customerAPI, loyaltyAPI, pointsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoyaltyCardWidget from '../components/LoyaltyCardWidget';

// Seuils de points par niveau
const TIER_THRESHOLDS = {
  SILVER: { next: 'GOLD', needed: 1000, label: 'Silver → Gold' },
  GOLD: { next: 'PLATINUM', needed: 5000, label: 'Gold → Platinum' },
  PLATINUM: { next: null, needed: null, label: 'Niveau maximum' },
};

// Barre de progression vers le prochain niveau
function TierProgress({ cardType, currentBalance }) {
  const tier = TIER_THRESHOLDS[cardType] || TIER_THRESHOLDS.SILVER;

  if (!tier.needed) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-violet-400">★</span>
        <span className="text-violet-300 font-medium">Niveau maximum atteint</span>
      </div>
    );
  }

  const progress = Math.min(100, (currentBalance / tier.needed) * 100);
  const barColor = cardType === 'SILVER' ? 'bg-amber-500' : 'bg-violet-500';

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{tier.label}</span>
        <span className="text-slate-300 font-medium">
          {currentBalance.toLocaleString('fr-FR')} / {tier.needed.toLocaleString('fr-FR')} pts
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {Math.max(0, tier.needed - currentBalance).toLocaleString('fr-FR')} points restants
      </p>
    </div>
  );
}

// Modal de création de carte
function CreateCardModal({ customer, onClose, onCreated }) {
  const [cardType, setCardType] = useState('SILVER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setLoading(true);
    setError('');
    try {
      const { data } = await loyaltyAPI.createCard({
        customerId: customer.id,
        cardType,
      });
      onCreated(data);
      onClose();
    } catch (err) {
      const backendMessage = err?.response?.data?.message || '';
      if (backendMessage.toLowerCase().includes('déjà une carte') || backendMessage.toLowerCase().includes('deja une carte')) {
        setError('Ce client a déjà une carte de fidélité.');
      } else {
        setError('Erreur lors de la création de la carte');
      }
    } finally {
      setLoading(false);
    }
  }

  const cardColors = {
    SILVER: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
    GOLD: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    PLATINUM: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-white font-semibold">Créer une carte de fidélité</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">Client</p>
            <p className="text-white font-medium">{customer.firstName} {customer.lastName}</p>
            <p className="text-slate-500 text-sm">{customer.email}</p>
          </div>

          <div>
            <p className="text-slate-400 text-xs font-medium mb-3">Type de carte</p>
            <div className="space-y-2">
              {['SILVER', 'GOLD', 'PLATINUM'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCardType(type)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                    ${cardType === type
                      ? cardColors[type]
                      : 'border-slate-800 bg-slate-800/50 text-slate-500 hover:border-slate-600'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
                    ${type === 'SILVER' ? 'bg-slate-500/20' : type === 'GOLD' ? 'bg-amber-500/20' : 'bg-violet-500/20'}`}
                  >
                    {type === 'SILVER' ? '◈' : type === 'GOLD' ? '◆' : '★'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{type}</p>
                    <p className="text-xs opacity-60">
                      {type === 'SILVER' ? 'Niveau d\'entrée' : type === 'GOLD' ? 'Niveau intermédiaire' : 'Niveau supérieur'}
                    </p>
                  </div>
                  {cardType === type && <span className="ml-auto text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm">
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Créer la carte
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoyaltyCards({ addToast }) {
  const { authenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [cards, setCards] = useState({}); // { customerId: card }
  const [balances, setBalances] = useState({}); // { customerId: balance }
  const [loading, setLoading] = useState(true);
  const [createFor, setCreateFor] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }
    loadAll();
  }, [authenticated]);

  async function loadAll() {
    setLoading(true);
    try {
      const { data: customerList } = await customerAPI.getAll();
      setCustomers(customerList);

      // Charger les cartes et soldes en parallèle
      await Promise.all(
        customerList.map(async (c) => {
          try {
            const cardRes = await loyaltyAPI.getCardByCustomer(c.id);
            setCards((prev) => ({ ...prev, [c.id]: cardRes.data }));
          } catch {
            // Client sans carte
          }

          try {
            const balanceRes = await pointsAPI.getBalance(c.id);
            setBalances((prev) => ({ ...prev, [c.id]: balanceRes.data?.currentBalance || 0 }));
          } catch {
            setBalances((prev) => ({ ...prev, [c.id]: 0 }));
          }
        })
      );
    } catch (err) {
      addToast?.('Impossible de charger les données', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleCardCreated(card) {
    setCards((prev) => ({ ...prev, [card.customerId]: card }));
    addToast?.('Carte créée avec succès', 'success');
  }

  // Filtrage
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  const withCard = filtered.filter((c) => cards[c.id]);
  const withoutCard = filtered.filter((c) => !cards[c.id]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* En-tête */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Cartes de Fidélité</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {Object.keys(cards).length} carte{Object.keys(cards).length !== 1 ? 's' : ''} émise{Object.keys(cards).length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client..."
              className="bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Clients avec carte */}
            {withCard.length > 0 && (
              <section>
                <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-sm">✓</span>
                  Cartes émises
                  <span className="text-slate-600 text-sm font-normal">({withCard.length})</span>
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {withCard.map((customer) => {
                    const card = cards[customer.id];
                    const balance = balances[customer.id] || 0;
                    return (
                      <div
                        key={customer.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                      >
                        {/* Carte visuelle */}
                        <div className="flex justify-center mb-5">
                          <LoyaltyCardWidget
                            cardNumber={card.cardNumber}
                            customerName={`${customer.firstName} ${customer.lastName}`}
                            cardType={card.cardType}
                            issueDate={card.issueDate}
                            expiryDate={card.expiryDate}
                          />
                        </div>

                        {/* Infos et progression */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{customer.firstName} {customer.lastName}</p>
                              <p className="text-slate-500 text-sm">{customer.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">{balance.toLocaleString('fr-FR')}</p>
                              <p className="text-slate-500 text-xs">points</p>
                            </div>
                          </div>

                          <div className="bg-slate-800/60 rounded-xl p-4">
                            <TierProgress cardType={card.cardType} currentBalance={balance} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Clients sans carte */}
            {withoutCard.length > 0 && (
              <section>
                <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700/60 text-slate-400 flex items-center justify-center text-sm">○</span>
                  Sans carte
                  <span className="text-slate-600 text-sm font-normal">({withoutCard.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {withoutCard.map((customer) => (
                    <div
                      key={customer.id}
                      className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-5 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-sm font-bold">
                          {customer.firstName?.[0]}{customer.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{customer.firstName} {customer.lastName}</p>
                          <p className="text-slate-600 text-xs">{customer.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCreateFor(customer)}
                        className="w-full py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-medium transition-all"
                      >
                        + Émettre une carte
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-24 text-slate-600">
                <div className="text-5xl mb-3">○</div>
                <p className="text-slate-500">Aucun résultat</p>
              </div>
            )}
          </>
        )}
      </div>

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
