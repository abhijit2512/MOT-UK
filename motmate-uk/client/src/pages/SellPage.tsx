import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid Electric', 'Electric', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-Automatic'];

interface FormState {
  registration_number: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuel_type: string;
  transmission: string;
  price: string;
  description: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  image_url: string;
}

const empty: FormState = {
  registration_number: '',
  make: '',
  model: '',
  year: '',
  mileage: '',
  fuel_type: 'Petrol',
  transmission: 'Manual',
  price: '',
  description: '',
  seller_name: '',
  seller_email: '',
  seller_phone: '',
  image_url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
};

export default function SellPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const navigate = useNavigate();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.registration_number.trim()) return 'Registration is required.';
    if (!form.make.trim()) return 'Make is required.';
    if (!form.model.trim()) return 'Model is required.';
    const year = Number(form.year);
    if (!Number.isInteger(year) || year < 1950 || year > new Date().getFullYear() + 1) {
      return 'Please enter a valid year.';
    }
    const mileage = Number(form.mileage);
    if (!Number.isFinite(mileage) || mileage < 0) return 'Mileage must be a positive number.';
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return 'Price must be greater than 0.';
    if (!form.seller_name.trim()) return 'Your name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.seller_email)) return 'A valid email is required.';
    if (!form.seller_phone.trim()) return 'Phone number is required.';
    if (!form.description.trim()) return 'Please add a short description.';
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const listing = await api.createListing({
        registration_number: form.registration_number,
        make: form.make,
        model: form.model,
        year: Number(form.year),
        mileage: Number(form.mileage),
        fuel_type: form.fuel_type,
        transmission: form.transmission,
        price: Number(form.price),
        description: form.description,
        seller_name: form.seller_name,
        seller_email: form.seller_email,
        seller_phone: form.seller_phone,
        image_url: form.image_url,
      });
      setCreatedId(listing.id);
    } catch (err: any) {
      setError(err?.message ?? 'Could not create listing.');
    } finally {
      setSubmitting(false);
    }
  }

  if (createdId !== null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="card p-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Listing created!</h2>
          <p className="mt-2 text-slate-600">Your vehicle is now listed for sale.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button onClick={() => navigate(`/vehicles/${createdId}`)} className="btn-primary">
              View my listing
            </button>
            <button onClick={() => navigate('/browse')} className="btn-secondary">
              Browse all vehicles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Sell my vehicle</h1>
      <p className="mt-2 text-slate-600">Fill in the details below to create a listing.</p>

      <form onSubmit={onSubmit} className="mt-6 card p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Registration *">
            <input className="input uppercase tracking-widest font-semibold" value={form.registration_number}
              onChange={(e) => update('registration_number', e.target.value)} placeholder="AB12 CDE" />
          </Field>
          <Field label="Year *">
            <input className="input" type="number" value={form.year}
              onChange={(e) => update('year', e.target.value)} placeholder="2020" min={1950} max={new Date().getFullYear() + 1} />
          </Field>
          <Field label="Make *">
            <input className="input" value={form.make}
              onChange={(e) => update('make', e.target.value)} placeholder="Ford" />
          </Field>
          <Field label="Model *">
            <input className="input" value={form.model}
              onChange={(e) => update('model', e.target.value)} placeholder="Focus" />
          </Field>
          <Field label="Mileage (mi) *">
            <input className="input" type="number" value={form.mileage}
              onChange={(e) => update('mileage', e.target.value)} placeholder="48000" min={0} />
          </Field>
          <Field label="Price (£) *">
            <input className="input" type="number" value={form.price}
              onChange={(e) => update('price', e.target.value)} placeholder="7995" min={0} />
          </Field>
          <Field label="Fuel type *">
            <select className="input" value={form.fuel_type} onChange={(e) => update('fuel_type', e.target.value)}>
              {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Transmission *">
            <select className="input" value={form.transmission} onChange={(e) => update('transmission', e.target.value)}>
              {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Description *">
          <textarea className="input min-h-[100px]" value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="One careful owner, full service history…" />
        </Field>

        <Field label="Image URL *">
          <input className="input" value={form.image_url} onChange={(e) => update('image_url', e.target.value)}
            placeholder="https://…" />
          <p className="mt-1 text-xs text-slate-500">For this MVP we use an image URL. File upload can be added later.</p>
        </Field>

        <hr />
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Your name *">
            <input className="input" value={form.seller_name} onChange={(e) => update('seller_name', e.target.value)} placeholder="Jane Smith" />
          </Field>
          <Field label="Email *">
            <input className="input" type="email" value={form.seller_email} onChange={(e) => update('seller_email', e.target.value)} placeholder="jane@example.com" />
          </Field>
          <Field label="Phone *">
            <input className="input" value={form.seller_phone} onChange={(e) => update('seller_phone', e.target.value)} placeholder="07700 900000" />
          </Field>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn-primary">
            <Save className="w-4 h-4" /> {submitting ? 'Saving…' : 'Create listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
