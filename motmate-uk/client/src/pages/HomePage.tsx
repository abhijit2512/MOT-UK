import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag, Car, ShieldCheck, Mic, Gauge } from 'lucide-react';

export default function HomePage() {
  const [reg, setReg] = useState('');
  const navigate = useNavigate();

  function checkMot(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = reg.trim();
    if (!trimmed) {
      navigate('/mot-check');
      return;
    }
    navigate(`/mot-check?reg=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-brand-100 text-brand-800">
              <ShieldCheck className="w-3.5 h-3.5" /> UK MOT & Vehicle Marketplace
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              MOTMate <span className="text-brand-600">UK</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-lg">
              Check any UK vehicle’s MOT history in seconds — by typing or by voice —
              and buy or sell used cars with confidence.
            </p>

            <form onSubmit={checkMot} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                value={reg}
                onChange={(e) => setReg(e.target.value)}
                placeholder="Enter registration e.g. AB12 CDE"
                className="input uppercase tracking-widest font-semibold"
                aria-label="Vehicle registration"
              />
              <button type="submit" className="btn-primary">
                <Search className="w-4 h-4" /> Check MOT
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => navigate('/sell')} className="btn-secondary">
                <Tag className="w-4 h-4" /> Sell My Vehicle
              </button>
              <button onClick={() => navigate('/browse')} className="btn-secondary">
                <Car className="w-4 h-4" /> Browse Vehicles
              </button>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Quick preview</div>
                <div className="font-semibold text-slate-900">What you’ll get</div>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-slate-700">
              <Feature icon={<Search className="w-4 h-4 text-brand-600" />} title="Full MOT history" desc="Latest result, mileage, advisories and defects." />
              <Feature icon={<Mic className="w-4 h-4 text-brand-600" />} title="Voice search" desc='Say "Check MOT for AB12 CDE" and we do the rest.' />
              <Feature icon={<Tag className="w-4 h-4 text-brand-600" />} title="Sell easily" desc="A simple, validated listing form." />
              <Feature icon={<Car className="w-4 h-4 text-brand-600" />} title="Browse & buy" desc="Card-based listings with MOT-on-demand." />
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Step n={1} title="Enter or speak a plate" desc="Type a UK registration or use voice search." />
          <Step n={2} title="See the MOT history" desc="Latest result, expiry, mileage, advisories and defects." />
          <Step n={3} title="Buy or sell with confidence" desc="Create a listing or browse vehicles and check their MOT." />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="font-medium text-slate-900">{title}</div>
        <div className="text-sm text-slate-600">{desc}</div>
      </div>
    </li>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="card p-5">
      <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
        {n}
      </div>
      <div className="mt-3 font-semibold text-slate-900">{title}</div>
      <div className="text-sm text-slate-600">{desc}</div>
    </div>
  );
}
