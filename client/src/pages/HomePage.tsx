import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Tag, Car, ShieldCheck, Mic } from 'lucide-react';
import { cleanRegistration, isValidRegistration } from '../utils/validation';

export default function HomePage() {
  const navigate = useNavigate();
  const [reg, setReg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidRegistration(reg)) {
      setError('Please enter a valid UK registration number.');
      return;
    }
    navigate(`/mot?reg=${encodeURIComponent(cleanRegistration(reg))}&auto=1`);
  };

  return (
    <div className="space-y-16">
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white rounded-3xl px-6 sm:px-10 py-14 sm:py-20 shadow-lg">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1 rounded-full">
            <ShieldCheck size={14} /> UK vehicle MOT &amp; marketplace
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Check MOT &amp; sell your vehicle, all in one place.
          </h1>
          <p className="text-white/85 text-lg">
            Enter a UK registration to see MOT history and expiry. List your car for sale with a few details.
            Use voice search if your hands are full.
          </p>

          <form onSubmit={onSubmit} className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-xl text-slate-900">
            <input
              value={reg}
              onChange={(e) => {
                setReg(e.target.value);
                setError(null);
              }}
              placeholder="Enter registration e.g. AB12 CDE"
              className="flex-1 px-4 py-3 text-lg font-semibold uppercase tracking-wider rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button type="submit" className="btn-primary text-base px-5 py-3">
              <Search size={18} /> Check MOT
            </button>
          </form>
          {error && <p className="text-red-100 bg-red-500/30 px-3 py-2 rounded-lg text-sm">{error}</p>}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/sell" className="btn bg-white text-brand-700 hover:bg-brand-50">
              <Tag size={16} /> Sell my vehicle
            </Link>
            <Link to="/browse" className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20">
              <Car size={16} /> Browse vehicles
            </Link>
            <Link to="/mot" className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20">
              <Mic size={16} /> Voice search
            </Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Search className="text-brand-600" />}
          title="Instant MOT lookup"
          body="See test result, expiry date, mileage, advisories and full MOT history in one card."
        />
        <FeatureCard
          icon={<Mic className="text-brand-600" />}
          title="Voice search"
          body='Say "Check MOT for AB12 CDE" and we will look it up for you.'
        />
        <FeatureCard
          icon={<Tag className="text-brand-600" />}
          title="Sell with confidence"
          body="Create a listing in under a minute. Buyers can verify the MOT before contacting you."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-600 text-sm">{body}</p>
    </div>
  );
}
