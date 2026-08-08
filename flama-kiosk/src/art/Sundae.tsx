import { useId } from "react";

interface SundaeProps {
  className?: string;
}

export default function Sundae({ className }: SundaeProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cupTopY = 130;
  const cupBottomY = 182;
  const topHalf = 32;
  const bottomHalf = 20;

  const cupPath = `M ${cx - topHalf} ${cupTopY}
    L ${cx - bottomHalf} ${cupBottomY - 8}
    Q ${cx - bottomHalf} ${cupBottomY} ${cx - bottomHalf + 6} ${cupBottomY}
    L ${cx + bottomHalf - 6} ${cupBottomY}
    Q ${cx + bottomHalf} ${cupBottomY} ${cx + bottomHalf} ${cupBottomY - 8}
    L ${cx + topHalf} ${cupTopY} Z`;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione della coppa gelato">
      <defs>
        <linearGradient id={`cup-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D5E3EA" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id={`caramel-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C4842E" />
          <stop offset="100%" stopColor="#96601D" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={188} rx={40} ry={6} fill="#2A1608" opacity={0.14} />
        <path d={cupPath} fill={`url(#cup-${uid})`} stroke="#9FB4BE" strokeWidth={1.4} />

        <path d={`M ${cx - 34} 128 Q ${cx} 106 ${cx + 34} 128 Q ${cx + 22} 138 ${cx} 134 Q ${cx - 22} 138 ${cx - 34} 128 Z`} fill="#FFFDF6" stroke="#E9E0CC" strokeWidth={1} />
        <path d={`M ${cx - 22} 108 Q ${cx} 90 ${cx + 22} 108 Q ${cx + 14} 116 ${cx} 113 Q ${cx - 14} 116 ${cx - 22} 108 Z`} fill="#FFFEFB" stroke="#EDE4D0" strokeWidth={0.8} />
        <path d={`M ${cx - 12} 92 Q ${cx} 78 ${cx + 12} 92 Q ${cx + 7} 98 ${cx} 96 Q ${cx - 7} 98 ${cx - 12} 92 Z`} fill="#FFFFFC" stroke="#EDE4D0" strokeWidth={0.6} />

        <path
          d={`M ${cx - 30} 122 Q ${cx - 12} 100 ${cx + 4} 118 Q ${cx + 16} 132 ${cx + 30} 112`}
          fill="none"
          stroke={`url(#caramel-${uid})`}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <path d={`M ${cx + 26} 116 Q ${cx + 30} 126 ${cx + 24} 136`} fill="none" stroke={`url(#caramel-${uid})`} strokeWidth={2.6} strokeLinecap="round" opacity={0.85} />
      </g>
    </svg>
  );
}
