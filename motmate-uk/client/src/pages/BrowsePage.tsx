import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { VehicleListing } from '../types';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search } from 'lucide-react';

export default function BrowsePage() {
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.listListings();
        setListings(data);
      } catch (e: any) {
        setError(e?.message ?? 'Could not load listings.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((v) => {
      if (!showSold && v.status === 'sold') return false;
      if (!q) return true;
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.registration_number.toLowerCase().includes(q) ||
        v.fuel_type.toLowerCase().includes(q)
      );
    });
  }, [listings, query, showSold]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Browse vehicles</h1>
          <p className="mt-1 text-slate-600">{filtered.length} vehicle{filtered.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search make, model, plate…"
              className="input pl-9"
            />
          </div>
          <label className="text-sm text-slate-600 inline-flex items-center gap-1.5">
            <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} />
            Show sold
          </label>
        </div>
      </div>

      <div className="mt-6">
        {loading && <LoadingSpinner label="Loading listings…" />}
        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="card p-8 text-center text-slate-600">No vehicles match your search.</div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
