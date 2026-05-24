// Page Tableau de bord - Vue d'ensemble du CRM Loyalty
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { customerAPI, loyaltyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Couleurs par niveau de fidélité
const TIER_COLORS = {
  Silver: '#94a3b8',
  Gold: '#f59e0b',
  Platinum: '#8b5cf6',
};

const TIER_BADGES = {
  SILVER: 'bg-gray-500/20 text-gray-200 border-gray-400/30',
  GOLD: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30',
  PLATINUM: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
};

// Carte de statistique réutilisable
function StatCard({ label, value, sub, icon, gradient, loading }) {
  return (
    <div className={`rounded-2xl p-6 text-white shadow-xl relative overflow-hidden ${gradient}`}>
      <div className="absolute -right-4 -top-4 text-6xl opacity-10">{icon}</div>
      <div className="relative">
        <p className="text-white/70 text-sm font-medium mb-1">{label}</p>
        {loading ? (
          <div className="h-9 w-24 bg-white/20 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-4xl font-bold tracking-tight">{value ?? '—'}</p>
        )}
        {sub && <p className="text-white/60 text-xs mt-2">{sub}</p>}
      </div>
    </div>
  );
}

// Tooltip personnalisé pour le graphique
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-slate-300 text-sm mb-1">{label}</p>
        <p className="text-white font-bold text-lg">{payload[0].value} clients</p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { authenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      let customerList = [];

      try {
        const { data } = await customerAPI.getAll();
        customerList = Array.isArray(data) ? data : [];
        setCustomers(customerList);
      } catch (err) {
        console.error('Dashboard load error:', err?.response?.status, err?.message);
        setCustomers([]);
      }

      try {
        const cardPromises = customerList.slice(0, 20).map((c) =>
          loyaltyAPI.getCardByCustomer(c.id).catch(() => null)
        );
        const cardResults = await Promise.all(cardPromises);
        setCards(cardResults.filter(Boolean).map((r) => r.data));
      } catch (err) {
        console.error('Cards load error:', err?.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authenticated]);

  // Calculer les statistiques par niveau
  const tierCounts = cards.reduce(
    (acc, card) => {
      const t = card?.cardType || 'SILVER';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    },
    { SILVER: 0, GOLD: 0, PLATINUM: 0 }
  );

  const chartData = [
    { name: 'Silver', count: tierCounts.SILVER, fill: TIER_COLORS.Silver },
    { name: 'Gold', count: tierCounts.GOLD, fill: TIER_COLORS.Gold },
    { name: 'Platinum', count: tierCounts.PLATINUM, fill: TIER_COLORS.Platinum },
  ];

  // Activité récente simulée (dans un vrai projet, viendrait de l'API)
  const recentActivity = customers.slice(0, 5).map((c, i) => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    action: i % 3 === 0 ? 'Carte créée' : i % 3 === 1 ? 'Points gagnés' : 'Points utilisés',
    time: `${i + 1}h ago`,
    type: i % 3,
  }));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* En-tête gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, #1e40af44 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #7c3aed33 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                CRM Loyalty System
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Tableau de bord — Vue d'ensemble en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Clients"
            value={customers.length}
            sub="Tous statuts confondus"
            icon="👥"
            gradient="bg-gradient-to-br from-blue-600 to-blue-800"
            loading={loading}
          />
          <StatCard
            label="Cartes Actives"
            value={cards.length}
            sub="Cartes de fidélité émises"
            icon="💳"
            gradient="bg-gradient-to-br from-emerald-600 to-teal-800"
            loading={loading}
          />
          <div className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-700">
            <div className="absolute -right-4 -top-4 text-6xl opacity-10">✦</div>
            <div className="relative">
              <p className="text-white/70 text-sm font-medium mb-3">Types de Cartes</p>
              {loading ? (
                <div className="h-9 w-32 bg-white/20 rounded-lg animate-pulse" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {['SILVER', 'GOLD', 'PLATINUM'].map((type) => (
                    <span key={type} className={`rounded-full border px-2.5 py-1 text-xs font-bold ${TIER_BADGES[type]}`}>
                      {type}: {tierCounts[type]}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-white/60 text-xs mt-3">Répartition actuelle</p>
            </div>
          </div>
          <StatCard
            label="Membres Platinum"
            value={tierCounts.PLATINUM}
            sub="Niveau supérieur"
            icon="◆"
            gradient="bg-gradient-to-br from-violet-600 to-purple-900"
            loading={loading}
          />
        </div>

        {/* Graphique + Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique barres */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-white font-semibold text-lg mb-1">Répartition par Niveau</h2>
            <p className="text-slate-500 text-sm mb-6">Distribution des clients par palier de fidélité</p>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                    axisLine={{ stroke: '#1e293b' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Activité récente */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-white font-semibold text-lg mb-1">Activité Récente</h2>
            <p className="text-slate-500 text-sm mb-4">Dernières actions enregistrées</p>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <div className="text-4xl mb-2">○</div>
                <p className="text-sm">Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
                      ${item.type === 0
                        ? 'bg-blue-500/20 text-blue-400'
                        : item.type === 1
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {item.type === 0 ? '💳' : item.type === 1 ? '+' : '−'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-slate-500 text-xs">{item.action}</p>
                    </div>
                    <span className="text-slate-600 text-xs flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Légende des niveaux */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { level: 'Silver', desc: 'Niveau d\'entrée — jusqu\'à 999 pts', color: 'from-slate-500 to-slate-600', icon: '◈' },
            { level: 'Gold', desc: 'Niveau intermédiaire — 1 000 à 4 999 pts', color: 'from-amber-500 to-amber-600', icon: '◆' },
            { level: 'Platinum', desc: 'Niveau supérieur — 5 000 pts et plus', color: 'from-violet-500 to-violet-600', icon: '★' },
          ].map((t) => (
            <div
              key={t.level}
              className={`bg-gradient-to-br ${t.color} rounded-2xl p-5 text-white relative overflow-hidden`}
            >
              <div className="absolute -right-2 -bottom-2 text-5xl opacity-10">{t.icon}</div>
              <div className="text-2xl mb-2">{t.icon}</div>
              <h3 className="font-bold text-lg">{t.level}</h3>
              <p className="text-white/70 text-xs mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
