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
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, displayName: string) => Promise<void>;
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
  const [user, setUser] = useState<PublicUser | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setUser(synced.user);
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

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      try {
        const { token, user: loggedInUser } = await api.login(username, password);
        setToken(token);
        const synced = await syncIdentity(loggedInUser);
        setUser(synced.user);
        setIdentity(synced.identity);
        bootRealtime(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Accesso non riuscito.');
        throw err;
      }
    },
    [bootRealtime]
  );

  const register = useCallback(
    async (username: string, password: string, displayName: string) => {
      setError(null);
      try {
        // La coppia di chiavi viene generata localmente PRIMA di contattare il
        // server: la chiave privata non viene mai trasmessa.
        const tempId = `pending:${username}`;
        const identityDraft = await getOrCreateIdentity(tempId);
        const { token, user: newUser } = await api.register(
          username,
          password,
          displayName,
          identityDraft.publicJwk
        );
        setToken(token);
        // Ri-ancoriamo l'identità al vero userId assegnato dal server.
        const realIdentity = await getOrCreateIdentity(newUser.id);
        if (JSON.stringify(realIdentity.publicJwk) !== JSON.stringify(identityDraft.publicJwk)) {
          // caso raro: id già esistente localmente, riallineiamo il server
          await api.updatePublicKey(realIdentity.publicJwk);
        }
        setUser(newUser);
        setIdentity(realIdentity);
        bootRealtime(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registrazione non riuscita.');
        throw err;
      }
    },
    [bootRealtime]
  );

  const logout = useCallback(() => {
    setToken(null);
    realtimeRef.current?.close();
    realtimeRef.current = null;
    setUser(null);
    setIdentity(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      identity,
      realtime: realtimeRef.current,
      loading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    // realtimeVersion forza il refresh del riferimento quando cambia il client WS
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, identity, loading, error, login, register, logout, clearError, realtimeVersion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
}
