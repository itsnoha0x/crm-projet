// Composant d'affichage des notifications toast
import React from 'react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300 min-w-64 max-w-sm
            ${toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-500/50 text-red-100'
              : 'bg-blue-900/90 border-blue-500/50 text-blue-100'
            }`}
        >
          <span className="text-lg">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
