// Page Gestion des Clients - CRUD complet
import React, { useState, useEffect, useMemo } from 'react';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Badge de statut client
function StatusBadge({ status }) {
  const config = {
    ACTIVE: { label: 'Actif', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    INACTIVE: { label: 'Inactif', cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
    SUSPENDED: { label: 'Suspendu', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  };
  const s = config[status] || config.INACTIVE;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
      {s.label}
    </span>
  );
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  status: 'ACTIVE',
};

// Formulaire modal de création/modification
function CustomerModal({ customer, onClose, onSave }) {
  const [formData, setFormData] = useState(() =>
    customer
      ? {
          firstName: customer.firstName ?? '',
          lastName: customer.lastName ?? '',
          email: customer.email ?? '',
          phone: customer.phone ?? '',
          address: customer.address ?? '',
          status: customer.status ?? 'ACTIVE',
        }
      : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'Prénom obligatoire';
    if (!formData.lastName.trim()) e.lastName = 'Nom obligatoire';
    if (!formData.email.trim()) e.email = 'Email obligatoire';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email invalide';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await onSave({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.userMessage || 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (name) =>
    `w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 outline-none focus:ring-2 transition-all
      ${errors[name] ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-white font-semibold text-lg">
            {customer ? 'Modifier le client' : 'Nouveau client'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
            ✕
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Jean"
                className={inputClass('firstName')}
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Dupont"
                className={inputClass('lastName')}
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean.dupont@exemple.fr"
              className={inputClass('email')}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Téléphone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+212 6XX-XXXXXX"
              className={inputClass('phone')}
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="12 Rue Hassan II, Rabat"
              className={inputClass('address')}
            />
          </div>
          {customer && (
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="SUSPENDED">Suspendu</option>
              </select>
            </div>
          )}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {customer ? 'Enregistrer' : 'Créer le client'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Dialogue de confirmation de suppression
function DeleteDialog({ customer, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4 mx-auto">
          <span className="text-red-400 text-xl">⚠</span>
        </div>
        <h3 className="text-white font-semibold text-center mb-2">Supprimer ce client ?</h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          <strong className="text-white">{customer.firstName} {customer.lastName}</strong> sera définitivement supprimé. Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm">
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 10;

export default function Customers({ addToast }) {
  const { authenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'create' | customer
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }
    loadCustomers();
  }, [authenticated]);

  async function loadCustomers() {
    setLoading(true);
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      addToast?.('Impossible de charger les clients', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Filtrage par recherche
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    );
  }, [customers, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Réinitialiser la page lors d'une nouvelle recherche
  useEffect(() => { setPage(1); }, [search]);

  // Créer ou modifier un client
  async function handleSave(form) {
    if (modal === 'create') {
      const { data } = await customerAPI.create(form);
      setCustomers((prev) => [data, ...prev]);
      addToast?.('Client créé avec succès', 'success');
    } else {
      const { data } = await customerAPI.update(modal.id, form);
      setCustomers((prev) => prev.map((c) => (c.id === modal.id ? data : c)));
      addToast?.('Client mis à jour', 'success');
    }
  }

  // Supprimer un client
  async function handleDelete() {
    try {
      await customerAPI.delete(deleteTarget.id);
      setCustomers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      addToast?.('Client supprimé', 'success');
    } catch (err) {
      addToast?.('Erreur lors de la suppression', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* En-tête */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Gestion des Clients</h1>
            <p className="text-slate-500 text-sm mt-0.5">{customers.length} client{customers.length !== 1 ? 's' : ''} enregistré{customers.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setModal('create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <span className="text-lg leading-none">+</span>
            Ajouter un client
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou téléphone..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all max-w-md"
          />
        </div>

        {/* Tableau */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-24 text-slate-600">
              <div className="text-5xl mb-3">○</div>
              <p className="font-medium text-slate-500">
                {search ? 'Aucun résultat pour cette recherche' : 'Aucun client enregistré'}
              </p>
              {!search && (
                <button
                  onClick={() => setModal('create')}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm underline underline-offset-4"
                >
                  Ajouter le premier client
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['ID', 'Client', 'Email', 'Téléphone', 'Statut', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginated.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-slate-600 text-sm font-mono">#{customer.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {customer.firstName} {customer.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{customer.email}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{customer.phone}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={customer.status || 'ACTIVE'} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setModal(customer)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setDeleteTarget(customer)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors"
                          >
                            Supprimer
                          </button>
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
          <div className="flex items-center justify-between mt-4">
            <p className="text-slate-500 text-sm">
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} — Page {page} sur {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ‹ Précédent
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm transition-all
                      ${p === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Suivant ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal création/modification */}
      {modal && (
        <CustomerModal
          key={modal === 'create' ? 'create' : modal.id}
          customer={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Dialog suppression */}
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
