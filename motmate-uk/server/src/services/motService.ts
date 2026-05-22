import { MotResult, MotTest, MotDefect } from '../types';
import { cleanRegistration } from '../utils/registration';

const MOCK_MODE = (process.env.DVSA_MOT_MOCK_MODE ?? 'true').toLowerCase() !== 'false';

/**
 * Deterministic pseudo-random based on registration so the same plate
 * always returns the same mock data within a session.
 */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MAKES = ['Ford', 'Volkswagen', 'Toyota', 'BMW', 'Audi', 'Vauxhall', 'Nissan', 'Tesla'];
const MODELS: Record<string, string[]> = {
  Ford: ['Focus', 'Fiesta', 'Kuga'],
  Volkswagen: ['Golf', 'Polo', 'Tiguan'],
  Toyota: ['Yaris', 'Corolla', 'RAV4'],
  BMW: ['1 Series', '3 Series', 'X1'],
  Audi: ['A3', 'A4', 'Q3'],
  Vauxhall: ['Corsa', 'Astra', 'Mokka'],
  Nissan: ['Micra', 'Qashqai', 'Juke'],
  Tesla: ['Model 3', 'Model Y'],
};
const COLOURS = ['Black', 'Silver', 'Blue', 'White', 'Red', 'Grey'];
const FUELS = ['Petrol', 'Diesel', 'Hybrid Electric', 'Electric'];

const SAMPLE_ADVISORIES = [
  'Nearside front tyre worn close to legal limit',
  'Front brake disc slightly pitted',
  'Offside rear shock absorber has light corrosion',
  'Engine oil leak, but not excessive',
];

const SAMPLE_DEFECTS = [
  'Headlamp aim too high',
  'Brake pad worn close to metal',
  'Number plate light not working',
];

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function generateMockMot(registration: string): MotResult {
  const reg = cleanRegistration(registration);
  const seed = hashCode(reg);
  const make = pickFrom(MAKES, seed);
  const model = pickFrom(MODELS[make], seed >> 2);
  const colour = pickFrom(COLOURS, seed >> 3);
  const fuel = pickFrom(FUELS, seed >> 4);

  const baseYear = 2016 + (seed % 8);
  const tests: MotTest[] = [];
  const today = new Date();

  // Build 3 historical tests.
  for (let i = 0; i < 3; i++) {
    const completed = new Date(today);
    completed.setFullYear(today.getFullYear() - i);
    completed.setDate(today.getDate() - (i === 0 ? 60 : 0));
    const expiry = new Date(completed);
    expiry.setFullYear(completed.getFullYear() + 1);
    const passed = !(i === 1 && seed % 4 === 0); // occasionally fail one test
    const odometer = 80000 - i * 12000 - (seed % 5000);
    const defects: MotDefect[] = [];
    if (i === 0 && seed % 3 === 0) {
      defects.push({ text: pickFrom(SAMPLE_ADVISORIES, seed + i), type: 'ADVISORY' });
    }
    if (!passed) {
      defects.push({ text: pickFrom(SAMPLE_DEFECTS, seed + i), type: 'MAJOR' });
    }
    tests.push({
      completedDate: completed.toISOString(),
      testResult: passed ? 'PASSED' : 'FAILED',
      expiryDate: passed ? expiry.toISOString() : undefined,
      odometerValue: String(odometer),
      odometerUnit: 'mi',
      motTestNumber: `${1000000000 + (seed % 99999999) + i}`,
      defects,
    });
  }

  const latest = tests[0];
  const advisories = latest.defects.filter((d) => d.type === 'ADVISORY');
  const defects = latest.defects.filter((d) => d.type !== 'ADVISORY');

  return {
    registration: reg,
    make,
    model,
    primaryColour: colour,
    fuelType: fuel,
    firstUsedDate: `${baseYear}-03-15`,
    motTests: tests,
    motExpiryDate: latest.expiryDate,
    latestTestDate: latest.completedDate,
    latestMileage: latest.odometerValue,
    latestResult: latest.testResult,
    latestAdvisories: advisories,
    latestDefects: defects,
  };
}

