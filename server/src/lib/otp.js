import crypto from 'node:crypto';

export function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export function hashOtp(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}
