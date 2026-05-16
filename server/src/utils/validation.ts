export function cleanRegistration(reg: string): string {
  return reg.replace(/\s+/g, '').toUpperCase();
}

export function isValidRegistration(reg: string): boolean {
  const cleaned = cleanRegistration(reg);
  return cleaned.length >= 2 && cleaned.length <= 8 && /^[A-Z0-9]+$/.test(cleaned);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export interface ListingValidationError {
  field: string;
  message: string;
}

export function validateNewListing(body: Record<string, unknown>): ListingValidationError[] {
  const errors: ListingValidationError[] = [];
  const requiredStrings = [
    'registration_number',
    'make',
    'model',
    'fuel_type',
    'transmission',
    'description',
    'seller_name',
    'seller_email',
    'seller_phone',
  ];

  for (const field of requiredStrings) {
    const value = body[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      errors.push({ field, message: `${field} is required` });
    }
  }

  const year = Number(body.year);
  if (!Number.isFinite(year) || year < 1900 || year > new Date().getFullYear() + 1) {
    errors.push({ field: 'year', message: 'year must be a valid number' });
  }

  const mileage = Number(body.mileage);
  if (!Number.isFinite(mileage) || mileage < 0) {
    errors.push({ field: 'mileage', message: 'mileage must be a non-negative number' });
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    errors.push({ field: 'price', message: 'price must be a non-negative number' });
  }

  if (typeof body.seller_email === 'string' && !isValidEmail(body.seller_email)) {
    errors.push({ field: 'seller_email', message: 'seller_email must be a valid email address' });
  }

  if (typeof body.registration_number === 'string' && !isValidRegistration(body.registration_number)) {
    errors.push({ field: 'registration_number', message: 'registration_number is invalid' });
  }

  return errors;
}
