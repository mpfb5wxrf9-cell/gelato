import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { api, getToken, setToken } from '../lib/api';
import { getOrCreateIdentity } from '../lib/crypto';
import type { Identity } from '../lib/crypto';
import type { PublicUser } from '../lib/types';
import { RealtimeClient } from '../lib/ws';

interface AuthContextValue {
  user: PublicUser | null;
  identity: Identity | null;
  realtime: RealtimeClient | null;
  loading: boolean;
  error: string | null;
  pendingPhone: string | null;
  requestOtp: (phone: string) => Promise<{ devCode: string | null }>;
  verifyOtp: (phone: string, code: string) => Promise<{ isNewUser: boolean }>;
  completeRegistration: (nickname: string, bio: string) => Promise<void>;
  setUser: (user: PublicUser) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncIdentity(user: PublicUser): Promise<{ identity: Identity; user: PublicUser }> {
  const identity = await getOrCreateIdentity(user.id);
  const localKey = JSON.stringify(identity.publicJwk);
  const remoteKey = JSON.stringify(user.publicKey);

  if (localKey !== remoteKey) {
    // Nuovo dispositivo/browser: pubblichiamo la nostra nuova chiave pubblica.
    // Le conversazioni precedenti restano cifrate con la vecchia chiave e non
    // saranno decifrabili qui, esattamente come nel modello di sicurezza Signal.
    const { user: updated } = await api.updatePublicKey(identity.publicJwk);
    return { identity, user: updated };
  }
  return { identity, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<PublicUser | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const registrationTokenRef = useRef<string | null>(null);
  const realtimeRef = useRef<RealtimeClient | null>(null);
  const [realtimeVersion, setRealtimeVersion] = useState(0);

  const bootRealtime = useCallback((token: string) => {
    realtimeRef.current?.close();
    const client = new RealtimeClient(token);
    client.connect();
    realtimeRef.current = client;
    setRealtimeVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { user: me } = await api.me();
        const synced = await syncIdentity(me);
        setUserState(synced.user);
        setIdentity(synced.identity);
        bootRealtime(token);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      realtimeRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestOtp = useCallback(async (phone: string) => {
    setError(null);
    try {
      const { devCode } = await api.requestOtp(phone);
      setPendingPhone(phone);
      return { devCode };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invio del codice non riuscito.');
      throw err;
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    setError(null);
    try {
      const result = await api.verifyOtp(phone, code);
      if (!result.isNewUser) {
        setToken(result.token);
        const synced = await syncIdentity(result.user);
        setUserState(synced.user);
        setIdentity(synced.identity);
        bootRealtime(result.token);
        return { isNewUser: false };
      }
      registrationTokenRef.current = result.registrationToken;
      return { isNewUser: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Codice non valido.');
      throw err;
    }
  }, [bootRealtime]);

  const completeRegistration = useCallback(
    async (nickname: string, bio: string) => {
      setError(null);
      const registrationToken = registrationTokenRef.current;
      const phone = pendingPhone;
      if (!registrationToken || !phone) {
        throw new Error('Sessione di registrazione scaduta. Ricomincia dal numero di telefono.');
      }
      try {
        const tempId = `pending:${phone}`;
        const identityDraft = await getOrCreateIdentity(tempId);
        const { token, user: newUser } = await api.register(registrationToken, nickname, bio, identityDraft.publicJwk);
        setToken(token);
        // Ri-ancoriamo l'identità al vero userId assegnato dal server.
        const realIdentity = await getOrCreateIdentity(newUser.id);
        if (JSON.stringify(realIdentity.publicJwk) !== JSON.stringify(identityDraft.publicJwk)) {
          await api.updatePublicKey(realIdentity.publicJwk);
        }
        registrationTokenRef.current = null;
        setUserState(newUser);
        setIdentity(realIdentity);
        bootRealtime(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Creazione del profilo non riuscita.');
        throw err;
      }
    },
    [bootRealtime, pendingPhone]
  );

  const logout = useCallback(() => {
    setToken(null);
    realtimeRef.current?.close();
    realtimeRef.current = null;
    registrationTokenRef.current = null;
    setPendingPhone(null);
    setUserState(null);
    setIdentity(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const setUser = useCallback((u: PublicUser) => setUserState(u), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      identity,
      realtime: realtimeRef.current,
      loading,
      error,
      pendingPhone,
      requestOtp,
      verifyOtp,
      completeRegistration,
      setUser,
      logout,
      clearError,
    }),
    // realtimeVersion forza il refresh del riferimento quando cambia il client WS
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, identity, loading, error, pendingPhone, requestOtp, verifyOtp, completeRegistration, setUser, logout, clearError, realtimeVersion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
}
