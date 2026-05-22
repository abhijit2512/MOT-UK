import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'motmate.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

export function initSchema(): void {
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
      status TEXT NOT NULL DEFAULT 'available',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed a couple of demo listings so Browse Vehicles isn't empty on first run.
  const count = db.prepare('SELECT COUNT(*) AS c FROM vehicle_listings').get() as { c: number };
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO vehicle_listings
        (registration_number, make, model, year, mileage, fuel_type, transmission,
         price, description, seller_name, seller_email, seller_phone, image_url, status)
      VALUES (@reg, @make, @model, @year, @mileage, @fuel, @trans,
              @price, @desc, @sname, @semail, @sphone, @img, 'available')
    `);
    insert.run({
      reg: 'AB12CDE', make: 'Ford', model: 'Focus', year: 2018, mileage: 54000,
      fuel: 'Petrol', trans: 'Manual', price: 7995,
      desc: 'One careful owner, full service history, 12 months MOT.',
      sname: 'Alex Hughes', semail: 'alex@example.com', sphone: '07700 900111',
      img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    });
    insert.run({
      reg: 'BD19XYZ', make: 'Volkswagen', model: 'Golf', year: 2020, mileage: 31200,
      fuel: 'Diesel', trans: 'Automatic', price: 14250,
      desc: 'Low mileage Golf in great condition, two keys.',
      sname: 'Priya Patel', semail: 'priya@example.com', sphone: '07700 900222',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    });
    insert.run({
      reg: 'LX21KMN', make: 'Tesla', model: 'Model 3', year: 2021, mileage: 18500,
      fuel: 'Electric', trans: 'Automatic', price: 24990,
      desc: 'Long Range, premium interior, autopilot enabled.',
      sname: 'Sam Carter', semail: 'sam@example.com', sphone: '07700 900333',
      img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    });
  }
}
