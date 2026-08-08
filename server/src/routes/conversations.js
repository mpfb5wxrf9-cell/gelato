import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { conversationKey, sortedPair } from '../lib/conversation.js';
import { publicUser } from './auth.js';

const router = Router();

function conversationSummary(row, meId) {
  const peerId = row.user_a === meId ? row.user_b : row.user_a;
  const peer = db.prepare('SELECT * FROM users WHERE id = ?').get(peerId);
  const lastMessage = db
    .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(row.id);
  const unread = db
    .prepare('SELECT COUNT(*) as c FROM messages WHERE conversation_id = ? AND sender_id != ? AND read = 0')
    .get(row.id, meId).c;

  return {
    id: row.id,
    peer: peer ? publicUser(peer) : null,
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          senderId: lastMessage.sender_id,
          ciphertext: lastMessage.ciphertext,
          iv: lastMessage.iv,
          createdAt: lastMessage.created_at,
        }
      : null,
    unread,
    createdAt: row.created_at,
  };
}

router.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM conversations WHERE user_a = ? OR user_b = ? ORDER BY created_at DESC')
    .all(req.user.sub, req.user.sub);
  const conversations = rows
    .map((r) => conversationSummary(r, req.user.sub))
    .sort((a, b) => (b.lastMessage?.createdAt || b.createdAt) - (a.lastMessage?.createdAt || a.createdAt));
  res.json({ conversations });
});

router.post('/', requireAuth, (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'Username richiesto.' });

  const peer = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase());
  if (!peer) return res.status(404).json({ error: 'Utente non trovato.' });
  if (peer.id === req.user.sub) return res.status(400).json({ error: 'Non puoi avviare una chat con te stesso.' });

  const id = conversationKey(req.user.sub, peer.id);
  const [a, b] = sortedPair(req.user.sub, peer.id);

  const existing = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
  if (!existing) {
    db.prepare('INSERT INTO conversations (id, user_a, user_b, created_at) VALUES (?, ?, ?, ?)').run(
      id,
      a,
      b,
      Date.now()
    );
  }

  const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
  res.status(201).json({ conversation: conversationSummary(row, req.user.sub) });
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
  if (!row || (row.user_a !== req.user.sub && row.user_b !== req.user.sub)) {
    return res.status(404).json({ error: 'Conversazione non trovata.' });
  }
  res.json({ conversation: conversationSummary(row, req.user.sub) });
});

router.get('/:id/messages', requireAuth, (req, res) => {
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
  if (!conv || (conv.user_a !== req.user.sub && conv.user_b !== req.user.sub)) {
    return res.status(404).json({ error: 'Conversazione non trovata.' });
  }

  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const before = Number(req.query.before) || Date.now() + 1;

  const rows = db
    .prepare(
      'SELECT * FROM messages WHERE conversation_id = ? AND created_at < ? ORDER BY created_at DESC LIMIT ?'
    )
    .all(req.params.id, before, limit);

  db.prepare('UPDATE messages SET read = 1 WHERE conversation_id = ? AND sender_id != ?').run(
    req.params.id,
    req.user.sub
  );

  res.json({
    messages: rows
      .map((m) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        ciphertext: m.ciphertext,
        iv: m.iv,
        createdAt: m.created_at,
        delivered: !!m.delivered,
        read: !!m.read,
      }))
      .reverse(),
  });
});

export default router;
