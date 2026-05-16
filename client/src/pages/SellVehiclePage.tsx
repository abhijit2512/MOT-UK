import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { createListing } from '../services/api';
import { NewListingPayload } from '../types';
import { cleanRegistration, isValidEmail, isValidRegistration } from '../utils/validation';

const empty: NewListingPayload = {
  registration_number: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  fuel_type: 'Petrol',
  transmission: 'Manual',
  price: 0,
  description: '',
  seller_name: '',
  seller_email: '',
  seller_phone: '',
  image_url: '',
};

const fuels = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions = ['Manual', 'Automatic'];

export default function SellVehiclePage() {
  const [form, setForm] = useState<NewListingPayload>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof NewListingPayload>(key: K, value: NewListingPayload[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!isValidRegistration(form.registration_number)) e.registration_number = 'Enter a valid UK registration.';
    if (!form.make.trim()) e.make = 'Make is required.';
    if (!form.model.trim()) e.model = 'Model is required.';
    if (!Number.isFinite(form.year) || form.year < 1900 || form.year > new Date().getFullYear() + 1) e.year = 'Enter a valid year.';
    if (!Number.isFinite(form.mileage) || form.mileage < 0) e.mileage = 'Mileage must be 0 or more.';
    if (!Number.isFinite(form.price) || form.price <= 0) e.price = 'Price must be greater than 0.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.seller_name.trim()) e.seller_name = 'Your name is required.';
    if (!isValidEmail(form.seller_email)) e.seller_email = 'Enter a valid email address.';
    if (!form.seller_phone.trim()) e.seller_phone = 'Phone is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const created = await createListing({
        ...form,
        registration_number: cleanRegistration(form.registration_number),
      });
      setSuccessId(created.id);
      setForm(empty);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="max-w-2xl mx-auto card p-8 text-center space-y-4">
        <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-bold">Listing created!</h1>
        <p className="text-slate-600">Your vehicle has been added to the marketplace.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/browse" className="btn-primary">Browse vehicles</Link>
          <Link to={`/vehicles/${successId}`} className="btn-secondary">View my listing</Link>
          <button onClick={() => setSuccessId(null)} className="btn-secondary">List another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Sell my vehicle</h1>
      <p className="text-slate-600 mb-6">Fill in the details below to add your vehicle to the marketplace.</p>

      <form onSubmit={onSubmit} className="card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Registration number" error={errors.registration_number}>
            <input
              className="input uppercase tracking-wider"
              value={form.registration_number}
              onChange={(e) => update('registration_number', e.target.value)}
              placeholder="AB12 CDE"
            />
          </Field>
          <Field label="Year" error={errors.year}>
            <input
              type="number"
              className="input"
              value={form.year}
              onChange={(e) => update('year', Number(e.target.value))}
            />
          </Field>
          <Field label="Make" error={errors.make}>
            <input className="input" value={form.make} onChange={(e) => update('make', e.target.value)} placeholder="Ford" />
          </Field>
          <Field label="Model" error={errors.model}>
            <input className="input" value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="Focus" />
          </Field>
          <Field label="Mileage" error={errors.mileage}>
            <input
              type="number"
              className="input"
              value={form.mileage}
              onChange={(e) => update('mileage', Number(e.target.value))}
            />
          </Field>
          <Field label="Price (£)" error={errors.price}>
            <input
              type="number"
              className="input"
              value={form.price}
              onChange={(e) => update('price', Number(e.target.value))}
            />
          </Field>
          <Field label="Fuel type">
            <select className="input" value={form.fuel_type} onChange={(e) => update('fuel_type', e.target.value)}>
              {fuels.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Transmission">
            <select className="input" value={form.transmission} onChange={(e) => update('transmission', e.target.value)}>
              {transmissions.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Description" error={errors.description}>
          <textarea
            className="input min-h-[100px]"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Tell buyers about your vehicle, service history, condition…"
          />
        </Field>

        <Field label="Image URL (optional)">
          <input
            className="input"
            value={form.image_url}
            onChange={(e) => update('image_url', e.target.value)}
            placeholder="https://…"
          />
        </Field>

        <div className="border-t pt-5">
          <h2 className="font-semibold mb-3">Seller contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" error={errors.seller_name}>
              <input
                className="input"
                value={form.seller_name}
                onChange={(e) => update('seller_name', e.target.value)}
              />
            </Field>
            <Field label="Email" error={errors.seller_email}>
              <input
                className="input"
                value={form.seller_email}
                onChange={(e) => update('seller_email', e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone" error={errors.seller_phone}>
              <input
                className="input"
                value={form.seller_phone}
                onChange={(e) => update('seller_phone', e.target.value)}
                placeholder="07700 900123"
              />
            </Field>
          </div>
        </div>

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-3 text-sm">{serverError}</div>
        )}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit listing'}
          </button>
          <Link to="/browse" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
