import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { VehicleListing } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trash2, CheckCircle2, Undo2, Car, ShoppingBag, AlertTriangle } from 'lucide-react';
import { formatPrice, formatRegistration } from '../utils/format';

// TODO: This admin page is currently UNAUTHENTICATED for MVP simplicity.
// Before any public deployment, add proper authentication & authorisation
// (e.g. login + role check) and restrict access server-side too.

export default function AdminPage() {
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listListings();
      setListings(data);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load listings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => ({
    total: listings.length,
    available: listings.filter((l) => l.status === 'available').length,
    sold: listings.filter((l) => l.status === 'sold').length,
  }), [listings]);

  async function toggle(l: VehicleListing) {
    const next = l.status === 'available' ? 'sold' : 'available';
    try {
      const updated = await api.updateStatus(l.id, next);
      setListings((arr) => arr.map((x) => (x.id === l.id ? updated : x)));
    } catch (e: any) {
      alert(e?.message ?? 'Update failed.');
    }
  }

  async function remove(l: VehicleListing) {
    if (!confirm(`Delete listing for ${l.make} ${l.model} (${l.registration_number})?`)) return;
    try {
      await api.deleteListing(l.id);
      setListings((arr) => arr.filter((x) => x.id !== l.id));
    } catch (e: any) {
      alert(e?.message ?? 'Delete failed.');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin dashboard</h1>
          <p className="mt-1 text-slate-600">Manage all vehicle listings.</p>
        </div>
        <div className="text-xs px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2 max-w-md">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>MVP only — no authentication. Add login before any public deployment.</span>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Stat icon={<Car className="w-5 h-5" />} label="Total listings" value={stats.total} />
        <Stat icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} label="Available" value={stats.available} />
        <Stat icon={<ShoppingBag className="w-5 h-5 text-slate-600" />} label="Sold" value={stats.sold} />
      </div>

      <div className="mt-6 card overflow-x-auto">
        {loading && <div className="p-6"><LoadingSpinner /></div>}
        {error && <div className="p-6 text-rose-700">{error}</div>}
        {!loading && !error && (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Vehicle</th>
                <th className="px-4 py-2">Plate</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-t border-slate-200">
                  <td className="px-4 py-2 text-slate-500">{l.id}</td>
                  <td className="px-4 py-2 font-medium">{l.make} {l.model} <span className="text-slate-400">({l.year})</span></td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-1.5 py-0.5 bg-yellow-300 border border-yellow-500 rounded text-slate-900 text-xs font-bold tracking-wider">
                      {formatRegistration(l.registration_number)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatPrice(l.price)}</td>
                  <td className="px-4 py-2">{l.seller_name}</td>
                  <td className="px-4 py-2">
                    <span className={`badge ${l.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggle(l)} className="btn-secondary text-xs px-2 py-1">
                        {l.status === 'available' ? <><CheckCircle2 className="w-3.5 h-3.5" /> Mark sold</> : <><Undo2 className="w-3.5 h-3.5" /> Mark available</>}
                      </button>
                      <button onClick={() => remove(l)} className="btn-danger text-xs px-2 py-1">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No listings yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}
