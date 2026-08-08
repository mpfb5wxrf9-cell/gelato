import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES, formatAsYouType, guessDefaultCountry, isValidNational, toE164 } from '../lib/phone';
import type { Country } from '../lib/phone';
import { CountryPicker } from '../components/CountryPicker';
import { LockIcon } from '../components/Icons';

export function PhoneEntryPage() {
  const { requestOtp, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [country, setCountry] = useState<Country>(
    () => COUNTRIES.find((c) => c.code === guessDefaultCountry()) || COUNTRIES[0]
  );
  const [national, setNational] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = national.trim().length > 0 && isValidNational(national, country.code);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const e164 = toE164(national, country.code);
    if (!e164) return;
    setSubmitting(true);
    try {
      const { devCode } = await requestOtp(e164);
      navigate('/verify-otp', { state: { devCode } });
    } catch {
      // errore già in context
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
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14.5, textAlign: 'center', maxWidth: 300 }}>
          Inserisci il tuo numero di telefono per accedere o creare un account.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="glass"
        style={{ borderRadius: 'var(--radius-lg)', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', paddingLeft: 4 }}>
            Numero di telefono
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="press field-box"
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 14,
                padding: '12px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 19 }}>{country.flag}</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>+{country.callingCode}</span>
            </button>
            <div className="field-box" style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 14, padding: '12px 14px' }}>
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                value={national}
                onChange={(e) => {
                  clearError();
                  setNational(formatAsYouType(e.target.value, country.code));
                }}
                placeholder="333 123 4567"
              />
            </div>
          </div>
        </label>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 500, padding: '2px 2px' }}>{error}</div>}

        <button
          type="submit"
          disabled={!valid || submitting}
          className="press"
          style={{
            marginTop: 4,
            background: valid ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
            color: valid ? '#fff' : 'var(--text-tertiary)',
            fontWeight: 700,
            fontSize: 15.5,
            padding: '13px 0',
            borderRadius: 16,
            opacity: submitting ? 0.7 : 1,
            boxShadow: valid ? '0 10px 24px rgba(94,92,255,0.32)' : 'none',
          }}
        >
          {submitting ? 'Invio in corso…' : 'Continua'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
        Ti invieremo un codice via SMS per verificare il numero. Le chiavi di cifratura restano solo sul tuo
        dispositivo.
      </p>

      {pickerOpen && <CountryPicker value={country} onChange={setCountry} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}
