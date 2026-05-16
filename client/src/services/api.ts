import { MotData, NewListingPayload, VehicleListing } from '../types';

const BASE = '/api';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function checkMot(registration: string): Promise<MotData> {
  const res = await fetch(`${BASE}/mot/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registration }),
  });
  return handle<MotData>(res);
}

export async function listVehicles(): Promise<VehicleListing[]> {
  return handle<VehicleListing[]>(await fetch(`${BASE}/listings`));
}

export async function getVehicle(id: number): Promise<VehicleListing> {
  return handle<VehicleListing>(await fetch(`${BASE}/listings/${id}`));
}

export async function createListing(payload: NewListingPayload): Promise<VehicleListing> {
  const res = await fetch(`${BASE}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle<VehicleListing>(res);
}

export async function updateListingStatus(id: number, status: 'available' | 'sold'): Promise<VehicleListing> {
  const res = await fetch(`${BASE}/listings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handle<VehicleListing>(res);
}

export async function deleteListing(id: number): Promise<void> {
  const res = await fetch(`${BASE}/listings/${id}`, { method: 'DELETE' });
  await handle<void>(res);
}
