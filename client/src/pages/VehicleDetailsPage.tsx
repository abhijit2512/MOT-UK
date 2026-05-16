import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { checkMot, getVehicle } from '../services/api';
import { MotData, VehicleListing } from '../types';
import { formatDate, formatGBP, formatMiles, formatRegistration } from '../utils/format';
import MotResultCard from '../components/MotResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<VehicleListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mot, setMot] = useState<MotData | null>(null);
  const [motLoading, setMotLoading] = useState(false);
  const [motError, setMotError] = useState<string | null>(null);

  useEffect(() => {
    const numeric = Number(id);
    if (!Number.isInteger(numeric)) {
      setError('Invalid vehicle id.');
      setLoading(false);
      return;
    }
    getVehicle(numeric)
      .then(setListing)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load vehicle.'))
      .finally(() => setLoading(false));
  }, [id]);

  const onCheckMot = async () => {
    if (!listing) return;
    setMotError(null);
    setMot(null);
    setMotLoading(true);
    try {
      setMot(await checkMot(listing.registration_number));
    } catch (e) {
      setMotError(e instanceof Error ? e.message : 'Failed to check MOT.');
    } finally {
      setMotLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading vehicle…" />;
  if (error) return <div className="card p-4 border-red-200 bg-red-50 text-red-800">{error}</div>;
  if (!listing) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={14} /> Back to browse
      </Link>

      <div className="card overflow-hidden">
        <div className="aspect-[16/8] bg-slate-100">
          <img
            src={listing.image_url}
            alt={`${listing.make} ${listing.model}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <span
              className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                listing.status === 'sold' ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {listing.status === 'sold' ? 'Sold' : 'Available'}
            </span>
            <h1 className="text-3xl font-bold">
              {listing.make} {listing.model} <span className="text-slate-500 font-normal">· {listing.year}</span>
            </h1>
            <div className="inline-block bg-yellow-300 text-slate-900 font-bold tracking-widest px-3 py-1 rounded-md">
              {formatRegistration(listing.registration_number)}
            </div>
            <div className="text-slate-600 text-sm">
              {formatMiles(listing.mileage)} · {listing.fuel_type} · {listing.transmission} · Listed {formatDate(listing.created_at)}
            </div>
            <p className="text-slate-700 whitespace-pre-line">{listing.description}</p>
          </div>
          <aside className="space-y-4">
            <div className="text-3xl font-bold text-brand-700">{formatGBP(listing.price)}</div>
            <div className="card p-4 space-y-2 bg-slate-50 border-slate-200">
              <h3 className="font-semibold flex items-center gap-2"><User size={16} /> Seller</h3>
              <div className="text-sm text-slate-700">{listing.seller_name}</div>
              <a href={`mailto:${listing.seller_email}`} className="text-sm text-brand-700 hover:underline flex items-center gap-1">
                <Mail size={14} /> {listing.seller_email}
              </a>
              <a href={`tel:${listing.seller_phone}`} className="text-sm text-brand-700 hover:underline flex items-center gap-1">
                <Phone size={14} /> {listing.seller_phone}
              </a>
            </div>
            <button onClick={onCheckMot} className="btn-primary w-full" disabled={motLoading}>
              <ShieldCheck size={16} /> {motLoading ? 'Checking MOT…' : 'Check MOT for this vehicle'}
            </button>
          </aside>
        </div>
      </div>

      {motLoading && (
        <div className="card p-6"><LoadingSpinner label="Checking MOT…" /></div>
      )}
      {motError && <div className="card p-4 border-red-200 bg-red-50 text-red-800">{motError}</div>}
      {mot && <MotResultCard data={mot} />}
    </div>
  );
}
