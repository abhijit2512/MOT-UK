export function formatRegistration(reg: string): string {
  const cleaned = String(reg || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length === 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return cleaned;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(m: number | string): string {
  const n = typeof m === 'number' ? m : Number(m);
  if (!Number.isFinite(n)) return String(m);
  return `${n.toLocaleString('en-GB')} mi`;
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Try to extract a UK registration out of a freeform voice command.
 * Examples:
 *   "Check MOT for AB12 CDE" -> "AB12CDE"
 *   "check em o t a b one two c d e" -> "AB12CDE" (limited)
 */
export function extractRegistrationFromSpeech(text: string): string | null {
  if (!text) return null;
  const upper = text.toUpperCase();
  // First try: collapse spaces and look for plate-like substrings.
  const collapsed = upper.replace(/[^A-Z0-9 ]/g, '');
  const tokens = collapsed.split(/\s+/).filter(Boolean);

  // Strategy 1: walk through tokens, accumulate alphanumeric runs, return the first 5-8 char run.
  for (let i = 0; i < tokens.length; i++) {
    let acc = tokens[i];
    let j = i + 1;
    while (acc.length < 8 && j < tokens.length && /^[A-Z0-9]+$/.test(tokens[j])) {
      acc += tokens[j];
      if (acc.length >= 5 && acc.length <= 8 && /[A-Z]/.test(acc) && /[0-9]/.test(acc)) {
        return acc;
      }
      j++;
    }
    if (acc.length >= 5 && acc.length <= 8 && /[A-Z]/.test(acc) && /[0-9]/.test(acc)) {
      return acc;
    }
  }
  // Strategy 2: whole-string fallback.
  const stripped = upper.replace(/[^A-Z0-9]/g, '');
  if (stripped.length >= 5 && stripped.length <= 8) return stripped;
  return null;
}
