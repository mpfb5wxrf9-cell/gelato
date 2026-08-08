import { useId } from "react";

interface NuggetsProps {
  className?: string;
}

const NUGGET_SHAPES = [
  "M -18 -10 Q -20 -18 -8 -20 Q 6 -22 16 -14 Q 22 -6 14 2 Q 4 12 -10 8 Q -20 4 -18 -10 Z",
  "M -16 -12 Q -14 -20 0 -19 Q 14 -18 16 -8 Q 18 2 6 8 Q -8 14 -16 4 Q -20 -4 -16 -12 Z",
  "M -14 -14 Q -6 -20 6 -16 Q 18 -12 16 0 Q 14 12 0 13 Q -14 14 -17 2 Q -19 -8 -14 -14 Z",
];

const LAYOUT = [
  { x: -34, y: -6, r: 0, s: 1, shape: 0 },
  { x: -6, y: -16, r: 12, s: 1.05, shape: 1 },
  { x: 24, y: -8, r: -8, s: 0.95, shape: 2 },
  { x: -18, y: 14, r: -14, s: 1, shape: 2 },
  { x: 14, y: 18, r: 10, s: 0.98, shape: 0 },
];

export default function Nuggets({ className }: NuggetsProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cy = 116;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione dei bocconcini di pollo">
      <defs>
        <radialGradient id={`nug-${uid}`} cx="35%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#F7DA8C" />
          <stop offset="60%" stopColor="#E8B953" />
          <stop offset="100%" stopColor="#C98F30" />
        </radialGradient>
        <linearGradient id={`box-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#EDE6D4" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={188} rx={54} ry={7} fill="#2A1608" opacity={0.16} />

        <path
          d={`M ${cx - 50} 132 L ${cx - 42} 190 L ${cx + 42} 190 L ${cx + 50} 132 Z`}
          fill={`url(#box-${uid})`}
          stroke="#D8CBAA"
          strokeWidth={1.4}
        />

        {LAYOUT.map((n, i) => (
          <g key={i} transform={`translate(${cx + n.x} ${cy + n.y}) rotate(${n.r}) scale(${n.s})`}>
            <path d={NUGGET_SHAPES[n.shape]} fill={`url(#nug-${uid})`} stroke="#B87D28" strokeWidth={1.3} />
            {[[-6, -2], [4, 4], [-2, 6]].map(([sx, sy], j) => (
              <circle key={j} cx={sx} cy={sy} r={1.1} fill="#B87D28" opacity={0.5} />
            ))}
          </g>
        ))}

        <circle cx={cx + 40} cy={172} r={14} fill="#FFFDF7" stroke="#D8CBAA" strokeWidth={1.2} />
        <circle cx={cx + 40} cy={172} r={9} fill="#C1502E" />
      </g>
    </svg>
  );
}
