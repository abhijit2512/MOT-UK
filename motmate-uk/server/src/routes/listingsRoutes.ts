import { Router } from 'express';
import * as svc from '../services/listingsService';
import { cleanRegistration, isValidRegistration } from '../utils/registration';

const router = Router();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.get('/', (_req, res) => {
  res.json(svc.listAll());
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid listing id.' });
  }
  const listing = svc.getById(id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });
  res.json(listing);
});

router.post('/', (req, res) => {
  const b = req.body ?? {};
  const errors: string[] = [];

  const reg = cleanRegistration(b.registration_number ?? '');
  if (!isValidRegistration(reg)) errors.push('Valid registration is required.');

  for (const field of ['make', 'model', 'fuel_type', 'transmission', 'description', 'seller_name', 'seller_phone', 'image_url']) {
    if (!b[field] || String(b[field]).trim() === '') errors.push(`${field} is required.`);
  }

  const year = Number(b.year);
  if (!Number.isInteger(year) || year < 1950 || year > 2100) errors.push('Year must be a valid number.');

  const mileage = Number(b.mileage);
  if (!Number.isFinite(mileage) || mileage < 0) errors.push('Mileage must be a positive number.');

  const price = Number(b.price);
  if (!Number.isFinite(price) || price < 0) errors.push('Price must be a positive number.');

  if (!b.seller_email || !isValidEmail(String(b.seller_email))) errors.push('Valid seller email is required.');

  if (errors.length) return res.status(400).json({ error: errors.join(' ') });

  const listing = svc.create({
    registration_number: reg,
    make: String(b.make).trim(),
    model: String(b.model).trim(),
    year,
    mileage,
    fuel_type: String(b.fuel_type).trim(),
    transmission: String(b.transmission).trim(),
    price,
    description: String(b.description).trim(),
    seller_name: String(b.seller_name).trim(),
    seller_email: String(b.seller_email).trim(),
    seller_phone: String(b.seller_phone).trim(),
    image_url: String(b.image_url).trim(),
  });
  res.status(201).json(listing);
});

router.patch('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const status = req.body?.status;
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id.' });
  if (status !== 'available' && status !== 'sold') {
    return res.status(400).json({ error: 'Status must be "available" or "sold".' });
  }
  const updated = svc.updateStatus(id, status);
  if (!updated) return res.status(404).json({ error: 'Listing not found.' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id.' });
  const ok = svc.remove(id);
  if (!ok) return res.status(404).json({ error: 'Listing not found.' });
  res.json({ deleted: true });
});

export default router;
