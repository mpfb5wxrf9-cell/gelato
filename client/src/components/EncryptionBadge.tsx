import { LockIcon } from './Icons';

export function EncryptionBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="glass"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: compact ? '5px 12px' : '7px 16px',
        borderRadius: 999,
        fontSize: compact ? 11 : 12.5,
        fontWeight: 600,
        color: 'var(--success)',
        background: 'rgba(52, 199, 89, 0.12)',
        border: '1px solid rgba(52, 199, 89, 0.25)',
        boxShadow: 'none',
      }}
    >
      <LockIcon width={compact ? 12 : 14} height={compact ? 12 : 14} strokeWidth={2.4} />
      {compact ? 'Cifrato' : 'Crittografia end-to-end attiva'}
    </div>
  );
}
