import { Link } from 'react-router-dom';
import { VehicleListing } from '../types';
import { formatGBP, formatMiles, formatRegistration } from '../utils/format';

export default function VehicleCard({ listing }: { listing: VehicleListing }) {
  const isSold = listing.status === 'sold';
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
        <img
          src={listing.image_url}
          alt={`${listing.make} ${listing.model}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            isSold ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-white'
          }`}
        >
          {isSold ? 'Sold' : 'Available'}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">
            {listing.make} {listing.model}
          </h3>
          <span className="text-brand-700 font-bold">{formatGBP(listing.price)}</span>
        </div>
        <div className="text-xs text-slate-500">
          {listing.year} · {formatMiles(listing.mileage)} · {listing.fuel_type} · {listing.transmission}
        </div>
        <div className="inline-block bg-yellow-300 text-slate-900 font-bold tracking-widest px-2 py-0.5 rounded text-sm self-start">
          {formatRegistration(listing.registration_number)}
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{listing.description}</p>
        <Link to={`/vehicles/${listing.id}`} className="btn-primary mt-auto w-full">
          View details
        </Link>
      </div>
    </div>
  );
}
