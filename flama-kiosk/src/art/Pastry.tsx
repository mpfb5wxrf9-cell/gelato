import { useId } from "react";

interface PastryProps {
  className?: string;
}

export default function Pastry({ className }: PastryProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cy = 130;

  const leftTip = { x: cx - 58, y: cy + 20 };
  const rightTip = { x: cx + 58, y: cy + 4 };

  const crescentD = `M ${leftTip.x} ${leftTip.y}
    Q ${cx - 50} ${cy - 44} ${cx - 20} ${cy - 40}
    Q ${cx - 6} ${cy - 60} ${cx + 12} ${cy - 42}
    Q ${cx + 30} ${cy - 56} ${cx + 46} ${cy - 30}
    Q ${cx + 56} ${cy - 18} ${rightTip.x} ${rightTip.y}
    Q ${cx + 20} ${cy + 30} ${cx - 14} ${cy + 22}
    Q ${cx - 38} ${cy + 32} ${leftTip.x} ${leftTip.y} Z`;

  const ridges = [
    `M ${cx - 42} ${cy - 4} Q ${cx - 34} ${cy - 30} ${cx - 16} ${cy - 38}`,
    `M ${cx - 16} ${cy + 4} Q ${cx - 4} ${cy - 26} ${cx + 12} ${cy - 38}`,
    `M ${cx + 10} ${cy + 2} Q ${cx + 24} ${cy - 20} ${cx + 40} ${cy - 26}`,
  ];

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione del cornetto alla crema">
      <defs>
        <linearGradient id={`crust-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2C476" />
          <stop offset="100%" stopColor="#C87F2C" />
        </linearGradient>
        <linearGradient id={`cream-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEF" />
          <stop offset="100%" stopColor="#FCE7B8" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={182} rx={62} ry={8} fill="#2A1608" opacity={0.14} />

        <path d={crescentD} fill={`url(#crust-${uid})`} stroke="#9C641F" strokeWidth={1.4} />

        {ridges.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#9C641F" strokeWidth={1.6} opacity={0.4} strokeLinecap="round" />
        ))}
        {ridges.map((d, i) => (
          <path
            key={`hl${i}`}
            d={d}
            fill="none"
            stroke="#FBE0A8"
            strokeWidth={1.2}
            opacity={0.55}
            strokeLinecap="round"
            transform="translate(-1.5,-1.5)"
          />
        ))}

        <path
          d={`M ${cx - 16} ${cy - 34} Q ${cx} ${cy - 16} ${cx + 14} ${cy - 32}
              Q ${cx + 4} ${cy - 20} ${cx - 2} ${cy - 18} Q ${cx - 8} ${cy - 20} ${cx - 16} ${cy - 34} Z`}
          fill={`url(#cream-${uid})`}
          stroke="#EAD4A0"
          strokeWidth={0.8}
        />
      </g>
    </svg>
  );
}