/**
 * Real DVSA MOT History API call (skeleton).
 * Requires DVSA_CLIENT_ID, DVSA_CLIENT_SECRET, DVSA_API_KEY and DVSA_TOKEN_URL.
 *
 * Docs: https://documentation.history.mot.api.gov.uk/
 *
 * NOTE: This is a placeholder. The shape of the real DVSA response differs from
 * our internal MotResult type, so add a mapper here when wiring up real credentials.
 */
async function fetchRealMot(registration: string): Promise<MotResult> {
  const reg = cleanRegistration(registration);
  const {
    DVSA_CLIENT_ID,
    DVSA_CLIENT_SECRET,
    DVSA_API_KEY,
    DVSA_TOKEN_URL,
    DVSA_SCOPE_URL,
    DVSA_LOOKUP_URL_TEMPLATE,
  } = process.env;

  if (!DVSA_CLIENT_ID || !DVSA_CLIENT_SECRET || !DVSA_API_KEY || !DVSA_TOKEN_URL || !DVSA_LOOKUP_URL_TEMPLATE) {
    throw new Error(
      'Real DVSA MOT credentials are missing. Either set DVSA_MOT_MOCK_MODE=true or fill in all DVSA_* env vars.'
    );
  }

  // Step 1: Get OAuth token (client credentials flow).
  const tokenBody = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: DVSA_CLIENT_ID,
    client_secret: DVSA_CLIENT_SECRET,
    scope: DVSA_SCOPE_URL ?? '',
  });
  const tokenRes = await fetch(DVSA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenBody.toString(),
  });
  if (!tokenRes.ok) throw new Error(`DVSA token request failed: ${tokenRes.status}`);
  const tokenJson = (await tokenRes.json()) as { access_token: string };

  // Step 2: Call lookup endpoint.
  const lookupUrl = DVSA_LOOKUP_URL_TEMPLATE.replace('{registration}', encodeURIComponent(reg));
  const lookupRes = await fetch(lookupUrl, {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      'x-api-key': DVSA_API_KEY,
      Accept: 'application/json+v6',
    },
  });
  if (!lookupRes.ok) throw new Error(`DVSA lookup failed: ${lookupRes.status}`);
  const data = (await lookupRes.json()) as any;

  // Map DVSA response to internal MotResult. (Add real mapping when ready.)
  const tests: MotTest[] = (data.motTests ?? []).map((t: any) => ({
    completedDate: t.completedDate,
    testResult: t.testResult,
    expiryDate: t.expiryDate,
    odometerValue: t.odometerValue,
    odometerUnit: t.odometerUnit,
    motTestNumber: t.motTestNumber,
    defects: (t.defects ?? []).map((d: any) => ({ text: d.text, type: d.type, dangerous: d.dangerous })),
  }));
  const latest = tests[0];

  return {
    registration: reg,
    make: data.make,
    model: data.model,
    primaryColour: data.primaryColour,
    fuelType: data.fuelType,
    firstUsedDate: data.firstUsedDate,
    motTests: tests,
    motExpiryDate: latest?.expiryDate,
    latestTestDate: latest?.completedDate,
    latestMileage: latest?.odometerValue,
    latestResult: latest?.testResult,
    latestAdvisories: (latest?.defects ?? []).filter((d) => d.type === 'ADVISORY'),
    latestDefects: (latest?.defects ?? []).filter((d) => d.type !== 'ADVISORY'),
  };
}

export async function checkMot(registration: string): Promise<MotResult> {
  if (MOCK_MODE) {
    // Tiny artificial latency so the UI shows a loading state.
    await new Promise((r) => setTimeout(r, 300));
    return generateMockMot(registration);
  }
  return fetchRealMot(registration);
}

export const isMockMode = () => MOCK_MODE;
