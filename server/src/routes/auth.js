import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { signToken, signRegistrationToken, verifyToken } from '../middleware/auth.js';
import { normalizePhone } from '../lib/phone.js';
import { generateOtp, hashOtp } from '../lib/otp.js';
import { sendOtpSms } from '../lib/sms.js';

const router = Router();

const AVATAR_COLORS = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA', '#F783AC', '#38D9A9'];
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

export function publicUser(row) {
  return {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname,
    bio: row.bio || '',
    publicKey: JSON.parse(row.public_key),
    avatarColor: row.avatar_color,
    avatarUrl: row.avatar_path ? `/avatars/${row.avatar_path}` : null,
  };
}

router.post('/otp/request', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({ error: 'Numero di telefono non valido. Usa il formato internazionale.' });
  }

  const existing = db.prepare('SELECT * FROM otp_codes WHERE phone = ?').get(phone);
  const now = Date.now();
  if (existing && now - existing.last_sent_at < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.last_sent_at)) / 1000);
    return res.status(429).json({ error: `Attendi ${wait}s prima di richiedere un nuovo codice.` });
  }

  const code = generateOtp();
  db.prepare(
    `INSERT INTO otp_codes (phone, code_hash, expires_at, attempts, last_sent_at)
     VALUES (?, ?, ?, 0, ?)
     ON CONFLICT(phone) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at,
       attempts = 0, last_sent_at = excluded.last_sent_at`
  ).run(phone, hashOtp(code), now + OTP_TTL_MS, now);

  try {
    const { sent, devCode } = await sendOtpSms(phone, code);
    res.json({ sent, devCode, phone });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Invio dell'SMS non riuscito. Riprova tra poco." });
  }
});

router.post('/otp/verify', (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const code = String(req.body?.code || '').trim();
  if (!phone || !code) return res.status(400).json({ error: 'Numero e codice richiesti.' });

  const row = db.prepare('SELECT * FROM otp_codes WHERE phone = ?').get(phone);
  if (!row) return res.status(400).json({ error: 'Richiedi prima un codice di verifica.' });
  if (Date.now() > row.expires_at) {
    db.prepare('DELETE FROM otp_codes WHERE phone = ?').run(phone);
    return res.status(400).json({ error: 'Codice scaduto. Richiedine uno nuovo.' });
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Troppi tentativi. Richiedi un nuovo codice.' });
  }
  if (row.code_hash !== hashOtp(code)) {
    db.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ?').run(phone);
    return res.status(401).json({ error: 'Codice non corretto.' });
  }

  db.prepare('DELETE FROM otp_codes WHERE phone = ?').run(phone);

  const userRow = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (userRow) {
    const token = signToken(userRow);
    return res.json({ isNewUser: false, token, user: publicUser(userRow) });
  }

  const registrationToken = signRegistrationToken(phone);
  res.json({ isNewUser: true, registrationToken });
});

router.post('/register', (req, res) => {
  const { registrationToken, nickname, bio, publicKey } = req.body || {};

  let payload;
  try {
    payload = verifyToken(registrationToken);
    if (payload.purpose !== 'register') throw new Error('wrong purpose');
  } catch {
    return res.status(401).json({ error: 'Verifica del numero scaduta. Ricomincia dal numero di telefono.' });
  }

  const trimmedNickname = String(nickname || '').trim();
  if (trimmedNickname.length < 1 || trimmedNickname.length > 30) {
    return res.status(400).json({ error: 'Il nome deve avere tra 1 e 30 caratteri.' });
  }
  if (!publicKey) return res.status(400).json({ error: 'Chiave pubblica di cifratura mancante.' });

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(payload.phone);
  if (existing) return res.status(409).json({ error: 'Numero già registrato, effettua l’accesso.' });

  const id = uuid();
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const now = Date.now();

  db.prepare(
    `INSERT INTO users (id, phone, nickname, bio, public_key, avatar_color, avatar_path, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NULL, ?)`
  ).run(id, payload.phone, trimmedNickname, String(bio || '').trim().slice(0, 140), JSON.stringify(publicKey), avatarColor, now);

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  const token = signToken(row);
  res.status(201).json({ token, user: publicUser(row) });
});

export default router;
