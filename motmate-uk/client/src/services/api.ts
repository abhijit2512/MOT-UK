import { MotResponse, VehicleListing, NewVehicleListing } from '../types';

const API_BASE = '/api';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async checkMot(registration: string): Promise<MotResponse> {
    const res = await fetch(`${API_BASE}/mot/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration }),
    });
    return handle<MotResponse>(res);
  },

  async listListings(): Promise<VehicleListing[]> {
    const res = await fetch(`${API_BASE}/listings`);
    return handle<VehicleListing[]>(res);
  },

  async getListing(id: number): Promise<VehicleListing> {
    const res = await fetch(`${API_BASE}/listings/${id}`);
    return handle<VehicleListing>(res);
  },

  async createListing(input: NewVehicleListing): Promise<VehicleListing> {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handle<VehicleListing>(res);
  },

  async updateStatus(id: number, status: 'available' | 'sold'): Promise<VehicleListing> {
    const res = await fetch(`${API_BASE}/listings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handle<VehicleListing>(res);
  },

  async deleteListing(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/listings/${id}`, { method: 'DELETE' });
    await handle(res);
  },
};
