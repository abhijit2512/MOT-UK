import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { deleteListing, listVehicles, updateListingStatus } from '../services/api';
import { VehicleListing } from '../types';
import { formatGBP, formatRegistration } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

// TODO (security): Add real authentication / role checks before deploying
// the admin dashboard publicly. This page must NOT be reachable without
// admin login in a production build.

export default function AdminPage() {
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const reload = () => {
    setLoading(true);
    listVehicles()
      .then(setListings)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load listings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const stats = useMemo(() => ({
    total: listings.length,
    available: listings.filter((l) => l.status === 'available').length,
    sold: listings.filter((l) => l.status === 'sold').length,
  }), [listings]);

  const onToggle = async (l: VehicleListing) => {
    setActionId(l.id);
    try {
      const next = l.status === 'available' ? 'sold' : 'available';
      const updated = await updateListingStatus(l.id, next);
      setListings((arr) => arr.map((x) => (x.id === l.id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed.');
    } finally {
      setActionId(null);
    }
  };

  const onDelete = async (l: VehicleListing) => {
    if (!confirm(`Delete listing #${l.id} (${l.make} ${l.model})?`)) return;
    setActionId(l.id);
    try {
      await deleteListing(l.id);
      setListings((arr) => arr.filter((x) => x.id !== l.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        <p className="text-slate-600">Manage all vehicle listings.</p>
      </div>

      <div className="card p-4 border-amber-200 bg-amber-50 text-amber-900 text-sm flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5" />
        <span>
          This admin page is unauthenticated for the MVP. Add a proper login before any real deployment.
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total listings" value={stats.total} color="bg-brand-50 text-brand-700" />
        <StatCard label="Available" value={stats.available} color="bg-emerald-50 text-emerald-700" />
        <StatCard label="Sold" value={stats.sold} color="bg-slate-100 text-slate-700" />
      </div>

      {error && <div className="card p-4 border-red-200 bg-red-50 text-red-800">{error}</div>}
      {loading ? (
        <LoadingSpinner label="Loading listings…" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>ID</Th>
                <Th>Vehicle</Th>
                <Th>Reg</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <Td>#{l.id}</Td>
                  <Td>
                    <Link to={`/vehicles/${l.id}`} className="font-medium hover:underline">
                      {l.make} {l.model}
                    </Link>
                    <div className="text-xs text-slate-500">{l.year} · {l.fuel_type}</div>
                  </Td>
                  <Td>
                    <span className="bg-yellow-300 px-2 py-0.5 rounded font-bold tracking-wider">
                      {formatRegistration(l.registration_number)}
                    </span>
                  </Td>
                  <Td>{formatGBP(l.price)}</Td>
                  <Td>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      l.status === 'sold' ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {l.status}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onToggle(l)}
                        className="btn-secondary py-1 px-2 text-xs"
                        disabled={actionId === l.id}
                      >
                        {l.status === 'available' ? (
                          <><CheckCircle2 size={14} /> Mark sold</>
                        ) : (
                          <><RotateCcw size={14} /> Mark available</>
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(l)}
                        className="btn-danger py-1 px-2 text-xs"
                        disabled={actionId === l.id}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">No listings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} font-bold`}>{value}</div>
      <div className="mt-2 text-sm text-slate-600">{label}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-4 py-2">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
