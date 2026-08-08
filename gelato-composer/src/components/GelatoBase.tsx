interface GelatoBaseProps {
  baseId: string;
  rimY: number;
}

const RIM_HALF_WIDTH = 74;
const CENTER_X = 200;

export default function GelatoBase({ baseId, rimY }: GelatoBaseProps) {
  if (baseId === "coppetta") {
    const topY = rimY;
    const bottomY = topY + 118;
    const topHalf = 96;
    const bottomHalf = 66;
    const cupPath = `M ${CENTER_X - topHalf} ${topY}
      L ${CENTER_X - bottomHalf} ${bottomY - 14}
      Q ${CENTER_X - bottomHalf} ${bottomY} ${CENTER_X - bottomHalf + 14} ${bottomY}
      L ${CENTER_X + bottomHalf - 14} ${bottomY}
      Q ${CENTER_X + bottomHalf} ${bottomY} ${CENTER_X + bottomHalf} ${bottomY - 14}
      L ${CENTER_X + topHalf} ${topY} Z`;

    return (
      <g>
        <defs>
          <linearGradient id="cup-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAD2AA" />
            <stop offset="100%" stopColor="#C89968" />
          </linearGradient>
        </defs>
        <path d={cupPath} fill="url(#cup-grad)" stroke="#A9784A" strokeWidth={2} />
        {[0.28, 0.52, 0.76].map((t, i) => {
          const y = topY + (bottomY - topY) * t;
          const half = topHalf - (topHalf - bottomHalf) * t;
          return (
            <path
              key={i}
              d={`M ${CENTER_X - half + 4} ${y} Q ${CENTER_X} ${y + 5} ${CENTER_X + half - 4} ${y}`}
              fill="none"
              stroke="#A9784A"
              strokeOpacity={0.5}
              strokeWidth={1.5}
            />
          );
        })}
        <rect
          x={CENTER_X - topHalf + 2}
          y={topY + (bottomY - topY) * 0.36}
          width={(topHalf - 2) * 2}
          height={22}
          fill="#C1502E"
          opacity={0.88}
          transform={`skewX(0)`}
        />
        <text
          x={CENTER_X}
          y={topY + (bottomY - topY) * 0.36 + 15}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'Fraunces', serif"
          fontWeight={600}
          letterSpacing="2.5"
          fill="#FBF3E7"
        >
          GELATERIA
        </text>
        <ellipse
          cx={CENTER_X}
          cy={topY}
          rx={topHalf}
          ry={9}
          fill="none"
          stroke="#8C6136"
          strokeWidth={2}
          opacity={0.6}
        />
      </g>
    );
  }

  const apexX = CENTER_X;
  const apexY = rimY + 168;
  const leftRim = CENTER_X - RIM_HALF_WIDTH;
  const rightRim = CENTER_X + RIM_HALF_WIDTH;

  const conePath = `M ${apexX} ${apexY}
    Q ${leftRim - 6} ${apexY - 90} ${leftRim} ${rimY}
    L ${rightRim} ${rimY}
    Q ${rightRim + 6} ${apexY - 90} ${apexX} ${apexY} Z`;

  const hatchLines = [];
  const step = 16;
  for (let i = -8; i < 20; i++) {
    const x1 = apexX - 90 + i * step;
    hatchLines.push(
      <line key={`a${i}`} x1={x1} y1={apexY + 10} x2={x1 + 130} y2={rimY - 20} />
    );
    hatchLines.push(
      <line key={`b${i}`} x1={x1} y1={rimY - 20} x2={x1 + 130} y2={apexY + 10} />
    );
  }

  return (
    <g>
      <defs>
        <linearGradient id="cone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0C27F" />
          <stop offset="100%" stopColor="#C88A3E" />
        </linearGradient>
        <clipPath id="cone-clip">
          <path d={conePath} />
        </clipPath>
      </defs>
      <path d={conePath} fill="url(#cone-grad)" stroke="#A8672B" strokeWidth={2} />
      <g clipPath="url(#cone-clip)" stroke="#A8672B" strokeOpacity={0.35} strokeWidth={1.4}>
        {hatchLines}
      </g>
      <path
        d={`M ${leftRim + 4} ${rimY + 6} Q ${apexX - 20} ${rimY - 6} ${apexX} ${rimY + 4} Q ${apexX + 20} ${rimY - 6} ${rightRim - 4} ${rimY + 6}`}
        fill="none"
        stroke="#8C5A24"
        strokeWidth={2}
        opacity={0.5}
      />
    </g>
  );
}
