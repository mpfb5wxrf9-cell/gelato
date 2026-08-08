import { useId } from "react";

interface CheeseBitesProps {
  className?: string;
}

const BITES = [
  { x: -30, y: -8, r: -6 },
  { x: -4, y: -16, r: 4 },
  { x: 22, y: -6, r: -8 },
  { x: 4, y: 10, r: 10 },
];

export default function CheeseBites({ className }: CheeseBitesProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cy = 118;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione dei bocconcini di formaggio">
      <defs>
        <linearGradient id={`bite-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7D687" />
          <stop offset="100%" stopColor="#E3A93E" />
        </linearGradient>
        <linearGradient id={`box-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#EDE6D4" />
        </linearGradient>
        <linearGradient id={`cheese-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="100%" stopColor="#FADD86" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={188} rx={52} ry={7} fill="#2A1608" opacity={0.16} />

        <path
          d={`M ${cx - 48} 134 L ${cx - 40} 190 L ${cx + 40} 190 L ${cx + 48} 134 Z`}
          fill={`url(#box-${uid})`}
          stroke="#D8CBAA"
          strokeWidth={1.4}
        />

        {/* cheese pull strand, drawn before the bites so it reads as coming from between them */}
        <path
          d={`M ${cx - 8} ${cy + 4} Q ${cx + 6} ${cy + 26} ${cx + 16} ${cy + 40}`}
          fill="none"
          stroke={`url(#cheese-${uid})`}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.92}
        />
        <ellipse cx={cx + 17} cy={cy + 44} rx={5} ry={3} fill="#FADD86" opacity={0.9} />

        {BITES.map((b, i) => (
          <g key={i} transform={`translate(${cx + b.x} ${cy + b.y}) rotate(${b.r})`}>
            <rect x={-16} y={-13} width={32} height={26} rx={7} fill={`url(#bite-${uid})`} stroke="#B87D28" strokeWidth={1.3} />
            {[[-7, -3], [5, 2], [-2, 6]].map(([sx, sy], j) => (
              <circle key={j} cx={sx} cy={sy} r={1.1} fill="#B87D28" opacity={0.5} />
            ))}
          </g>
        ))}

        <circle cx={cx + 38} cy={172} r={13} fill="#FFFDF7" stroke="#D8CBAA" strokeWidth={1.2} />
        <circle cx={cx + 38} cy={172} r={8} fill="#E3A93E" />
      </g>
    </svg>
  );
}
