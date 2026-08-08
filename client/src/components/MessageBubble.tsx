import type { DecryptedMessage } from '../lib/types';
import { CheckIcon, DoubleCheckIcon } from './Icons';

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, mine }: { message: DecryptedMessage; mine: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start',
        animation: 'rise-in 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        padding: '2px 4px',
      }}
    >
      <div
        style={{
          maxWidth: '76%',
          padding: '10px 14px',
          borderRadius: 20,
          borderBottomRightRadius: mine ? 6 : 20,
          borderBottomLeftRadius: mine ? 20 : 6,
          background: mine ? 'var(--bubble-out-bg)' : 'var(--bubble-in-bg)',
          color: mine ? 'var(--bubble-out-text)' : 'var(--bubble-in-text)',
          opacity: message.pending ? 0.6 : 1,
          boxShadow: mine ? '0 6px 18px rgba(94,92,255,0.3)' : 'none',
        }}
      >
        <div style={{ fontSize: 15.5, lineHeight: 1.35, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          {message.failed ? '⚠️ Impossibile decifrare il messaggio' : message.text}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 4,
            marginTop: 3,
            fontSize: 10.5,
            opacity: 0.75,
          }}
        >
          {formatTime(message.createdAt)}
          {mine && !message.pending && (message.read ? <DoubleCheckIcon width={13} height={13} /> : message.delivered ? <DoubleCheckIcon width={13} height={13} strokeWidth={1.6} /> : <CheckIcon width={12} height={12} />)}
        </div>
      </div>
    </div>
  );
}
