// Composant de navigation principal
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/customers', label: 'Clients', icon: '◉' },
  { path: '/loyalty', label: 'Cartes Fidélité', icon: '◆' },
  { path: '/points', label: 'Points', icon: '◇' },
  { path: '/benefits', label: 'Avantages', icon: '◈' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth() ?? {};
  const username = user?.username;

  function handleLogout() {
    logout?.();
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-700/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">CRM</span>
              <span className="text-blue-400 font-light text-lg ml-1">Loyalty</span>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <span className="text-xs opacity-70">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Badge utilisateur */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-3">
              {username && (
                <span className="text-sm text-slate-400">{username}</span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-sm hover:text-white hover:bg-slate-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Bouton mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
          >
            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700/60 bg-slate-900 py-2 px-4">
          {username && (
            <p className="px-4 py-2 text-sm text-slate-400">{username}</p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mb-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
          >
            Déconnexion
          </button>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium my-1 transition-all
                ${isActive
                  ? 'bg-blue-600/20 text-blue-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
