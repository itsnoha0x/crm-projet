// Page Avantages - Comparaison des niveaux de fidélité
import React, { useState, useEffect } from 'react';
import { benefitsAPI } from '../services/api';

// Avantages par défaut pour l'affichage hors-ligne
const DEFAULT_BENEFITS = {
  SILVER: [
    'Accès aux offres exclusives membres',
    'Points bonus x1 sur tous les achats',
    'Newsletter mensuelle avec promotions',
    'Accès à l\'espace membre en ligne',
    'Support client prioritaire',
  ],
  GOLD: [
    'Tous les avantages Silver',
    'Points bonus x2 sur tous les achats',
    'Livraison gratuite dès 50 MAD',
    'Accès aux ventes privées',
    'Cadeau anniversaire offert',
    'Remise 5% sur les nouveautés',
    'Hotline dédiée Gold',
  ],
  PLATINUM: [
    'Tous les avantages Gold',
    'Points bonus x3 sur tous les achats',
    'Livraison gratuite sans minimum',
    'Accès anticipé aux nouvelles collections',
    'Concierge personnel dédié',
    'Remise 10% permanente',
    'Invitations événements exclusifs',
    'Retours gratuits illimités',
    'Programme parrain premium',
  ],
};

// Configuration visuelle par niveau
const TIER_CONFIG = {
  SILVER: {
    gradient: 'from-slate-600 to-slate-700',
    border: 'border-slate-500/30',
    icon: '◈',
    iconBg: 'bg-slate-500/20',
    iconColor: 'text-slate-300',
    checkColor: 'text-slate-400',
    highlight: false,
    label: 'Silver',
    points: 'jusqu\'à 999 pts',
    price: 'Gratuit',
  },
  GOLD: {
    gradient: 'from-amber-500 to-amber-600',
    border: 'border-amber-500/40',
    icon: '◆',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
    checkColor: 'text-amber-400',
    highlight: true,
    label: 'Gold',
    points: '1 000 – 4 999 pts',
    price: 'Populaire',
  },
  PLATINUM: {
    gradient: 'from-violet-600 to-violet-700',
    border: 'border-violet-500/40',
    icon: '★',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-300',
    checkColor: 'text-violet-400',
    highlight: false,
    label: 'Platinum',
    points: '5 000 pts et plus',
    price: 'Premium',
  },
};

// Carte d'avantages pour un niveau
function BenefitCard({ tier, benefits, loading }) {
  const config = TIER_CONFIG[tier];

  return (
    <div className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all ${config.border} ${config.highlight ? 'ring-2 ring-amber-500/40 shadow-2xl shadow-amber-500/10 scale-[1.02]' : ''}`}>
      {/* Badge populaire */}
      {config.highlight && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          ⭐ Populaire
        </div>
      )}

      {/* En-tête coloré */}
      <div className={`bg-gradient-to-br ${config.gradient} p-6`}>
        <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center text-2xl mb-4`}>
          <span className={config.iconColor}>{config.icon}</span>
        </div>
        <h2 className="text-white text-2xl font-bold">{config.label}</h2>
        <p className="text-white/60 text-sm mt-1">{config.points}</p>
        <div className="mt-4 inline-block bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <span className="text-white text-sm font-medium">{config.price}</span>
        </div>
      </div>

      {/* Liste des avantages */}
      <div className="flex-1 bg-slate-900 p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-slate-800 rounded animate-pulse" style={{ width: `${70 + i * 5}%` }} />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {benefits.map((benefit, i) => {
              const text = typeof benefit === 'string' ? benefit : benefit.description || benefit.title || JSON.stringify(benefit);
              const isInherited = text.startsWith('Tous les avantages');
              return (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-0.5 flex-shrink-0 text-sm font-bold ${config.checkColor}`}>
                    {isInherited ? '↑' : '✓'}
                  </span>
                  <span className={`text-sm leading-relaxed ${isInherited ? 'text-slate-500 italic' : 'text-slate-300'}`}>
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pied de carte */}
      <div className="bg-slate-900 border-t border-slate-800 p-5">
        <div className={`w-full py-3 rounded-xl text-center text-sm font-semibold bg-gradient-to-r ${config.gradient} text-white shadow-lg`}>
          Niveau {config.label}
        </div>
      </div>
    </div>
  );
}

export default function Benefits() {
  const [benefits, setBenefits] = useState({
    SILVER: DEFAULT_BENEFITS.SILVER,
    GOLD: DEFAULT_BENEFITS.GOLD,
    PLATINUM: DEFAULT_BENEFITS.PLATINUM,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBenefits() {
      setLoading(true);
      try {
        // Charger les avantages des 3 niveaux en parallèle
        const [silverRes, goldRes, platRes] = await Promise.allSettled([
          benefitsAPI.getByCardType('SILVER'),
          benefitsAPI.getByCardType('GOLD'),
          benefitsAPI.getByCardType('PLATINUM'),
        ]);

        setBenefits({
          SILVER: silverRes.status === 'fulfilled' && silverRes.value.data?.length
            ? silverRes.value.data
            : DEFAULT_BENEFITS.SILVER,
          GOLD: goldRes.status === 'fulfilled' && goldRes.value.data?.length
            ? goldRes.value.data
            : DEFAULT_BENEFITS.GOLD,
          PLATINUM: platRes.status === 'fulfilled' && platRes.value.data?.length
            ? platRes.value.data
            : DEFAULT_BENEFITS.PLATINUM,
        });
      } catch {
        // Utiliser les données par défaut
      } finally {
        setLoading(false);
      }
    }
    loadBenefits();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* En-tête */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 0%, #1e40af55 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-white text-3xl font-bold mb-2">Avantages par Niveau</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Découvrez les avantages exclusifs de chaque niveau de fidélité et les récompenses qui vous attendent.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Grille comparaison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {['SILVER', 'GOLD', 'PLATINUM'].map((tier) => (
            <BenefitCard
              key={tier}
              tier={tier}
              benefits={benefits[tier]}
              loading={loading}
            />
          ))}
        </div>

        {/* Tableau comparatif des caractéristiques clés */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-white font-semibold text-lg">Comparaison rapide</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-slate-500 text-sm font-medium w-1/3">Fonctionnalité</th>
                  {['SILVER', 'GOLD', 'PLATINUM'].map((t) => (
                    <th key={t} className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold ${t === 'SILVER' ? 'text-slate-300' : t === 'GOLD' ? 'text-amber-400' : 'text-violet-400'}`}>
                        {TIER_CONFIG[t].icon} {TIER_CONFIG[t].label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { label: 'Multiplicateur de points', values: ['×1', '×2', '×3'] },
                  { label: 'Livraison gratuite', values: ['—', 'Dès 50 MAD', 'Illimitée'] },
                  { label: 'Remise permanente', values: ['—', '—', '10%'] },
                  { label: 'Accès ventes privées', values: ['✕', '✓', '✓'] },
                  { label: 'Support prioritaire', values: ['Standard', 'Gold', 'Concierge'] },
                  { label: 'Cadeau anniversaire', values: ['✕', '✓', '✓ Premium'] },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-sm">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-6 py-4 text-center">
                        <span className={`text-sm font-medium ${
                          v === '✕' || v === '—' ? 'text-slate-600'
                          : i === 2 ? 'text-violet-400'
                          : i === 1 ? 'text-amber-400'
                          : 'text-slate-300'
                        }`}>
                          {v}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
