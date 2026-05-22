import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { VehicleListing, MotResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import MotResultCard from '../components/MotResultCard';
import { formatMileage, formatPrice, formatRegistration } from '../utils/format';
import { ArrowLeft, Calendar, Fuel, Mail, Phone, Search, Settings2, User } from 'lucide-react';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<VehicleListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mot, setMot] = useState<MotResponse | null>(null);
  const [motLoading, setMotLoading] = useState(false);
  const [motError, setMotError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getListing(Number(id));
        setListing(data);
      } catch (e: any) {
        setError(e?.message ?? 'Could not load listing.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function checkMot() {
    if (!listing) return;
    setMotError(null);
    setMotLoading(true);
    setMot(null);
    try {
      const res = await api.checkMot(listing.registration_number);
      setMot(res);
    } catch (e: any) {
      setMotError(e?.message ?? 'Could not load MOT.');
    } finally {
      setMotLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <LoadingSpinner label="Loading vehicle…" />
      </div>
    );
  }
  if (error || !listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 text-sm">
          {error ?? 'Vehicle not found.'}
        </div>
        <Link to="/browse" className="btn-secondary mt-4 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/browse" className="text-sm text-brand-700 hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to all vehicles
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="aspect-[4/3] bg-slate-100">
            {listing.image_url && (
              <img src={listing.image_url} alt={`${listing.make} ${listing.model}`}
                className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{listing.make} {listing.model}</h1>
              <div className="mt-1 inline-block px-2 py-1 bg-yellow-300 border border-yellow-500 rounded font-bold tracking-widest text-slate-900 text-sm">
                {formatRegistration(listing.registration_number)}
              </div>
            </div>
            <span className={`badge ${listing.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
              {listing.status === 'available' ? 'Available' : 'Sold'}
            </span>
          </div>

          <div className="mt-4 text-3xl font-extrabold text-brand-700">{formatPrice(listing.price)}</div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Spec icon={<Calendar className="w-4 h-4" />} label="Year" value={String(listing.year)} />
            <Spec icon={<Fuel className="w-4 h-4" />} label="Fuel" value={listing.fuel_type} />
            <Spec icon={<Settings2 className="w-4 h-4" />} label="Transmission" value={listing.transmission} />
            <Spec label="Mileage" value={formatMileage(listing.mileage)} />
          </div>

          <p className="mt-5 text-slate-700 whitespace-pre-line">{listing.description}</p>

          <hr className="my-5" />

          <h3 className="font-semibold text-slate-900">Seller</h3>
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500" /> {listing.seller_name}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" />
              <a className="text-brand-700 hover:underline" href={`mailto:${listing.seller_email}`}>{listing.seller_email}</a>
            </div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" />
              <a className="text-brand-700 hover:underline" href={`tel:${listing.seller_phone}`}>{listing.seller_phone}</a>
            </div>
          </div>

          <button onClick={checkMot} disabled={motLoading} className="btn-primary mt-6 w-full">
            <Search className="w-4 h-4" /> {motLoading ? 'Checking MOT…' : 'Check MOT for this vehicle'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        {motError && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 text-sm">
            {motError}
          </div>
        )}
        {mot && <MotResultCard result={mot.result} mockMode={mot.mockMode} />}
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-slate-500 mt-0.5">{icon}</span>}
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="font-medium text-slate-900">{value}</div>
      </div>
    </div>
  );
}
