import { useId } from "react";

interface DrinkProps {
  liquidColor?: string;
  lidColor?: string;
  className?: string;
}

export default function Drink({ liquidColor = "#C1272D", lidColor = "#C1272D", className }: DrinkProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cupTopY = 88;
  const cupBottomY = 180;
  const topHalf = 34;
  const bottomHalf = 24;

  const cupPath = `M ${cx - topHalf} ${cupTopY}
    L ${cx - bottomHalf} ${cupBottomY - 10}
    Q ${cx - bottomHalf} ${cupBottomY} ${cx - bottomHalf + 8} ${cupBottomY}
    L ${cx + bottomHalf - 8} ${cupBottomY}
    Q ${cx + bottomHalf} ${cupBottomY} ${cx + bottomHalf} ${cupBottomY - 10}
    L ${cx + topHalf} ${cupTopY} Z`;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione della bibita">
      <defs>
        <linearGradient id={`cup-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFEFB" />
          <stop offset="100%" stopColor="#EDE7D8" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={188} rx={38} ry={6} fill="#2A1608" opacity={0.16} />

        <path d={cupPath} fill={`url(#cup-${uid})`} stroke="#C9BC9C" strokeWidth={1.4} />
        <rect x={cx - topHalf + 4} y={cupTopY + 30} width={(topHalf - 4) * 2} height={20} fill="#C1502E" opacity={0.92} />

        {[0.3, 0.55, 0.8].map((t, i) => {
          const y = cupTopY + (cupBottomY - cupTopY) * t;
          const half = topHalf - (topHalf - bottomHalf) * t;
          return (
            <path
              key={i}
              d={`M ${cx - half + 3} ${y} Q ${cx} ${y + 4} ${cx + half - 3} ${y}`}
              fill="none"
              stroke="#C9BC9C"
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}

        <ellipse cx={cx} cy={cupTopY} rx={topHalf + 4} ry={9} fill={lidColor} stroke="#00000022" strokeWidth={1} />
        <ellipse cx={cx} cy={cupTopY - 2} rx={topHalf - 4} ry={6} fill={liquidColor} opacity={0.9} />
        <rect x={cx - 5} y={44} width={10} height={40} rx={3} fill="#FFFFFF" stroke="#D8D2C4" strokeWidth={1} transform={`rotate(-8 ${cx} 64)`} />
      </g>
    </svg>
  );
}
