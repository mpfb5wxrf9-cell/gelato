import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LockIcon } from '../components/Icons';

export function AuthPage() {
  const { login, register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'login') await login(username, password);
      else await register(username, password, displayName || username);
      navigate('/chats', { replace: true });
    } catch {
      // errore già gestito nel context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 28,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, animation: 'pop-in 0.5s' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(94,92,255,0.35)',
          }}
        >
          <LockIcon width={34} height={34} stroke="#fff" strokeWidth={2.2} />
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Aria</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14.5, textAlign: 'center', maxWidth: 280 }}>
          Messaggi cifrati end-to-end. Solo tu e il tuo contatto potete leggerli.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="glass"
        style={{ borderRadius: 'var(--radius-lg)', padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-secondary)', borderRadius: 12, padding: 4 }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                clearError();
              }}
              className="press"
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 9,
                fontWeight: 600,
                fontSize: 13.5,
                background: mode === m ? 'var(--bg-elevated)' : 'transparent',
                boxShadow: mode === m ? 'var(--shadow-soft)' : 'none',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {m === 'login' ? 'Accedi' : 'Registrati'}
            </button>
          ))}
        </div>

        <Field label="Nome utente">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="es. giulia_r"
            autoCapitalize="none"
            autoCorrect="off"
            required
          />
        </Field>

        {mode === 'register' && (
          <Field label="Nome visualizzato">
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Giulia Rossi" />
          </Field>
        )}

        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
        </Field>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 500, padding: '2px 2px' }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="press"
          style={{
            marginTop: 6,
            background: 'var(--accent-gradient)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15.5,
            padding: '13px 0',
            borderRadius: 16,
            opacity: submitting ? 0.7 : 1,
            boxShadow: '0 10px 24px rgba(94,92,255,0.32)',
          }}
        >
          {submitting ? 'Attendere…' : mode === 'login' ? 'Accedi' : 'Crea account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
        Le chiavi di cifratura restano solo sul tuo dispositivo: nemmeno il server può leggere i tuoi messaggi.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: 4 }}>{label}</span>
      <div
        className="field-box"
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: 14,
          padding: '12px 14px',
        }}
      >
        {children}
      </div>
    </label>
  );
}
