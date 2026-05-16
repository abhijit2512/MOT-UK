import { CheckCircle2, XCircle, AlertTriangle, Wrench } from 'lucide-react';
import { MotData } from '../types';
import { formatDate, formatMiles, formatRegistration } from '../utils/format';

function Pill({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
        ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-medium text-slate-900">{value}</div>
    </div>
  );
}

export default function MotResultCard({ data }: { data: MotData }) {
  const pass = data.result === 'PASS';
  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-block bg-yellow-300 text-slate-900 font-bold tracking-widest px-3 py-1 rounded-md text-lg shadow-sm">
            {formatRegistration(data.registration)}
          </div>
          <h2 className="text-xl font-semibold mt-3">
            {data.make} {data.model}
          </h2>
          <p className="text-slate-500">
            {data.colour} · {data.fuelType}
          </p>
        </div>
        <Pill ok={pass}>{pass ? 'MOT PASS' : 'MOT FAIL'}</Pill>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="MOT expiry" value={formatDate(data.motExpiryDate)} />
        <Stat label="Last test" value={formatDate(data.latestTestDate)} />
        <Stat label="Mileage" value={formatMiles(data.mileage)} />
        <Stat label="Fuel" value={data.fuelType} />
      </div>

      {data.advisories.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-amber-700 mb-2">
            <AlertTriangle size={16} /> Advisories
          </h3>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {data.advisories.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {data.defects.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-red-700 mb-2">
            <Wrench size={16} /> Defects
          </h3>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {data.defects.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">MOT history</h3>
        <ol className="relative border-l border-slate-200 ml-2 space-y-4">
          {data.history.map((h, idx) => (
            <li key={`${h.testDate}-${idx}`} className="ml-4">
              <span
                className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${
                  h.result === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{formatDate(h.testDate)}</span>
                <Pill ok={h.result === 'PASS'}>{h.result}</Pill>
                <span className="text-sm text-slate-500">{formatMiles(h.mileage)}</span>
              </div>
              {h.expiryDate && (
                <div className="text-xs text-slate-500">Expiry: {formatDate(h.expiryDate)}</div>
              )}
              {h.advisories.length > 0 && (
                <div className="text-sm text-slate-600 mt-1">
                  <span className="font-medium text-amber-700">Advisories: </span>
                  {h.advisories.join('; ')}
                </div>
              )}
              {h.defects.length > 0 && (
                <div className="text-sm text-slate-600 mt-1">
                  <span className="font-medium text-red-700">Defects: </span>
                  {h.defects.join('; ')}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
