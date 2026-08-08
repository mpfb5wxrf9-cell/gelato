import { useId } from "react";

interface FriesProps {
  className?: string;
}

const STICKS = [
  { x: -34, h: 62, rot: -10 },
  { x: -22, h: 78, rot: -4 },
  { x: -10, h: 60, rot: 4 },
  { x: 2, h: 82, rot: -2 },
  { x: 14, h: 66, rot: 6 },
  { x: 26, h: 76, rot: -6 },
  { x: 36, h: 58, rot: 10 },
  { x: -4, h: 88, rot: 0 },
];

export default function Fries({ className }: FriesProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const rimY = 128;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione delle patatine">
      <defs>
        <linearGradient id={`fry-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7D671" />
          <stop offset="100%" stopColor="#E3A937" />
        </linearGradient>
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

        {STICKS.map((s, i) => (
          <g key={i} transform={`translate(${cx + s.x} ${rimY}) rotate(${s.rot})`}>
            <rect x={-6} y={-s.h} width={12} height={s.h} rx={2.5} fill={`url(#fry-${uid})`} stroke="#C4841F" strokeWidth={1} />
            <rect x={-6} y={-s.h} width={12} height={s.h * 0.3} rx={2.5} fill="#C4841F" opacity={0.25} />
          </g>
        ))}

        <path
          d={`M ${cx - 46} ${rimY} L ${cx - 38} 190 L ${cx + 38} 190 L ${cx + 46} ${rimY} Z`}
          fill={`url(#box-${uid})`}
          stroke="#D8CBAA"
          strokeWidth={1.4}
        />
        <rect x={cx - 46} y={rimY - 4} width={92} height={10} rx={2} fill="#C1502E" />
        <path d={`M ${cx - 46} ${rimY - 4} L ${cx - 38} 190`} stroke="#C9BC9C" strokeWidth={1} opacity={0.6} />
        <path d={`M ${cx + 46} ${rimY - 4} L ${cx + 38} 190`} stroke="#C9BC9C" strokeWidth={1} opacity={0.6} />
      </g>
    </svg>
  );
}
