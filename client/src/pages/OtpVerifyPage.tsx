import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDisplay } from '../lib/phone';
import { BackIcon, LockIcon } from '../components/Icons';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export function OtpVerifyPage() {
  const { pendingPhone, verifyOtp, requestOtp, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [devCode, setDevCode] = useState<string | null>((location.state as { devCode?: string })?.devCode || null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!pendingPhone) navigate('/login', { replace: true });
  }, [pendingPhone, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const submit = async (code: string) => {
    if (!pendingPhone || code.length !== CODE_LENGTH || submitting) return;
    setSubmitting(true);
    try {
      const { isNewUser } = await verifyOtp(pendingPhone, code);
      navigate(isNewUser ? '/profile-setup' : '/chats', { replace: true });
    } catch {
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const onDigitChange = (index: number, raw: string) => {
    clearError();
    const value = raw.replace(/\D/g, '');
    if (!value) {
      setDigits((prev) => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }
    const chars = value.split('');
    const next = [...digits];
    chars.forEach((ch, offset) => {
      if (index + offset < CODE_LENGTH) next[index + offset] = ch;
    });
    setDigits(next);

    const nextIndex = Math.min(index + chars.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    const full = next.join('');
    if (full.length === CODE_LENGTH) submit(full);
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resend = async () => {
    if (!pendingPhone || cooldown > 0) return;
    try {
      const { devCode: newCode } = await requestOtp(pendingPhone);
      setDevCode(newCode);
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      // errore già in context
    }
  };

  if (!pendingPhone) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: 24 }}>
      <button
        onClick={() => navigate('/login')}
        className="press"
        style={{ alignSelf: 'flex-start', padding: 6, color: 'var(--text-secondary)' }}
      >
        <BackIcon />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'pop-in 0.5s' }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 26px rgba(94,92,255,0.3)',
          }}
        >
          <LockIcon width={28} height={28} stroke="#fff" strokeWidth={2.2} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, textAlign: 'center' }}>Verifica il tuo numero</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', maxWidth: 280 }}>
          Abbiamo inviato un codice a 6 cifre via SMS al numero
          <br />
          <strong style={{ color: 'var(--text-primary)' }}>{formatDisplay(pendingPhone)}</strong>
        </p>
      </div>

      {devCode && (
        <div
          className="glass"
          style={{
            borderRadius: 16,
            padding: '12px 16px',
            fontSize: 13,
            textAlign: 'center',
            color: 'var(--accent)',
            fontWeight: 600,
          }}
        >
          Modalità demo: nessun provider SMS configurato. Il tuo codice è{' '}
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15 }}>{devCode}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={d}
            onChange={(e) => onDigitChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={CODE_LENGTH}
            disabled={submitting}
            className="glass"
            style={{
              width: 44,
              height: 54,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 700,
              borderRadius: 14,
              color: 'var(--text-primary)',
              caretColor: 'var(--accent)',
            }}
          />
        ))}
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 500, textAlign: 'center' }}>{error}</div>
      )}

      <button
        onClick={resend}
        disabled={cooldown > 0}
        className="press"
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: cooldown > 0 ? 'var(--text-tertiary)' : 'var(--accent)',
          textAlign: 'center',
        }}
      >
        {cooldown > 0 ? `Invia di nuovo tra ${cooldown}s` : 'Invia di nuovo il codice'}
      </button>
    </div>
  );
}
