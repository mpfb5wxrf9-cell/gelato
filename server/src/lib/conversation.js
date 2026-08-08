import crypto from 'node:crypto';

export function conversationKey(userIdA, userIdB) {
  const [a, b] = [userIdA, userIdB].sort();
  return crypto.createHash('sha256').update(`${a}:${b}`).digest('hex').slice(0, 32);
}

export function sortedPair(userIdA, userIdB) {
  return [userIdA, userIdB].sort();
}
