/**
 * Clean a UK vehicle registration string: trim, uppercase, strip non-alphanumerics.
 */
export function cleanRegistration(input: string): string {
  return String(input || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * Loose UK registration validation. Accepts current (AB12CDE) and older formats.
 * Returns true for 2-8 alphanumeric characters.
 */
export function isValidRegistration(reg: string): boolean {
  const cleaned = cleanRegistration(reg);
  return /^[A-Z0-9]{2,8}$/.test(cleaned);
}
