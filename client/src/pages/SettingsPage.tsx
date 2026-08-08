import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { TabBar } from '../components/TabBar';
import { ShieldIcon, LogoutIcon, LockIcon } from '../components/Icons';
import { fingerprint } from '../lib/crypto';

export function SettingsPage() {
  const { user, identity, logout } = useAuth();
  const [fp, setFp] = useState('');

  useEffect(() => {
    if (identity) fingerprint(identity.publicJwk).then(setFp);
  }, [identity]);

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <header style={{ padding: 'calc(16px + var(--safe-top)) 20px 10px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 750, margin: 0, letterSpacing: -0.6 }}>Impostazioni</h1>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          className="glass"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Avatar name={user.displayName} color={user.avatarColor} size={72} />
          <div style={{ fontSize: 19, fontWeight: 700 }}>{user.displayName}</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>@{user.username}</div>
        </div>

        <Section title="Sicurezza">
          <Row icon={<ShieldIcon width={17} height={17} />} label="Cifratura" value="ECDH P-256 + AES-256-GCM" />
          <div style={{ padding: '10px 4px 4px' }}>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
              Codice di sicurezza del tuo dispositivo
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                fontSize: 13,
                letterSpacing: 0.5,
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                padding: '10px 12px',
                color: 'var(--text-primary)',
              }}
            >
              {fp || '—'}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 6, lineHeight: 1.4 }}>
              Confrontalo con quello del tuo contatto (fuori app) per verificare che nessuno stia intercettando la
              conversazione.
            </div>
          </div>
        </Section>

        <Section title="Informazioni">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 4px 0' }}>
            <LockIcon width={12} height={12} style={{ verticalAlign: -1, marginRight: 4 }} />
            I messaggi sono cifrati end-to-end sul tuo dispositivo prima di essere inviati. Il server inoltra e
            conserva solo dati cifrati e non è mai in grado di leggerne il contenuto.
          </p>
        </Section>

        <button
          onClick={logout}
          className="press glass"
          style={{
            borderRadius: 18,
            padding: '14px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--danger)',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <LogoutIcon width={18} height={18} />
          Esci
        </button>
      </div>

      <TabBar />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.4, padding: '0 8px 6px' }}>
        {title}
      </div>
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '6px 14px' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', color: 'var(--accent)' }}>
      {icon}
      <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: 14.5, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  );
}
