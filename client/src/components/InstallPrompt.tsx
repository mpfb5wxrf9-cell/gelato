import { useEffect, useState } from 'react';
import { InstallIcon } from './Icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'aria.install-dismissed';

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

    if (isIos()) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <div
      className="glass"
      style={{
        position: 'fixed',
        left: 14,
        right: 14,
        bottom: 'calc(14px + var(--safe-bottom))',
        maxWidth: 530,
        margin: '0 auto',
        borderRadius: 22,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 50,
        animation: 'rise-in 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <InstallIcon width={20} height={20} />
      </div>
      <div style={{ flex: 1, fontSize: 13, lineHeight: 1.3 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>Installa Aria</div>
        {iosHint ? (
          <span style={{ color: 'var(--text-secondary)' }}>
            Tocca <strong>Condividi</strong> nella barra di Safari, poi <strong>“Aggiungi a Home”</strong>.
          </span>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>Aggiungila alla home per usarla come un&apos;app.</span>
        )}
      </div>
      {!iosHint && (
        <button
          onClick={install}
          className="press"
          style={{
            background: 'var(--accent-gradient)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            padding: '9px 16px',
            borderRadius: 14,
            flexShrink: 0,
          }}
        >
          Installa
        </button>
      )}
      <button
        onClick={dismiss}
        className="press"
        style={{ color: 'var(--text-tertiary)', fontSize: 20, padding: 4, flexShrink: 0 }}
        aria-label="Chiudi"
      >
        ×
      </button>
    </div>
  );
}
