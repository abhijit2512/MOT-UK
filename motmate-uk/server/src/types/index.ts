export interface MotDefect {
  text: string;
  type: 'ADVISORY' | 'MINOR' | 'MAJOR' | 'DANGEROUS' | 'FAIL' | 'USER ENTERED' | 'PRS';
  dangerous?: boolean;
}

export interface MotTest {
  completedDate: string;
  testResult: 'PASSED' | 'FAILED';
  expiryDate?: string;
  odometerValue?: string;
  odometerUnit?: 'mi' | 'km';
  motTestNumber?: string;
  defects: MotDefect[];
}

export interface MotResult {
  registration: string;
  make: string;
  model: string;
  primaryColour: string;
  fuelType: string;
  firstUsedDate?: string;
  motTests: MotTest[];
  motExpiryDate?: string;
  latestTestDate?: string;
  latestMileage?: string;
  latestResult?: 'PASSED' | 'FAILED';
  latestAdvisories: MotDefect[];
  latestDefects: MotDefect[];
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

export type NewVehicleListing = Omit<VehicleListing, 'id' | 'status' | 'created_at' | 'updated_at'>;
