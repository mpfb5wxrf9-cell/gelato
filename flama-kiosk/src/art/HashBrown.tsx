import { useId } from "react";
import { crinkleStrip } from "./shapes";

interface HashBrownProps {
  className?: string;
}

export default function HashBrown({ className }: HashBrownProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cy = 128;
  const halfW = 54;
  const halfH = 26;

  const bodyD = crinkleStrip(cx - halfW, cx + halfW, cy - halfH, cy + halfH, 7, 5);

  const streaks = [
    [-34, -8, -14, 4],
    [-14, -14, 4, -2],
    [8, -6, 26, 6],
    [-28, 6, -10, 14],
    [16, -12, 32, -2],
  ];

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione della crocchetta di patate">
      <defs>
        <linearGradient id={`hb-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0BE68" />
          <stop offset="100%" stopColor="#CE8F34" />
        </linearGradient>
        <linearGradient id={`liner-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#EDE6D4" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={182} rx={62} ry={8} fill="#2A1608" opacity={0.16} />
        <path
          d={`M ${cx - 58} 168 L ${cx - 50} 186 L ${cx + 50} 186 L ${cx + 58} 168 Z`}
          fill={`url(#liner-${uid})`}
          stroke="#D8CBAA"
          strokeWidth={1.2}
        />

        <path d={bodyD} fill={`url(#hb-${uid})`} stroke="#9C641F" strokeWidth={1.4} />
        {streaks.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={cx + x1}
            y1={cy + y1}
            x2={cx + x2}
            y2={cy + y2}
            stroke="#9C641F"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.4}
          />
        ))}
      </g>
    </svg>
  );
}
