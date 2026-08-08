import { useId } from "react";

interface PieProps {
  className?: string;
}

export default function Pie({ className }: PieProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 100;
  const cy = 135;
  const halfW = 52;
  const halfH = 34;
  const left = cx - halfW;
  const top = cy - halfH;
  const right = cx + halfW;
  const bottom = cy + halfH;

  const crimps: number[] = [];
  const step = (halfW * 2) / 9;
  for (let i = 0; i <= 9; i++) crimps.push(left + i * step);

  const vLines: number[] = [];
  for (let x = left + 13; x < right - 4; x += 13) vLines.push(x);
  const hLines: number[] = [];
  for (let y = top + 11; y < bottom - 4; y += 11) hLines.push(y);

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustrazione dell'apple pie">
      <defs>
        <linearGradient id={`pie-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0B85A" />
          <stop offset="100%" stopColor="#C87F2C" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect x={left} y={top} width={halfW * 2} height={halfH * 2} rx={10} />
        </clipPath>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={178} rx={58} ry={8} fill="#2A1608" opacity={0.16} />
        <rect x={left} y={top} width={halfW * 2} height={halfH * 2} rx={10} fill={`url(#pie-${uid})`} stroke="#9C641F" strokeWidth={1.4} />

        <g clipPath={`url(#clip-${uid})`}>
          {vLines.map((x, i) => (
            <g key={`v${i}`}>
              <line x1={x} y1={top} x2={x} y2={bottom} stroke="#9C641F" strokeWidth={1.2} opacity={0.5} />
              <line x1={x + 1.3} y1={top} x2={x + 1.3} y2={bottom} stroke="#FBE0A8" strokeWidth={0.8} opacity={0.5} />
            </g>
          ))}
          {hLines.map((y, i) => (
            <g key={`h${i}`}>
              <line x1={left} y1={y} x2={right} y2={y} stroke="#9C641F" strokeWidth={1.2} opacity={0.5} />
              <line x1={left} y1={y + 1.3} x2={right} y2={y + 1.3} stroke="#FBE0A8" strokeWidth={0.8} opacity={0.5} />
            </g>
          ))}
        </g>

        {crimps.map((x, i) => (
          <path key={`t${i}`} d={`M ${x} ${top} q ${step / 2} -6 ${step} 0`} fill="none" stroke="#9C641F" strokeWidth={1.6} opacity={0.6} />
        ))}
        {crimps.map((x, i) => (
          <path key={`b${i}`} d={`M ${x} ${bottom} q ${step / 2} 6 ${step} 0`} fill="none" stroke="#9C641F" strokeWidth={1.6} opacity={0.6} />
        ))}
      </g>
    </svg>
  );
}
