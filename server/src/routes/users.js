import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { publicUser } from './auth.js';

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  if (!row) return res.status(404).json({ error: 'Utente non trovato.' });
  res.json({ user: publicUser(row) });
});

router.patch('/me/public-key', requireAuth, (req, res) => {
  const { publicKey } = req.body || {};
  if (!publicKey) return res.status(400).json({ error: 'Chiave pubblica mancante.' });
  db.prepare('UPDATE users SET public_key = ? WHERE id = ?').run(JSON.stringify(publicKey), req.user.sub);
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  res.json({ user: publicUser(row) });
});

router.get('/search', requireAuth, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q.length < 1) return res.json({ users: [] });
  const rows = db
    .prepare('SELECT * FROM users WHERE username LIKE ? AND id != ? LIMIT 10')
    .all(`%${q}%`, req.user.sub);
  res.json({ users: rows.map(publicUser) });
});

router.get('/:username', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(req.params.username.toLowerCase());
  if (!row) return res.status(404).json({ error: 'Utente non trovato.' });
  res.json({ user: publicUser(row) });
});

export default router;
