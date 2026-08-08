import { useId } from "react";

interface WrapProps {
  className?: string;
}

export default function Wrap({ className }: WrapProps) {
  const uid = useId().replace(/[:]/g, "");
  const cy = 122;
  const left = 34;
  const right = 148;
  const r = 32;
  const capX = right - 6;
  const capRy = r - 1;
  const capRx = 24;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione del wrap">
      <defs>
        <linearGradient id={`wrap-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3D48C" />
          <stop offset="100%" stopColor="#DCAE55" />
        </linearGradient>
        <clipPath id={`cap-${uid}`}>
          <ellipse cx={capX} cy={cy} rx={capRx} ry={capRy} />
        </clipPath>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={100} cy={172} rx={62} ry={8} fill="#2A1608" opacity={0.16} />

        <rect x={left} y={cy - r} width={right - left} height={r * 2} rx={r} fill={`url(#wrap-${uid})`} stroke="#B4813A" strokeWidth={1.4} />
        <path d={`M ${left + 14} ${cy - r + 4} Q ${left + 28} ${cy} ${left + 14} ${cy + r - 4}`} fill="none" stroke="#B4813A" strokeWidth={1.4} opacity={0.5} />
        <path d={`M ${left + 34} ${cy - r + 6} Q ${left + 48} ${cy} ${left + 34} ${cy + r - 6}`} fill="none" stroke="#B4813A" strokeWidth={1.4} opacity={0.4} />

        <g clipPath={`url(#cap-${uid})`}>
          <rect x={capX - capRx} y={cy - capRy} width={capRx * 2} height={capRy * 2} fill="#FFF6E2" />
          <rect x={capX - capRx} y={cy + capRy * 0.32} width={capRx * 2} height={capRy} fill="#6DA83E" />
          <path
            d={`M ${capX - capRx} ${cy + capRy * 0.32} q ${capRx * 0.5} 6 ${capRx} 0 t ${capRx} 0`}
            fill="none"
            stroke="#548A2C"
            strokeWidth={1.4}
            opacity={0.6}
          />
          {[[-11, -6], [3, -12], [12, -1], [-3, 4]].map(([dx, dy], i) => (
            <ellipse key={i} cx={capX + dx} cy={cy + dy} rx={7} ry={4.4} fill="#E3B45C" stroke="#B98A3E" strokeWidth={0.8} />
          ))}
          <path
            d={`M ${capX - capRx} ${cy - capRy * 0.42} Q ${capX} ${cy - capRy * 0.68} ${capX + capRx} ${cy - capRy * 0.38}`}
            fill="none"
            stroke="#FFFDF7"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.95}
          />
        </g>
        <ellipse cx={capX} cy={cy} rx={capRx} ry={capRy} fill="none" stroke="#B4813A" strokeWidth={1.6} />

        <path d={`M ${left - 2} ${cy} Q ${left - 10} ${cy - 10} ${left - 4} ${cy - 20}`} fill="none" stroke="#B4813A" strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  );
}
