import { parsePhoneNumberFromString } from 'libphonenumber-js';

/** Normalizza un numero in formato E.164 (es. +393331234567). Ritorna null se non valido. */
export function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const parsed = parsePhoneNumberFromString(raw);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number; // E.164
}
