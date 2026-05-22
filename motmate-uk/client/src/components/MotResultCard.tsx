import { MotResult } from '../types';
import { formatDate, formatMileage, formatRegistration } from '../utils/format';
import { CheckCircle2, XCircle, AlertTriangle, Calendar, Gauge, Palette, Fuel, History } from 'lucide-react';

interface Props {
  result: MotResult;
  mockMode?: boolean;
}

export default function MotResultCard({ result, mockMode }: Props) {
  const passed = result.latestResult === 'PASSED';

  return (
    <div className="space-y-4">
      {mockMode && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-sm">
          Showing <strong>mock</strong> MOT data. Add real DVSA credentials in <code>server/.env</code> to switch to live data.
        </div>
      )}

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Registration</div>
            <div className="inline-block mt-1 px-3 py-1.5 rounded-md bg-yellow-300 border-2 border-yellow-500 font-bold text-slate-900 text-xl tracking-widest">
              {formatRegistration(result.registration)}
            </div>
          </div>
          <div
            className={`badge px-3 py-1 text-sm ${
              passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {result.latestResult ?? 'UNKNOWN'}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Make" value={result.make} />
          <Field label="Model" value={result.model} />
          <Field label="Colour" value={result.primaryColour} icon={<Palette className="w-4 h-4" />} />
          <Field label="Fuel type" value={result.fuelType} icon={<Fuel className="w-4 h-4" />} />
          <Field
            label="MOT expiry"
            value={formatDate(result.motExpiryDate)}
            icon={<Calendar className="w-4 h-4" />}
          />
          <Field
            label="Latest test"
            value={formatDate(result.latestTestDate)}
            icon={<Calendar className="w-4 h-4" />}
          />
          <Field
            label="Mileage"
            value={result.latestMileage ? formatMileage(result.latestMileage) : '—'}
            icon={<Gauge className="w-4 h-4" />}
          />
        </div>

        {result.latestAdvisories.length > 0 && (
          <Section title="Advisories" icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}>
            {result.latestAdvisories.map((d, i) => (
              <li key={i} className="text-slate-700">{d.text}</li>
            ))}
          </Section>
        )}

        {result.latestDefects.length > 0 && (
          <Section title="Defects" icon={<XCircle className="w-4 h-4 text-rose-600" />}>
            {result.latestDefects.map((d, i) => (
              <li key={i} className="text-slate-700">
                <span className="font-medium">{d.type}:</span> {d.text}
              </li>
            ))}
          </Section>
        )}

        {result.latestAdvisories.length === 0 && result.latestDefects.length === 0 && (
          <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">
            No advisories or defects on the latest test.
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-brand-600" /> MOT history
        </h3>
        <ol className="mt-4 space-y-4 border-l-2 border-slate-200 pl-4">
          {result.motTests.map((test, idx) => (
            <li key={idx} className="relative">
              <span
                className={`absolute -left-[1.4rem] top-1.5 w-3 h-3 rounded-full ${
                  test.testResult === 'PASSED' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="font-medium text-slate-900">{formatDate(test.completedDate)}</div>
                <span
                  className={`badge ${
                    test.testResult === 'PASSED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {test.testResult}
                </span>
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {test.odometerValue ? `${formatMileage(test.odometerValue)} • ` : ''}
                {test.expiryDate ? `Expires ${formatDate(test.expiryDate)}` : 'No expiry'}
              </div>
              {test.defects.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-1">
                  {test.defects.map((d, j) => (
                    <li key={j}>
                      <span className="font-medium">{d.type}:</span> {d.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-medium text-slate-900">{value}</div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <ul className="mt-2 list-disc list-inside space-y-1">{children}</ul>
    </div>
  );
}
