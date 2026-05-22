import { Link } from 'react-router-dom';
import { VehicleListing } from '../types';
import { formatPrice, formatMileage, formatRegistration } from '../utils/format';
import { Calendar, Fuel, Settings2 } from 'lucide-react';

export default function VehicleCard({ v }: { v: VehicleListing }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-slate-100">
        {v.image_url ? (
          <img
            src={v.image_url}
            alt={`${v.make} ${v.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        <span
          className={`absolute top-2 right-2 badge ${
            v.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {v.status === 'available' ? 'Available' : 'Sold'}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">
            {v.make} {v.model}
          </h3>
          <span className="font-bold text-brand-700">{formatPrice(v.price)}</span>
        </div>
        <div className="mt-1 text-sm text-slate-500">
          <span className="inline-block px-1.5 py-0.5 bg-yellow-300 border border-yellow-500 rounded text-slate-900 text-xs font-bold tracking-wider mr-2">
            {formatRegistration(v.registration_number)}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {v.year}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" /> {v.fuel_type}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings2 className="w-3.5 h-3.5" /> {v.transmission}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{v.description}</p>
        <div className="mt-3 text-xs text-slate-500">{formatMileage(v.mileage)}</div>
        <Link to={`/vehicles/${v.id}`} className="mt-4 btn-primary text-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}
