// Uses Node's built-in SQLite (`node:sqlite`).
// Available since Node 22.5 (experimental) and stable in Node 24+.
// No native compilation required — works on plain Windows without
// Visual Studio Build Tools or Python.
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'motmate.db');
export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicle_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_number TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      mileage INTEGER NOT NULL,
      fuel_type TEXT NOT NULL,
      transmission TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      seller_name TEXT NOT NULL,
      seller_email TEXT NOT NULL,
      seller_phone TEXT NOT NULL,
      image_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','sold')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed a couple of demo listings on first run so the Browse page isn't empty.
  const count = db.prepare('SELECT COUNT(*) AS n FROM vehicle_listings').get() as { n: number };
  if (count.n === 0) {
    const seed = db.prepare(`
      INSERT INTO vehicle_listings
        (registration_number, make, model, year, mileage, fuel_type, transmission, price,
         description, seller_name, seller_email, seller_phone, image_url, status)
      VALUES (@registration_number, @make, @model, @year, @mileage, @fuel_type, @transmission, @price,
              @description, @seller_name, @seller_email, @seller_phone, @image_url, @status)
    `);

    const demo = [
      {
        registration_number: 'AB12CDE',
        make: 'Ford',
        model: 'Focus',
        year: 2018,
        mileage: 56000,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        price: 7995,
        description: 'Well-maintained Ford Focus with full service history. Recent MOT pass.',
        seller_name: 'James Carter',
        seller_email: 'james.carter@example.com',
        seller_phone: '07700 900123',
        image_url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
        status: 'available',
      },
      {
        registration_number: 'LR21XYZ',
        make: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        mileage: 32000,
        fuel_type: 'Diesel',
        transmission: 'Automatic',
        price: 14250,
        description: 'One owner, excellent condition, full VW service history.',
        seller_name: 'Priya Singh',
        seller_email: 'priya.singh@example.com',
        seller_phone: '07700 900456',
        image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        status: 'available',
      },
    ];

    for (const row of demo) seed.run(row);
  }
}
