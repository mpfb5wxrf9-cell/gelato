import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

const USERNAME_RE = /^[a-z0-9_]{3,20}$/i;
const AVATAR_COLORS = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA', '#F783AC', '#38D9A9'];

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    publicKey: JSON.parse(row.public_key),
    avatarColor: row.avatar_color,
  };
}

router.post('/register', (req, res) => {
  const { username, password, displayName, publicKey } = req.body || {};

  if (!username || !USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Username non valido (3-20 caratteri, lettere/numeri/underscore).' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'La password deve avere almeno 8 caratteri.' });
  }
  if (!publicKey) {
    return res.status(400).json({ error: 'Chiave pubblica di cifratura mancante.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Username già in uso.' });
  }

  const id = uuid();
  const passwordHash = bcrypt.hashSync(password, 10);
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const now = Date.now();

  db.prepare(
    `INSERT INTO users (id, username, display_name, password_hash, public_key, avatar_color, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, username.toLowerCase(), displayName?.trim() || username, passwordHash, JSON.stringify(publicKey), avatarColor, now);

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  const token = signToken(row);
  res.status(201).json({ token, user: publicUser(row) });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password richiesti.' });
  }
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase());
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Credenziali non valide.' });
  }
  const token = signToken(row);
  res.json({ token, user: publicUser(row) });
});

export default router;
export { publicUser };
