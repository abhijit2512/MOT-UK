import { db } from '../db/database';
import { VehicleListing, NewVehicleListing } from '../types';

export function listAll(): VehicleListing[] {
  return db
    .prepare('SELECT * FROM vehicle_listings ORDER BY created_at DESC')
    .all() as VehicleListing[];
}

export function getById(id: number): VehicleListing | undefined {
  return db
    .prepare('SELECT * FROM vehicle_listings WHERE id = ?')
    .get(id) as VehicleListing | undefined;
}

export function create(input: NewVehicleListing): VehicleListing {
  const stmt = db.prepare(`
    INSERT INTO vehicle_listings
      (registration_number, make, model, year, mileage, fuel_type, transmission,
       price, description, seller_name, seller_email, seller_phone, image_url, status)
    VALUES (@registration_number, @make, @model, @year, @mileage, @fuel_type, @transmission,
            @price, @description, @seller_name, @seller_email, @seller_phone, @image_url, 'available')
  `);
  const info = stmt.run(input);
  return getById(Number(info.lastInsertRowid))!;
}

export function updateStatus(id: number, status: 'available' | 'sold'): VehicleListing | undefined {
  db.prepare(
    "UPDATE vehicle_listings SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, id);
  return getById(id);
}

export function remove(id: number): boolean {
  const info = db.prepare('DELETE FROM vehicle_listings WHERE id = ?').run(id);
  return info.changes > 0;
}
