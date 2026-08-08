import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import db, { avatarsDir } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { publicUser } from './auth.js';
import { normalizePhone } from '../lib/phone.js';

const router = Router();

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
const MIME_EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

router.get('/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  if (!row) return res.status(404).json({ error: 'Utente non trovato.' });
  res.json({ user: publicUser(row) });
});

router.patch('/me', requireAuth, (req, res) => {
  const { nickname, bio } = req.body || {};
  const updates = [];
  const values = [];

  if (nickname !== undefined) {
    const trimmed = String(nickname).trim();
    if (trimmed.length < 1 || trimmed.length > 30) {
      return res.status(400).json({ error: 'Il nome deve avere tra 1 e 30 caratteri.' });
    }
    updates.push('nickname = ?');
    values.push(trimmed);
  }
  if (bio !== undefined) {
    updates.push('bio = ?');
    values.push(String(bio).trim().slice(0, 140));
  }
  if (updates.length === 0) return res.status(400).json({ error: 'Nessun campo da aggiornare.' });

  values.push(req.user.sub);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  res.json({ user: publicUser(row) });
});

router.post('/me/avatar', requireAuth, (req, res) => {
  const { imageBase64 } = req.body || {};
  const match = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(imageBase64 || '');
  if (!match) return res.status(400).json({ error: 'Formato immagine non valido (usa PNG, JPEG o WebP).' });

  const [, mime, data] = match;
  const buffer = Buffer.from(data, 'base64');
  if (buffer.length > MAX_AVATAR_BYTES) {
    return res.status(413).json({ error: 'Immagine troppo grande (max 3MB).' });
  }

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  if (row?.avatar_path) {
    fs.rm(path.join(avatarsDir, row.avatar_path), { force: true }, () => {});
  }

  const filename = `${req.user.sub}-${crypto.randomBytes(4).toString('hex')}.${MIME_EXT[mime]}`;
  fs.writeFileSync(path.join(avatarsDir, filename), buffer);

  db.prepare('UPDATE users SET avatar_path = ? WHERE id = ?').run(filename, req.user.sub);
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  res.json({ user: publicUser(updated) });
});

router.delete('/me/avatar', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  if (row?.avatar_path) {
    fs.rm(path.join(avatarsDir, row.avatar_path), { force: true }, () => {});
  }
  db.prepare('UPDATE users SET avatar_path = NULL WHERE id = ?').run(req.user.sub);
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  res.json({ user: publicUser(updated) });
});

router.patch('/me/public-key', requireAuth, (req, res) => {
  const { publicKey } = req.body || {};
  if (!publicKey) return res.status(400).json({ error: 'Chiave pubblica mancante.' });
  db.prepare('UPDATE users SET public_key = ? WHERE id = ?').run(JSON.stringify(publicKey), req.user.sub);
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  res.json({ user: publicUser(row) });
});

// Sincronizzazione rubrica: dati i numeri di telefono presenti nella rubrica del
// dispositivo (raccolti lato client, es. via Contact Picker API), restituisce i soli
// profili di chi è già registrato su Aria.
router.post('/contacts/sync', requireAuth, (req, res) => {
  const phones = Array.isArray(req.body?.phones) ? req.body.phones : [];
  const normalized = [...new Set(phones.map(normalizePhone).filter(Boolean))].slice(0, 2000);
  if (normalized.length === 0) return res.json({ users: [] });

  const placeholders = normalized.map(() => '?').join(',');
  const rows = db
    .prepare(`SELECT * FROM users WHERE phone IN (${placeholders}) AND id != ?`)
    .all(...normalized, req.user.sub);

  res.json({ users: rows.map(publicUser) });
});

router.get('/search', requireAuth, (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 1) return res.json({ users: [] });

  const digits = q.replace(/[^\d+]/g, '');
  const rows = db
    .prepare(
      "SELECT * FROM users WHERE id != ? AND (nickname LIKE ? OR (? != '' AND phone LIKE ?)) LIMIT 10"
    )
    .all(req.user.sub, `%${q}%`, digits, `%${digits}%`);

  res.json({ users: rows.map(publicUser) });
});

router.get('/by-phone/:phone', requireAuth, (req, res) => {
  const phone = normalizePhone(req.params.phone);
  if (!phone) return res.status(400).json({ error: 'Numero non valido.' });
  const row = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!row) return res.status(404).json({ error: 'Nessun utente Aria con questo numero.' });
  res.json({ user: publicUser(row) });
});

export default router;
