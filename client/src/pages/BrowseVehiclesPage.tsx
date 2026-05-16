import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { listVehicles } from '../services/api';
import { VehicleListing } from '../types';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BrowseVehiclesPage() {
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    listVehicles()
      .then(setListings)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load listings.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (!showSold && l.status === 'sold') return false;
      if (!q) return true;
      return (
        l.make.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q) ||
        l.registration_number.toLowerCase().includes(q)
      );
    });
  }, [listings, query, showSold]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Browse vehicles</h1>
          <p className="text-slate-600">Find your next car from the MOTMate marketplace.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9 w-full sm:w-72"
              placeholder="Search make, model, reg…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} />
            Show sold
          </label>
        </div>
      </div>

      {loading && <LoadingSpinner label="Loading listings…" />}
      {error && <div className="card p-4 border-red-200 bg-red-50 text-red-800">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-8 text-center text-slate-500">No vehicles found. Try a different search.</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((l) => <VehicleCard key={l.id} listing={l} />)}
      </div>
    </div>
  );
}
