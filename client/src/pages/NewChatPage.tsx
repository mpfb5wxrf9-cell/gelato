import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { PublicUser } from '../lib/types';
import { isContactPickerSupported, pickContacts } from '../lib/contacts';
import { Avatar } from '../components/Avatar';
import { BackIcon, ContactsIcon, SearchIcon } from '../components/Icons';

export function NewChatPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  const [matched, setMatched] = useState<PublicUser[] | null>(null);
  const [unmatchedCount, setUnmatchedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const contactPickerAvailable = isContactPickerSupported();

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const { users } = await api.searchUsers(query.trim());
        setResults(users);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const start = async (phone: string) => {
    setStarting(phone);
    try {
      const { conversation } = await api.createConversation(phone);
      navigate(`/chats/${conversation.id}`, { replace: true });
    } finally {
      setStarting(null);
    }
  };

  const importContacts = async () => {
    setSyncError(null);
    setSyncing(true);
    try {
      const contacts = await pickContacts();
      const phones = contacts.flatMap((c) => c.phones);
      if (phones.length === 0) {
        setMatched([]);
        setUnmatchedCount(0);
        return;
      }
      const { users } = await api.syncContacts(phones);
      setMatched(users);
      setUnmatchedCount(Math.max(0, new Set(phones).size - users.length));
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setSyncError('Impossibile leggere i contatti dal dispositivo.');
      }
    } finally {
      setSyncing(false);
    }
  };

  const list = query.trim() ? results : matched || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <header
        style={{
          padding: 'calc(14px + var(--safe-top)) 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button onClick={() => navigate(-1)} className="press" style={{ padding: 6 }}>
          <BackIcon />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Nuova conversazione</h1>
      </header>

      <div style={{ padding: '0 16px 12px' }}>
        <div
          className="glass field-box"
          style={{
            borderRadius: 16,
            padding: '11px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <SearchIcon width={17} height={17} color="var(--text-tertiary)" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome o numero"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      </div>

      {!query.trim() && (
        <div style={{ padding: '0 16px 12px' }}>
          {contactPickerAvailable ? (
            <button
              onClick={importContacts}
              disabled={syncing}
              className="press glass"
              style={{
                width: '100%',
                borderRadius: 16,
                padding: '13px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <ContactsIcon width={17} height={17} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 14.5 }}>
                {syncing ? 'Sincronizzazione in corso…' : 'Sincronizza rubrica del telefono'}
              </span>
            </button>
          ) : (
            <div
              className="glass"
              style={{ borderRadius: 16, padding: '13px 16px', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}
            >
              La sincronizzazione automatica della rubrica è disponibile solo su Chrome per Android. Su questo
              dispositivo cerca un contatto per nome o numero qui sopra.
            </div>
          )}
          {syncError && <div style={{ color: 'var(--danger)', fontSize: 12.5, marginTop: 8 }}>{syncError}</div>}
          {matched !== null && (
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '10px 4px 0' }}>
              {matched.length} {matched.length === 1 ? 'contatto usa' : 'contatti usano'} Aria
              {unmatchedCount > 0 ? ` · ${unmatchedCount} non ancora su Aria` : ''}
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {searching && <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24 }}>Ricerca…</div>}

        {!searching && query.trim() && results.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24, fontSize: 14 }}>
            Nessun utente trovato per &ldquo;{query}&rdquo;
          </div>
        )}

        {!query.trim() && matched?.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24, fontSize: 14 }}>
            Nessuno dei tuoi contatti usa ancora Aria.
          </div>
        )}

        {list.length > 0 && (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '4px 12px' }}>
            {list.map((u, i) => (
              <button
                key={u.id}
                onClick={() => start(u.phone)}
                disabled={starting !== null}
                className="press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  width: '100%',
                  padding: '11px 4px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--glass-border)',
                  textAlign: 'left',
                  opacity: starting && starting !== u.phone ? 0.5 : 1,
                }}
              >
                <Avatar name={u.nickname} color={u.avatarColor} imageUrl={u.avatarUrl} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{u.nickname}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.bio || u.phone}
                  </div>
                </div>
                {starting === u.phone && <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>…</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
