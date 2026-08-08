import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { fileToSquareJpegBase64 } from '../lib/image';
import { formatDisplay } from '../lib/phone';
import { Avatar } from '../components/Avatar';
import { TabBar } from '../components/TabBar';
import { ShieldIcon, LogoutIcon, LockIcon, CameraIcon } from '../components/Icons';
import { fingerprint } from '../lib/crypto';

export function SettingsPage() {
  const { user, identity, logout, setUser } = useAuth();
  const [fp, setFp] = useState('');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (identity) fingerprint(identity.publicJwk).then(setFp);
  }, [identity]);

  useEffect(() => {
    setNickname(user?.nickname || '');
    setBio(user?.bio || '');
  }, [user?.nickname, user?.bio]);

  if (!user) return null;

  const dirty = nickname.trim() !== user.nickname || bio.trim() !== user.bio;

  const save = async () => {
    if (!dirty || !nickname.trim()) return;
    setSaving(true);
    try {
      const { user: updated } = await api.updateProfile({ nickname: nickname.trim(), bio: bio.trim() });
      setUser(updated);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1600);
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    try {
      const base64 = await fileToSquareJpegBase64(file);
      const { user: updated } = await api.uploadAvatar(base64);
      setUser(updated);
    } finally {
      setAvatarBusy(false);
      e.target.value = '';
    }
  };

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
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="press"
            style={{ position: 'relative' }}
            aria-label="Cambia foto profilo"
          >
            <Avatar name={user.nickname} color={user.avatarColor} imageUrl={user.avatarUrl} size={88} />
            <span
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2.5px solid var(--bg)',
                opacity: avatarBusy ? 0.6 : 1,
              }}
            >
              <CameraIcon width={14} height={14} stroke="#fff" />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: 4 }}>Nome</span>
              <div className="field-box" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '10px 13px' }}>
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={30} style={{ textAlign: 'center', fontWeight: 600 }} />
              </div>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: 4 }}>Bio</span>
              <div className="field-box" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '10px 13px' }}>
                <input value={bio} onChange={(e) => setBio(e.target.value)} maxLength={140} placeholder="Disponibile su Aria" style={{ textAlign: 'center' }} />
              </div>
            </label>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>{formatDisplay(user.phone)}</div>

            {dirty && (
              <button
                onClick={save}
                disabled={saving || !nickname.trim()}
                className="press"
                style={{
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  padding: '10px 0',
                  borderRadius: 12,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Salvataggio…' : 'Salva modifiche'}
              </button>
            )}
            {savedFlash && (
              <div style={{ fontSize: 12.5, color: 'var(--success)', textAlign: 'center', fontWeight: 600 }}>
                Profilo aggiornato
              </div>
            )}
          </div>
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
