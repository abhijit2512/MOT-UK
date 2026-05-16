export interface MotHistoryRecord {
  testDate: string;
  result: 'PASS' | 'FAIL';
  mileage: number;
  expiryDate?: string;
  advisories: string[];
  defects: string[];
}

export interface MotData {
  registration: string;
  make: string;
  model: string;
  colour: string;
  fuelType: string;
  motExpiryDate: string;
  latestTestDate: string;
  mileage: number;
  result: 'PASS' | 'FAIL';
  advisories: string[];
  defects: string[];
  history: MotHistoryRecord[];
}

export interface VehicleListing {
  id: number;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  price: number;
  description: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  image_url: string;
  status: 'available' | 'sold';
  created_at: string;
  updated_at: string;
}

export type NewListingPayload = Omit<VehicleListing, 'id' | 'status' | 'created_at' | 'updated_at'>;
