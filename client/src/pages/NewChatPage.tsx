import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { PublicUser } from '../lib/types';
import { Avatar } from '../components/Avatar';
import { BackIcon, SearchIcon } from '../components/Icons';

export function NewChatPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

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

  const start = async (username: string) => {
    setStarting(username);
    try {
      const { conversation } = await api.createConversation(username);
      navigate(`/chats/${conversation.id}`, { replace: true });
    } finally {
      setStarting(null);
    }
  };

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
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
            placeholder="Cerca per nome utente"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {searching && <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24 }}>Ricerca…</div>}

        {!searching && query.trim() && results.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24, fontSize: 14 }}>
            Nessun utente trovato per &ldquo;{query}&rdquo;
          </div>
        )}

        {results.length > 0 && (
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '4px 12px' }}>
          {results.map((u, i) => (
            <button
              key={u.id}
              onClick={() => start(u.username)}
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
                opacity: starting && starting !== u.username ? 0.5 : 1,
              }}
            >
              <Avatar name={u.displayName} color={u.avatarColor} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{u.displayName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>@{u.username}</div>
              </div>
              {starting === u.username && <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>…</span>}
            </button>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
