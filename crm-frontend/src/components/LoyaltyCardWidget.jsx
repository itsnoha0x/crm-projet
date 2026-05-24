// Composant visuel de carte de fidélité
import React from 'react';

// Configurations visuelles par type de carte
const CARD_STYLES = {
  SILVER: {
    bg: 'linear-gradient(135deg, #667eea 0%, #94a3b8 50%, #64748b 100%)',
    badge: 'bg-slate-100/20 text-slate-100',
    label: 'SILVER',
    accent: '#e2e8f0',
    shadow: 'shadow-slate-500/40',
  },
  GOLD: {
    bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)',
    badge: 'bg-amber-900/30 text-amber-100',
    label: 'GOLD',
    accent: '#fef3c7',
    shadow: 'shadow-amber-500/40',
  },
  PLATINUM: {
    bg: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #7c3aed 100%)',
    badge: 'bg-purple-900/30 text-purple-100',
    label: 'PLATINUM',
    accent: '#ede9fe',
    shadow: 'shadow-purple-500/40',
  },
};

// Formater le numéro de carte avec des tirets
function formatCardNumber(number) {
  if (!number) return 'XXXX-XXXX-XXXX';
  const str = String(number).replace(/\D/g, '');
  const padded = str.padEnd(12, '0');
  return `${padded.slice(0, 4)}-${padded.slice(4, 8)}-${padded.slice(8, 12)}`;
}

// Formater la date
function formatDate(dateStr) {
  if (!dateStr) return '--/--';
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(2)}`;
}

export default function LoyaltyCardWidget({
  cardNumber,
  customerName,
  cardType = 'SILVER',
  expiryDate,
}) {
  const style = CARD_STYLES[cardType] || CARD_STYLES.SILVER;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-2xl ${style.shadow}`}
      style={{
        width: '380px',
        height: '220px',
        background: style.bg,
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Effets de fond décoratifs */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, white 0%, transparent 50%), radial-gradient(circle at 20% 80%, white 0%, transparent 40%)',
        }}
      />
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
        style={{ background: 'rgba(255,255,255,0.3)' }}
      />
      <div
        className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full opacity-15"
        style={{ background: 'rgba(255,255,255,0.2)' }}
      />

      {/* Contenu de la carte */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* En-tête: logo + badge */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-white/90 font-bold text-base tracking-widest">CRM</span>
            <span className="text-white/60 font-light text-base ml-1">LOYALTY</span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.badge} tracking-widest border border-white/20`}>
            {style.label}
          </span>
        </div>

        {/* Puce et numéro de carte */}
        <div>
          {/* Icône puce */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-7 rounded-md border-2 border-white/40"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
              }}
            >
              <div className="grid grid-cols-2 h-full p-0.5 gap-px">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-sm bg-white/20" />
                ))}
              </div>
            </div>
          </div>
          {/* Numéro */}
          <div className="text-white text-lg tracking-[0.2em] font-bold drop-shadow-sm">
            {formatCardNumber(cardNumber)}
          </div>
        </div>

        {/* Pied: nom + date d'expiration */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-white/50 text-xs tracking-widest mb-1">TITULAIRE</div>
            <div className="text-white font-bold text-sm tracking-widest uppercase">
              {customerName || 'NOM PRÉNOM'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/50 text-xs tracking-widest mb-1">EXPIRE</div>
            <div className="text-white font-bold text-sm">{formatDate(expiryDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
