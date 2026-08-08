import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { fileToSquareJpegBase64 } from '../lib/image';
import { Avatar } from '../components/Avatar';
import { CameraIcon } from '../components/Icons';

export function ProfileSetupPage() {
  const { pendingPhone, completeRegistration, setUser, error } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!pendingPhone) {
    navigate('/login', { replace: true });
    return null;
  }

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToSquareJpegBase64(file);
      setAvatarPreview(base64);
    } catch {
      setLocalError("Impossibile caricare l'immagine selezionata.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      await completeRegistration(nickname.trim(), bio.trim());
      if (avatarPreview) {
        try {
          const { user } = await api.uploadAvatar(avatarPreview);
          setUser(user);
        } catch {
          // il profilo è comunque creato: l'avatar si potrà impostare da Impostazioni
        }
      }
      navigate('/chats', { replace: true });
    } catch {
      // errore già gestito nel context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', gap: 24 }}>
      <div style={{ textAlign: 'center', animation: 'pop-in 0.5s' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>Crea il tuo profilo</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
          Nome e foto saranno visibili ai tuoi contatti su Aria.
        </p>
      </div>

      <form onSubmit={onSubmit} className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="press"
            style={{ position: 'relative' }}
            aria-label="Scegli foto profilo"
          >
            <Avatar name={nickname || '?'} color="#5E5CFF" size={92} imageUrl={avatarPreview} />
            <span
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2.5px solid var(--bg)',
              }}
            >
              <CameraIcon width={15} height={15} stroke="#fff" />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: 4 }}>Nome</span>
          <div className="field-box" style={{ background: 'var(--bg-secondary)', borderRadius: 14, padding: '12px 14px' }}>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Il tuo nome" maxLength={30} autoFocus required />
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: 4 }}>Bio (opzionale)</span>
          <div className="field-box" style={{ background: 'var(--bg-secondary)', borderRadius: 14, padding: '12px 14px' }}>
            <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Disponibile su Aria" maxLength={140} />
          </div>
        </label>

        {(localError || error) && (
          <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 500 }}>{localError || error}</div>
        )}

        <button
          type="submit"
          disabled={!nickname.trim() || submitting}
          className="press"
          style={{
            marginTop: 4,
            background: nickname.trim() ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
            color: nickname.trim() ? '#fff' : 'var(--text-tertiary)',
            fontWeight: 700,
            fontSize: 15.5,
            padding: '13px 0',
            borderRadius: 16,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Creazione…' : 'Inizia a usare Aria'}
        </button>
      </form>
    </div>
  );
}
