import { Router } from 'express';
import { db } from '../db/database';
import { VehicleListing } from '../types';
import { cleanRegistration, validateNewListing } from '../utils/validation';

const router = Router();

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM vehicle_listings ORDER BY created_at DESC')
    .all() as unknown as VehicleListing[];
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });

  const row = db.prepare('SELECT * FROM vehicle_listings WHERE id = ?').get(id) as unknown as VehicleListing | undefined;
  if (!row) return res.status(404).json({ error: 'listing not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const errors = validateNewListing(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ error: 'validation failed', details: errors });
  }

  const body = req.body as Record<string, unknown>;
  const payload = {
    registration_number: cleanRegistration(String(body.registration_number)),
    make: String(body.make).trim(),
    model: String(body.model).trim(),
    year: Number(body.year),
    mileage: Number(body.mileage),
    fuel_type: String(body.fuel_type).trim(),
    transmission: String(body.transmission).trim(),
    price: Number(body.price),
    description: String(body.description).trim(),
    seller_name: String(body.seller_name).trim(),
    seller_email: String(body.seller_email).trim(),
    seller_phone: String(body.seller_phone).trim(),
    image_url:
      typeof body.image_url === 'string' && body.image_url.trim().length > 0
        ? String(body.image_url).trim()
        : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  };

  const result = db
    .prepare(
      `INSERT INTO vehicle_listings
        (registration_number, make, model, year, mileage, fuel_type, transmission, price,
         description, seller_name, seller_email, seller_phone, image_url)
       VALUES (@registration_number, @make, @model, @year, @mileage, @fuel_type, @transmission, @price,
               @description, @seller_name, @seller_email, @seller_phone, @image_url)`,
    )
    .run(payload);

  const created = db.prepare('SELECT * FROM vehicle_listings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

router.patch('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });

  const status = String((req.body ?? {}).status ?? '');
  if (status !== 'available' && status !== 'sold') {
    return res.status(400).json({ error: "status must be 'available' or 'sold'" });
  }

  const result = db
    .prepare("UPDATE vehicle_listings SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(status, id);

  if (result.changes === 0) return res.status(404).json({ error: 'listing not found' });
  const row = db.prepare('SELECT * FROM vehicle_listings WHERE id = ?').get(id);
  res.json(row);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
  const result = db.prepare('DELETE FROM vehicle_listings WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'listing not found' });
  res.status(204).end();
});

export default router;
