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
            <stop offset="0%" stopColor="#EFD9B4" />
            <stop offset="55%" stopColor="#D3A96F" />
            <stop offset="100%" stopColor="#B4854F" />
          </linearGradient>
          <linearGradient id="cup-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#fff" stopOpacity="0" />
            <stop offset="72%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#3B2410" stopOpacity="0.38" />
          </linearGradient>
          <clipPath id="cup-clip">
            <path d={cupPath} />
          </clipPath>
          <filter id="f-paper-grain" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.2" numOctaves="2" seed="11" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="0.3" result="noiseSmooth" />
            <feDiffuseLighting in="noiseSmooth" surfaceScale="1.1" diffuseConstant="1" lightingColor="#fff6e6" result="diff">
              <feDistantLight azimuth="235" elevation="62" />
            </feDiffuseLighting>
            <feComposite in="diff" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="shaded" />
            <feComposite in="shaded" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
        <path d={cupPath} fill="url(#cup-grad)" stroke="#9C7143" strokeWidth={1.4} filter="url(#f-paper-grain)" />
        <g clipPath="url(#cup-clip)">
          {[0.28, 0.52, 0.76].map((t, i) => {
            const y = topY + (bottomY - topY) * t;
            const half = topHalf - (topHalf - bottomHalf) * t;
            return (
              <g key={i}>
                <path
                  d={`M ${CENTER_X - half + 4} ${y} Q ${CENTER_X} ${y + 5} ${CENTER_X + half - 4} ${y}`}
                  fill="none"
                  stroke="#7C5730"
                  strokeOpacity={0.35}
                  strokeWidth={1.4}
                />
                <path
                  d={`M ${CENTER_X - half + 4} ${y - 1.4} Q ${CENTER_X} ${y + 3.6} ${CENTER_X + half - 4} ${y - 1.4}`}
                  fill="none"
                  stroke="#FFEDCB"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
              </g>
            );
          })}
          <rect x={CENTER_X - topHalf - 4} y={topY - 4} width={(topHalf + 4) * 2} height={bottomY - topY + 8} fill="url(#cup-shade)" />
        </g>
        <rect
          x={CENTER_X - topHalf + 2}
          y={topY + (bottomY - topY) * 0.36}
          width={(topHalf - 2) * 2}
          height={22}
          fill="#C1502E"
          opacity={0.9}
        />
        <rect
          x={CENTER_X - topHalf + 2}
          y={topY + (bottomY - topY) * 0.36}
          width={(topHalf - 2) * 2}
          height={22}
          fill="url(#cup-shade)"
          opacity={0.55}
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
        <ellipse cx={CENTER_X} cy={topY + 1.6} rx={topHalf} ry={9} fill="none" stroke="#6E4B27" strokeWidth={2} opacity={0.5} />
        <ellipse cx={CENTER_X} cy={topY - 1.4} rx={topHalf - 1} ry={8} fill="none" stroke="#FFEDCB" strokeWidth={1.4} opacity={0.55} />
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
    hatchLines.push(<line key={`a${i}`} x1={x1} y1={apexY + 10} x2={x1 + 130} y2={rimY - 20} />);
    hatchLines.push(<line key={`b${i}`} x1={x1} y1={rimY - 20} x2={x1 + 130} y2={apexY + 10} />);
  }

  const bumps = [];
  const bumpStepX = 11.3;
  const bumpStepY = 11.3;
  for (let row = 0; row < 24; row++) {
    const y = rimY - 8 + row * bumpStepY;
    if (y > apexY + 20) break;
    const offset = row % 2 === 0 ? 0 : bumpStepX / 2;
    for (let col = -10; col < 10; col++) {
      const x = apexX + col * bumpStepX + offset;
      bumps.push(
        <g key={`${row}-${col}`}>
          <circle cx={x} cy={y} r={1.15} fill="#FFE9BC" opacity={0.4} />
          <circle cx={x + 1.1} cy={y + 1.1} r={0.9} fill="#7A4A1E" opacity={0.28} />
        </g>
      );
    }
  }

  return (
    <g>
      <defs>
        <linearGradient id="cone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3C983" />
          <stop offset="45%" stopColor="#E0A855" />
          <stop offset="100%" stopColor="#B87A34" />
        </linearGradient>
        <linearGradient id="cone-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0" />
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#4A2A0E" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id="cone-clip">
          <path d={conePath} />
        </clipPath>
        <filter id="f-cone-toast" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.045" numOctaves="2" seed="23" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="0.5" result="noiseSmooth" />
          <feDiffuseLighting in="noiseSmooth" surfaceScale="2.1" diffuseConstant="1" lightingColor="#fff1cc" result="diff">
            <feDistantLight azimuth="235" elevation="55" />
          </feDiffuseLighting>
          <feSpecularLighting in="noiseSmooth" surfaceScale="2.1" specularConstant="0.28" specularExponent="12" lightingColor="#fff6e2" result="spec">
            <feDistantLight azimuth="235" elevation="55" />
          </feSpecularLighting>
          <feComposite in="diff" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="shaded" />
          <feComposite in="spec" in2="shaded" operator="arithmetic" k1="0" k2="0.6" k3="1" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <path d={conePath} fill="url(#cone-grad)" stroke="#8C5A24" strokeWidth={1.4} filter="url(#f-cone-toast)" />
      <g clipPath="url(#cone-clip)">
        <g stroke="#7A4A1E" strokeOpacity={0.22} strokeWidth={1.1}>
          {hatchLines}
        </g>
        {bumps}
        <rect x={apexX - 90} y={rimY - 20} width={180} height={apexY - rimY + 40} fill="url(#cone-shade)" />
      </g>
      <path
        d={`M ${leftRim + 3} ${rimY + 7} Q ${apexX - 20} ${rimY - 7} ${apexX} ${rimY + 5} Q ${apexX + 20} ${rimY - 7} ${rightRim - 3} ${rimY + 7}`}
        fill="none"
        stroke="#6E4014"
        strokeWidth={2.4}
        opacity={0.45}
      />
      <path
        d={`M ${leftRim + 4} ${rimY + 3} Q ${apexX - 20} ${rimY - 10} ${apexX} ${rimY + 1} Q ${apexX + 20} ${rimY - 10} ${rightRim - 4} ${rimY + 3}`}
        fill="none"
        stroke="#FFE9BC"
        strokeWidth={1.4}
        opacity={0.5}
      />
    </g>
  );
}
