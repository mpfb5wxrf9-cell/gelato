import { AsYouType, getCountries, getCountryCallingCode, isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  name: string;
  callingCode: string;
  flag: string;
}

function flagEmoji(iso2: string): string {
  return String.fromCodePoint(...[...iso2.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

let regionNames: Intl.DisplayNames | null = null;
try {
  regionNames = new Intl.DisplayNames(['it'], { type: 'region' });
} catch {
  regionNames = null;
}

export const COUNTRIES: Country[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames?.of(code) || code,
    callingCode: getCountryCallingCode(code),
    flag: flagEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'it'));

export function guessDefaultCountry(): CountryCode {
  const locale = navigator.language || 'it-IT';
  const region = locale.split('-')[1]?.toUpperCase();
  if (region && COUNTRIES.some((c) => c.code === region)) return region as CountryCode;
  return 'IT';
}

export function formatAsYouType(national: string, country: CountryCode): string {
  const formatter = new AsYouType(country);
  return formatter.input(national);
}

export function toE164(national: string, country: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(national, country);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number;
}

export function isValidNational(national: string, country: CountryCode): boolean {
  return isValidPhoneNumber(national, country);
}

export function formatDisplay(e164: string): string {
  const parsed = parsePhoneNumberFromString(e164);
  return parsed ? parsed.formatInternational() : e164;
}
