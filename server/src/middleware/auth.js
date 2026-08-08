import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Sessione persistente (rimane valida finché l'utente non fa logout, come su WhatsApp).
export function signToken(user) {
  return jwt.sign({ sub: user.id, purpose: 'session' }, JWT_SECRET, { expiresIn: '365d' });
}

// Token breve emesso dopo la verifica OTP, prima che l'utente completi il profilo.
export function signRegistrationToken(phone) {
  return jwt.sign({ phone, purpose: 'register' }, JWT_SECRET, { expiresIn: '10m' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token mancante' });
  try {
    const payload = verifyToken(token);
    if (payload.purpose !== 'session') throw new Error('wrong token purpose');
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }
}

export { JWT_SECRET };
