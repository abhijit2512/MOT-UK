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
