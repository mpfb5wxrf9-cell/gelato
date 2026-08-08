import { useMemo, type ReactElement } from "react";
import type { Decoration, Extra, Glaze } from "../data/options";
import { blobPath } from "../lib/blob";
import { seededRandom } from "../lib/rng";
import { darken, lighten } from "../lib/color";

interface Geometry {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

interface ToppingsProps {
  geometries: Geometry[];
  decorations: Decoration[];
  glaze: Glaze | null;
  extras: Extra[];
  seedBase: string;
}

const SPRINKLE_COLORS = ["#E4728C", "#EFD25C", "#7FBFA0", "#6A4C93", "#4FA8D8", "#F0955C"];

const DECORATION_BUILDERS: Record<string, { baseCount: number; build: (r: () => number) => ReactElement }> = {
  zuccherini: {
    baseCount: 24,
    build: (r) => {
      const c = SPRINKLE_COLORS[Math.floor(r() * SPRINKLE_COLORS.length)];
      return (
        <>
          <rect x={-3} y={-1.2} width={6} height={2.4} rx={1.2} fill={darken(c, 0.12)} />
          <rect x={-3} y={-1.5} width={6} height={1.3} rx={0.8} fill={lighten(c, 0.35)} opacity={0.75} />
        </>
      );
    },
  },
  nocciole: {
    baseCount: 16,
    build: (r) => {
      const rad = 2.2 + r() * 1.8;
      return (
        <>
          <circle cx={0} cy={0} r={rad} fill="#8A6540" stroke="#5C4326" strokeWidth={0.6} />
          <circle cx={-rad * 0.35} cy={-rad * 0.35} r={rad * 0.4} fill="#C9A578" opacity={0.65} />
        </>
      );
    },
  },
  scaglie: {
    baseCount: 14,
    build: () => (
      <>
        <path d="M -4.5 3 Q -1 -5 4.5 3 Q 0 1.4 -4.5 3 Z" fill="#3B241A" />
        <path d="M -3 2 Q -1 -2.5 2.4 1.6" fill="none" stroke="#6B4A34" strokeWidth={0.7} opacity={0.7} />
      </>
    ),
  },
  "cocco-rape": {
    baseCount: 18,
    build: () => (
      <path d="M -4 0 Q 0 -3.5 4 0" stroke="#F8F4E8" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    ),
  },
};

// Decreasing share of the topping that spills onto each scoop further
// down the stack, like it was poured on top and cascaded over the sides.
const LEVEL_FACTORS = [1, 0.45, 0.2];

export default function Toppings({ geometries, decorations, glaze, extras, seedBase }: ToppingsProps) {
  const topGeometry = geometries[geometries.length - 1];
  const { cx, cy, rx, ry } = topGeometry;
  const levels = useMemo(() => [...geometries].reverse().slice(0, 3), [geometries]);

  const decorationLayers = useMemo(() => {
    return decorations.map((dec) => {
      const spec = DECORATION_BUILDERS[dec.id];
      if (!spec) return null;
      const rand = seededRandom(seedBase + "-dec-" + dec.id);
      const items: ReactElement[] = [];
      let particleIndex = 0;

      levels.forEach((geo, levelIndex) => {
        const count = Math.round(spec.baseCount * LEVEL_FACTORS[levelIndex]);
        const yBias = levelIndex === 0 ? -0.25 : -0.08;
        for (let i = 0; i < count; i++) {
          const angle = rand() * Math.PI * 2;
          const dist = 0.15 + rand() * 0.62;
          const x = geo.cx + Math.cos(angle) * geo.rx * dist;
          const y = geo.cy + geo.ry * yBias + Math.sin(angle) * geo.ry * dist * 0.7;
          const rot = (rand() * 360).toFixed(0);
          const delay = (levelIndex * 90 + rand() * 260).toFixed(0);
          items.push(
            <g key={particleIndex++} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})`}>
              <g className="sprinkle-pop" style={{ animationDelay: `${delay}ms` }}>
                {spec.build(rand)}
              </g>
            </g>
          );
        }
      });

      return <g key={dec.id}>{items}</g>;
    });
  }, [decorations, seedBase, levels]);

  const glazeLayer = useMemo(() => {
    if (!glaze) return null;
    const rand = seededRandom(seedBase + "-glaze-" + glaze.id);

    return (
      <g>
        {levels.map((geo, levelIndex) => {
          const scale = LEVEL_FACTORS[levelIndex];
          const waveY = geo.cy - geo.ry * (levelIndex === 0 ? 0.42 : 0.1);
          const segments = 6;
          let d = `M ${geo.cx - geo.rx * 0.82} ${waveY}`;
          for (let i = 1; i <= segments; i++) {
            const x = geo.cx - geo.rx * 0.82 + (geo.rx * 1.64 * i) / segments;
            const y = waveY + (i % 2 === 0 ? -10 : 10) * scale;
            d += ` Q ${x - (geo.rx * 1.64) / segments / 2} ${y} ${x} ${waveY}`;
          }

          const dripCount = levelIndex === 0 ? 4 : levelIndex === 1 ? 3 : 2;
          const drips = [];
          for (let i = 0; i < dripCount; i++) {
            const t = 0.18 + i * (0.64 / dripCount) + rand() * 0.05;
            const x = geo.cx - geo.rx * 0.82 + geo.rx * 1.64 * t;
            const len = (levelIndex === 0 ? 16 + rand() * 26 : 8 + rand() * 14) * (0.7 + levelIndex * 0.35);
            const w = 5 * scale + 1.5;
            const dripPath = `M ${x - w} ${waveY} Q ${x - w * 1.15} ${waveY + len * 0.6} ${x} ${waveY + len} Q ${x + w * 1.15} ${waveY + len * 0.6} ${x + w} ${waveY} Z`;
            drips.push(
              <g
                key={i}
                className="drip-form"
                style={{ animationDelay: `${520 + levelIndex * 260 + i * 90}ms` }}
              >
                <path d={dripPath} fill={glaze.color} opacity={0.55 + scale * 0.45} />
                <path
                  d={`M ${x - w * 0.5} ${waveY + 3} Q ${x - w * 0.6} ${waveY + len * 0.4} ${x - w * 0.15} ${waveY + len * 0.62}`}
                  fill="none"
                  stroke={lighten(glaze.color, 0.4)}
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  opacity={0.45 * scale + 0.15}
                />
              </g>
            );
          }

          const lineDelay = levelIndex * 0.22;
          const strokeMain = (levelIndex === 0 ? 8 : 5) * (0.6 + scale * 0.4);

          return (
            <g key={levelIndex}>
              <path
                d={d}
                pathLength={1}
                fill="none"
                stroke={glaze.colorDark}
                strokeWidth={strokeMain + 2}
                strokeLinecap="round"
                opacity={0.55 + scale * 0.35}
                className="glaze-line"
                style={{ animationDelay: `${lineDelay}s` }}
              />
              <path
                d={d}
                pathLength={1}
                fill="none"
                stroke={glaze.color}
                strokeWidth={strokeMain}
                strokeLinecap="round"
                opacity={0.6 + scale * 0.4}
                className="glaze-line"
                style={{ animationDelay: `${lineDelay + 0.05}s` }}
              />
              {levelIndex === 0 && (
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={lighten(glaze.color, 0.45)}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  strokeLinecap="round"
                  transform="translate(0, -1.6)"
                  className="glaze-line"
                  style={{ animationDelay: `${lineDelay + 0.1}s` }}
                />
              )}
              {drips}
            </g>
          );
        })}
      </g>
    );
  }, [glaze, seedBase, levels]);

  const hasPanna = extras.some((e) => e.id === "panna");
  const hasAmarena = extras.some((e) => e.id === "amarena");
  const hasCialda = extras.some((e) => e.id === "cialda");

  const pannaTopY = cy - ry * 0.55;
  const rand = useMemo(() => seededRandom(seedBase + "-extras"), [seedBase]);

  const pannaLayer = hasPanna ? (
    <g className="panna-pop">
      <defs>
        <radialGradient id="panna-grad" cx="32%" cy="26%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FFFCF4" />
          <stop offset="100%" stopColor="#E9DFC7" />
        </radialGradient>
      </defs>
      <ellipse
        cx={cx}
        cy={pannaTopY + 30}
        rx={30}
        ry={10}
        fill="#2A1B10"
        opacity={0.16}
        filter="url(#f-contact-blur)"
      />
      <path d={blobPath(cx, pannaTopY + 14, 34, 22, rand, 9, 0.08)} fill="url(#panna-grad)" stroke="#D8CBA9" strokeWidth={1} strokeOpacity={0.5} />
      <path d={blobPath(cx - 2, pannaTopY - 8, 24, 17, rand, 9, 0.09)} fill="url(#panna-grad)" stroke="#D8CBA9" strokeWidth={0.8} strokeOpacity={0.5} />
      <path d={blobPath(cx + 1, pannaTopY - 24, 14, 11, rand, 8, 0.1)} fill="url(#panna-grad)" stroke="#D8CBA9" strokeWidth={0.6} strokeOpacity={0.5} />
      <path
        d={`M ${cx - 10} ${pannaTopY - 24} Q ${cx} ${pannaTopY - 30} ${cx + 8} ${pannaTopY - 22}`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.75}
      />
    </g>
  ) : null;

  const capTopY = hasPanna ? pannaTopY - 36 : cy - ry * 0.7;

  const amarenaLayer = hasAmarena ? (
    <g className="cherry-drop">
      <defs>
        <radialGradient id="amarena-grad" cx="34%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#D8546A" />
          <stop offset="45%" stopColor="#9A1F34" />
          <stop offset="100%" stopColor="#5E0F1D" />
        </radialGradient>
      </defs>
      <path d={`M ${cx} ${capTopY} Q ${cx + 6} ${capTopY - 12} ${cx + 10} ${capTopY - 18}`} stroke="#5C6B3B" strokeWidth={2} fill="none" strokeLinecap="round" />
      <ellipse cx={cx} cy={capTopY + 9.5} rx={7} ry={3} fill="#2A1B10" opacity={0.22} filter="url(#f-contact-blur)" />
      <circle cx={cx} cy={capTopY + 6} r={8} fill="url(#amarena-grad)" stroke="#4A0C16" strokeWidth={0.8} />
      <circle cx={cx - 2.6} cy={capTopY + 2.8} r={2.1} fill="#FFDDE3" opacity={0.75} />
    </g>
  ) : null;

  const cialdaLayer = hasCialda ? (
    <g transform={`translate(${cx + rx * 0.68} ${cy - ry * 0.22}) rotate(-40)`}>
      <g className="cialda-in">
        <rect x={-6} y={-56} width={12} height={62} rx={3} fill="#D9A45C" stroke="#A9743A" strokeWidth={1.2} />
        {[-38, -22, -6, 10, 26].map((y, i) => (
          <line key={i} x1={-5} y1={y} x2={5} y2={y + 6} stroke="#A9743A" strokeWidth={1} opacity={0.6} />
        ))}
      </g>
    </g>
  ) : null;

  return (
    <g>
      {glazeLayer}
      {decorationLayers}
      {cialdaLayer}
      {pannaLayer}
      {amarenaLayer}
    </g>
  );
}
