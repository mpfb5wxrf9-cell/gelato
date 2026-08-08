interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  online?: boolean;
}

export function Avatar({ name, color, size = 46, online }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '32%',
          background: `linear-gradient(150deg, ${color}, ${color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600,
          fontSize: size * 0.38,
          boxShadow: `0 4px 14px ${color}55`,
        }}
      >
        {initials}
      </div>
      {online && (
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: '50%',
            background: 'var(--success)',
            border: '2.5px solid var(--bg)',
            animation: 'pulse-ring 2s infinite',
          }}
        />
      )}
    </div>
  );
}
