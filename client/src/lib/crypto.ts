// Crittografia end-to-end lato client con Web Crypto API.
//
// Ogni utente possiede una coppia di chiavi ECDH (P-256). La chiave privata
// viene generata come non-estraibile e non lascia mai il dispositivo: resta
// nell'IndexedDB del browser come CryptoKey opaco. Solo la chiave pubblica
// (sempre estraibile per specifica WebCrypto) viene inviata al server, che
// non vede né conserva mai testo in chiaro o chiavi private.
//
// Per ogni conversazione, i due partecipanti derivano localmente la stessa
// chiave simmetrica AES-256-GCM tramite ECDH (mia privata + pubblica del
// contatto == sua privata + mia pubblica). I messaggi sono cifrati con IV
// casuale a 96 bit per ogni invio.

import { loadIdentity, saveIdentity, type StoredIdentity } from './storage';

const ECDH_PARAMS: EcKeyImportParams | EcKeyGenParams = { name: 'ECDH', namedCurve: 'P-256' };

export interface Identity {
  userId: string;
  keyPair: CryptoKeyPair;
  publicJwk: JsonWebKey;
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
}

function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToBuf(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Ottiene (o genera se assente) l'identità di cifratura locale per un utente. */
export async function getOrCreateIdentity(userId: string): Promise<Identity> {
  const existing = await loadIdentity(userId);
  if (existing) return existing;

  const keyPair = await crypto.subtle.generateKey(ECDH_PARAMS, false, ['deriveKey', 'deriveBits']);
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

  const identity: StoredIdentity = { userId, keyPair, publicJwk };
  await saveIdentity(identity);
  return identity;
}

/** Forza la rigenerazione dell'identità (es. nuovo dispositivo senza chiave privata storica). */
export async function regenerateIdentity(userId: string): Promise<Identity> {
  const keyPair = await crypto.subtle.generateKey(ECDH_PARAMS, false, ['deriveKey', 'deriveBits']);
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const identity: StoredIdentity = { userId, keyPair, publicJwk };
  await saveIdentity(identity);
  return identity;
}

const sharedKeyCache = new Map<string, CryptoKey>();

/** Deriva (con cache in memoria) la chiave simmetrica condivisa per una conversazione. */
export async function getSharedKey(
  myIdentity: Identity,
  conversationId: string,
  peerPublicJwk: JsonWebKey
): Promise<CryptoKey> {
  const cacheKey = `${myIdentity.userId}:${conversationId}`;
  const cached = sharedKeyCache.get(cacheKey);
  if (cached) return cached;

  const peerPublicKey = await crypto.subtle.importKey('jwk', peerPublicJwk, ECDH_PARAMS, true, []);

  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: peerPublicKey },
    myIdentity.keyPair.privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  sharedKeyCache.set(cacheKey, sharedKey);
  return sharedKey;
}

export function clearSharedKeyCache(): void {
  sharedKeyCache.clear();
}

export async function encryptText(sharedKey: CryptoKey, plaintext: string): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sharedKey, encoded);
  return { ciphertext: bufToBase64(ciphertextBuf), iv: bufToBase64(iv.buffer) };
}

export async function decryptText(sharedKey: CryptoKey, payload: EncryptedPayload): Promise<string> {
  const ciphertext = base64ToBuf(payload.ciphertext);
  const iv = base64ToBuf(payload.iv);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sharedKey, ciphertext);
  return new TextDecoder().decode(plainBuf);
}

/** Fingerprint leggibile della chiave pubblica, utile per verificare l'identità del contatto. */
export async function fingerprint(jwk: JsonWebKey): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify({ x: jwk.x, y: jwk.y }));
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex
    .slice(0, 20)
    .toUpperCase()
    .match(/.{1,4}/g)!
    .join(' ');
}
