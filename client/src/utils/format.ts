export function formatRegistration(reg: string): string {
  const cleaned = reg.replace(/\s+/g, '').toUpperCase();
  // Standard UK plate is 7 chars: AB12 CDE — add space before the last 3 if length is 7.
  if (cleaned.length === 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return cleaned;
}

export function formatGBP(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMiles(value: number): string {
  return `${new Intl.NumberFormat('en-GB').format(value)} mi`;
}

export function formatDate(value: string): string {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return value;
  }
}
