// Composant d'affichage des notifications toast — LuxStay Rewards CRM
// Style luxury hotel · Logique originale inchangée

import React from 'react';

const TOAST_STYLES = {
  success: {
    border:  '#5DCAA555',
    bg:      'rgba(10, 28, 20, 0.95)',
    color:   '#5DCAA5',
    icon:    '✓',
  },
  error: {
    border:  '#C0392B55',
    bg:      'rgba(28, 10, 10, 0.95)',
    color:   '#E88',
    icon:    '✕',
  },
  info: {
    border:  '#C9A84C55',
    bg:      'rgba(28, 24, 16, 0.95)',
    color:   '#C9A84C',
    icon:    '◈',
  },
};

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {toasts.map((toast) => {
        const t = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 260,
              maxWidth: 360,
              padding: '11px 16px',
              borderRadius: 3,
              border: `1px solid ${t.border}`,
              background: t.bg,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              transition: 'all 0.2s',
              // thin accent line on the left
              borderLeft: `3px solid ${t.color}`,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {/* Icon */}
            <span style={{
              width: 22, height: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.color, fontSize: 14, flexShrink: 0,
            }}>{t.icon}</span>

            {/* Message */}
            <span style={{
              color: '#F7F3EA',
              fontSize: 13,
              fontFamily: 'sans-serif',
              letterSpacing: '0.02em',
              flex: 1,
              lineHeight: 1.4,
            }}>{toast.message}</span>

            {/* Dismiss hint */}
            <span style={{
              color: t.color,
              fontSize: 10,
              opacity: 0.45,
              flexShrink: 0,
            }}>✕</span>
          </div>
        );
      })}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}