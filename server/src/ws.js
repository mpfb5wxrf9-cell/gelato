import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import { URL } from 'node:url';
import db from './db.js';
import { verifyToken } from './middleware/auth.js';

// userId -> Set<WebSocket>
const connections = new Map();

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

function sendToUser(userId, payload) {
  const sockets = connections.get(userId);
  if (!sockets) return false;
  let delivered = false;
  for (const ws of sockets) {
    send(ws, payload);
    delivered = true;
  }
  return delivered;
}

function isParticipant(conv, userId) {
  return conv && (conv.user_a === userId || conv.user_b === userId);
}

function peerOf(conv, userId) {
  return conv.user_a === userId ? conv.user_b : conv.user_a;
}

export function attachWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (req, socket, head) => {
    const { pathname, searchParams } = new URL(req.url, 'http://localhost');
    if (pathname !== '/ws') {
      socket.destroy();
      return;
    }
    const token = searchParams.get('token');
    try {
      const payload = verifyToken(token);
      wss.handleUpgrade(req, socket, head, (ws) => {
        ws.userId = payload.sub;
        wss.emit('connection', ws, req);
      });
    } catch {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    const { userId } = ws;
    if (!connections.has(userId)) connections.set(userId, new Set());
    connections.get(userId).add(ws);
    send(ws, { type: 'connected', userId });

    ws.on('message', (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      if (msg.type === 'message') {
        const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(msg.conversationId);
        if (!isParticipant(conv, userId)) return send(ws, { type: 'error', error: 'Conversazione non valida.' });

        const id = uuid();
        const createdAt = Date.now();
        const recipientId = peerOf(conv, userId);

        db.prepare(
          `INSERT INTO messages (id, conversation_id, sender_id, ciphertext, iv, created_at, delivered, read)
           VALUES (?, ?, ?, ?, ?, ?, 0, 0)`
        ).run(id, msg.conversationId, userId, msg.ciphertext, msg.iv, createdAt);

        const envelope = {
          type: 'message',
          id,
          conversationId: msg.conversationId,
          senderId: userId,
          ciphertext: msg.ciphertext,
          iv: msg.iv,
          createdAt,
        };

        const delivered = sendToUser(recipientId, envelope);
        if (delivered) {
          db.prepare('UPDATE messages SET delivered = 1 WHERE id = ?').run(id);
        }

        send(ws, { type: 'ack', clientId: msg.clientId, id, createdAt, delivered });
        return;
      }

      if (msg.type === 'typing') {
        const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(msg.conversationId);
        if (!isParticipant(conv, userId)) return;
        sendToUser(peerOf(conv, userId), { type: 'typing', conversationId: msg.conversationId, from: userId });
        return;
      }

      if (msg.type === 'read') {
        const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(msg.conversationId);
        if (!isParticipant(conv, userId)) return;
        db.prepare('UPDATE messages SET read = 1 WHERE conversation_id = ? AND sender_id != ?').run(
          msg.conversationId,
          userId
        );
        sendToUser(peerOf(conv, userId), { type: 'read', conversationId: msg.conversationId, by: userId });
        return;
      }
    });

    ws.on('close', () => {
      const set = connections.get(userId);
      if (set) {
        set.delete(ws);
        if (set.size === 0) connections.delete(userId);
      }
    });
  });

  return wss;
}
