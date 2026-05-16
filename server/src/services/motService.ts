import { MotData, MotHistoryRecord } from '../types';
import { cleanRegistration } from '../utils/validation';

const isMockMode = (): boolean => {
  const flag = (process.env.DVSA_MOT_MOCK_MODE ?? 'true').toLowerCase();
  return flag !== 'false';
};

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function buildMockData(registration: string): MotData {
  const reg = cleanRegistration(registration);
  const seed = hash(reg);

  const makes = ['Ford', 'Volkswagen', 'Toyota', 'BMW', 'Vauxhall', 'Nissan', 'Audi', 'Honda'];
  const modelsByMake: Record<string, string[]> = {
    Ford: ['Focus', 'Fiesta', 'Kuga'],
    Volkswagen: ['Golf', 'Polo', 'Passat'],
    Toyota: ['Yaris', 'Corolla', 'Auris'],
    BMW: ['1 Series', '3 Series', 'X1'],
    Vauxhall: ['Corsa', 'Astra', 'Insignia'],
    Nissan: ['Qashqai', 'Juke', 'Micra'],
    Audi: ['A3', 'A4', 'Q3'],
    Honda: ['Civic', 'Jazz', 'CR-V'],
  };
  const colours = ['Blue', 'Silver', 'Black', 'White', 'Red', 'Grey'];
  const fuels = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

  const make = makes[seed % makes.length];
  const modelList = modelsByMake[make];
  const model = modelList[seed % modelList.length];
  const colour = colours[seed % colours.length];
  const fuelType = fuels[seed % fuels.length];

  const today = new Date();
  const latestTest = new Date(today);
  latestTest.setMonth(latestTest.getMonth() - (seed % 6));
  const expiry = new Date(latestTest);
  expiry.setFullYear(expiry.getFullYear() + 1);

  const mileage = 25000 + (seed % 80000);
  const passed = seed % 7 !== 0;

  const advisoryPool = [
    'Nearside front tyre worn close to legal limit',
    'Offside rear brake pad wearing thin',
    'Minor oil leak from engine',
    'Front wiper blade deteriorated',
    'Headlight aim slightly low',
  ];
  const defectPool = [
    'Offside front brake disc worn, pitted or scored',
    'Nearside front tyre has cord exposed',
    'Suspension arm pin or bush excessively worn',
    'Headlamp not working on dipped beam',
  ];

  const advisories = advisoryPool.slice(0, (seed % 3) + 1);
  const defects = passed ? [] : defectPool.slice(0, (seed % 2) + 1);

  const history: MotHistoryRecord[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(latestTest);
    d.setFullYear(d.getFullYear() - i);
    const histPass = (seed + i) % 5 !== 0;
    history.push({
      testDate: d.toISOString().slice(0, 10),
      result: histPass ? 'PASS' : 'FAIL',
      mileage: Math.max(0, mileage - i * 10000 - (seed % 2000)),
      expiryDate: histPass ? new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()).toISOString().slice(0, 10) : undefined,
      advisories: advisoryPool.slice(0, ((seed + i) % 3)),
      defects: histPass ? [] : defectPool.slice(0, 1),
    });
  }

  return {
    registration: reg,
    make,
    model,
    colour,
    fuelType,
    motExpiryDate: expiry.toISOString().slice(0, 10),
    latestTestDate: latestTest.toISOString().slice(0, 10),
    mileage,
    result: passed ? 'PASS' : 'FAIL',
    advisories,
    defects,
    history,
  };
}

/**
 * Fetch MOT info from the real DVSA MOT History API.
 *
 * NOTE: This is a placeholder. The full DVSA flow is:
 *   1. POST to DVSA_TOKEN_URL with client_credentials grant (scope DVSA_SCOPE_URL)
 *      to obtain an OAuth bearer token.
 *   2. GET DVSA_LOOKUP_URL_TEMPLATE.replace('{registration}', reg)
 *      with headers: Authorization: Bearer <token>, x-api-key: DVSA_API_KEY
 *   3. Map the response to MotData.
 *
 * Do NOT commit real credentials. Configure them via server/.env.
 */
async function fetchRealMotData(registration: string): Promise<MotData> {
  const { DVSA_CLIENT_ID, DVSA_CLIENT_SECRET, DVSA_API_KEY, DVSA_TOKEN_URL, DVSA_SCOPE_URL, DVSA_LOOKUP_URL_TEMPLATE } = process.env;

  if (!DVSA_CLIENT_ID || !DVSA_CLIENT_SECRET || !DVSA_API_KEY || !DVSA_TOKEN_URL || !DVSA_SCOPE_URL || !DVSA_LOOKUP_URL_TEMPLATE) {
    throw new Error('DVSA credentials are not configured. Set them in server/.env or enable DVSA_MOT_MOCK_MODE=true.');
  }

  // TODO (real API): implement OAuth token fetch and lookup call here.
  // Left as a placeholder so beginners can add real credentials later
  // without changing app structure.
  throw new Error('Real DVSA API call is not implemented yet. Use mock mode (DVSA_MOT_MOCK_MODE=true) for now.');
}

export async function getMotData(registration: string): Promise<MotData> {
  if (isMockMode()) {
    return buildMockData(registration);
  }
  return fetchRealMotData(registration);
}
