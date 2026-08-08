import { useMemo, useState } from 'react';
import { COUNTRIES } from '../lib/phone';
import type { Country } from '../lib/phone';
import { BackIcon, SearchIcon } from './Icons';

interface Props {
  value: Country;
  onChange: (country: Country) => void;
  onClose: () => void;
}

export function CountryPicker({ value, onChange, onClose }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.callingCode.includes(q));
  }, [query]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 560,
        margin: '0 auto',
        animation: 'rise-in 0.25s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <header
        style={{
          padding: 'calc(14px + var(--safe-top)) 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button onClick={onClose} className="press" style={{ padding: 6 }} aria-label="Chiudi">
          <BackIcon />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Seleziona un paese</h2>
      </header>

      <div style={{ padding: '0 16px 12px' }}>
        <div className="glass field-box" style={{ borderRadius: 16, padding: '11px 14px', display: 'flex', gap: 8 }}>
          <SearchIcon width={17} height={17} color="var(--text-tertiary)" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca paese o prefisso"
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
        {filtered.map((c) => (
          <button
            key={c.code}
            onClick={() => {
              onChange(c);
              onClose();
            }}
            className="press"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '11px 12px',
              borderRadius: 14,
              background: c.code === value.code ? 'var(--bg-secondary)' : 'transparent',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 22 }}>{c.flag}</span>
            <span style={{ flex: 1, fontSize: 15 }}>{c.name}</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>+{c.callingCode}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
