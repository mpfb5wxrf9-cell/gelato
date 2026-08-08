import { useId } from "react";

interface HotDrinkProps {
  className?: string;
}

export default function HotDrink({ className }: HotDrinkProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cupTopY = 92;
  const cupBottomY = 180;
  const topHalf = 32;
  const bottomHalf = 23;

  const cupPath = `M ${cx - topHalf} ${cupTopY}
    L ${cx - bottomHalf} ${cupBottomY - 10}
    Q ${cx - bottomHalf} ${cupBottomY} ${cx - bottomHalf + 8} ${cupBottomY}
    L ${cx + bottomHalf - 8} ${cupBottomY}
    Q ${cx + bottomHalf} ${cupBottomY} ${cx + bottomHalf} ${cupBottomY - 10}
    L ${cx + topHalf} ${cupTopY} Z`;

  const sleeveTop = 122;
  const sleeveBottom = 152;
  const sleeveTopHalf = topHalf - (topHalf - bottomHalf) * ((sleeveTop - cupTopY) / (cupBottomY - cupTopY));
  const sleeveBottomHalf = topHalf - (topHalf - bottomHalf) * ((sleeveBottom - cupTopY) / (cupBottomY - cupTopY));

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione del caffè caldo">
      <defs>
        <linearGradient id={`cup-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFEFB" />
          <stop offset="100%" stopColor="#EDE7D8" />
        </linearGradient>
        <linearGradient id={`sleeve-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C89A5E" />
          <stop offset="100%" stopColor="#A97A40" />
        </linearGradient>
        <radialGradient id={`lid-${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#4A3A30" />
          <stop offset="100%" stopColor="#2E231C" />
        </radialGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={188} rx={38} ry={6} fill="#2A1608" opacity={0.16} />

        <path d={cupPath} fill={`url(#cup-${uid})`} stroke="#C9BC9C" strokeWidth={1.4} />

        <path
          d={`M ${cx - sleeveTopHalf} ${sleeveTop} L ${cx - sleeveBottomHalf} ${sleeveBottom} L ${cx + sleeveBottomHalf} ${sleeveBottom} L ${cx + sleeveTopHalf} ${sleeveTop} Z`}
          fill={`url(#sleeve-${uid})`}
        />
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line
            key={i}
            x1={cx - sleeveTopHalf + sleeveTopHalf * 2 * t}
            y1={sleeveTop}
            x2={cx - sleeveBottomHalf + sleeveBottomHalf * 2 * t}
            y2={sleeveBottom}
            stroke="#8C6530"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}

        <ellipse cx={cx} cy={cupTopY} rx={topHalf + 3} ry={8} fill={`url(#lid-${uid})`} />
        <rect x={cx - 10} y={cupTopY - 3} width={20} height={5} rx={2.5} fill="#1B1410" opacity={0.85} />

        <path d={`M ${cx - 10} 78 Q ${cx - 18} 66 ${cx - 8} 56`} fill="none" stroke="#D9CDBB" strokeWidth={2.6} strokeLinecap="round" opacity={0.65} />
        <path d={`M ${cx + 6} 74 Q ${cx - 2} 60 ${cx + 8} 48`} fill="none" stroke="#D9CDBB" strokeWidth={2.6} strokeLinecap="round" opacity={0.55} />
      </g>
    </svg>
  );
}
