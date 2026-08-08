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
  geometry: Geometry;
  decorations: Decoration[];
  glaze: Glaze | null;
  extras: Extra[];
  seedBase: string;
}

const SPRINKLE_COLORS = ["#E4728C", "#EFD25C", "#7FBFA0", "#6A4C93", "#4FA8D8", "#F0955C"];

export default function Toppings({ geometry, decorations, glaze, extras, seedBase }: ToppingsProps) {
  const { cx, cy, rx, ry } = geometry;

  const decorationLayers = useMemo(() => {
    return decorations.map((dec) => {
      const rand = seededRandom(seedBase + "-dec-" + dec.id);
      const items: ReactElement[] = [];
      const scatter = (count: number, build: (x: number, y: number, r: () => number, i: number) => ReactElement) => {
        for (let i = 0; i < count; i++) {
          const angle = rand() * Math.PI * 2;
          const dist = 0.15 + rand() * 0.62;
          const x = cx + Math.cos(angle) * rx * dist;
          const y = cy - ry * 0.25 + Math.sin(angle) * ry * dist * 0.7;
          items.push(build(x, y, rand, i));
        }
      };

      if (dec.id === "zuccherini") {
        scatter(24, (x, y, r, i) => {
          const c = SPRINKLE_COLORS[Math.floor(r() * SPRINKLE_COLORS.length)];
          const rot = (r() * 360).toFixed(0);
          return (
            <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})`}>
              <rect x={-3} y={-1.2} width={6} height={2.4} rx={1.2} fill={darken(c, 0.12)} />
              <rect x={-3} y={-1.5} width={6} height={1.3} rx={0.8} fill={lighten(c, 0.35)} opacity={0.75} />
            </g>
          );
        });
      } else if (dec.id === "nocciole") {
        scatter(16, (x, y, r, i) => {
          const rad = 2.2 + r() * 1.8;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={rad} fill="#8A6540" stroke="#5C4326" strokeWidth={0.6} />
              <circle cx={x - rad * 0.35} cy={y - rad * 0.35} r={rad * 0.4} fill="#C9A578" opacity={0.65} />
            </g>
          );
        });
      } else if (dec.id === "scaglie") {
        scatter(14, (x, y, r, i) => {
          const rot = (r() * 360).toFixed(0);
          return (
            <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})`}>
              <path d="M -4.5 3 Q -1 -5 4.5 3 Q 0 1.4 -4.5 3 Z" fill="#3B241A" />
              <path d="M -3 2 Q -1 -2.5 2.4 1.6" fill="none" stroke="#6B4A34" strokeWidth={0.7} opacity={0.7} />
            </g>
          );
        });
      } else if (dec.id === "cocco-rape") {
        scatter(18, (x, y, r, i) => (
          <path
            key={i}
            d="M -4 0 Q 0 -3.5 4 0"
            stroke="#F8F4E8"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)})`}
          />
        ));
      }

      return (
        <g key={dec.id} className="topping-enter">
          {items}
        </g>
      );
    });
  }, [decorations, seedBase, cx, cy, rx, ry]);

  const glazeLayer = useMemo(() => {
    if (!glaze) return null;
    const rand = seededRandom(seedBase + "-glaze-" + glaze.id);
    const waveY = cy - ry * 0.42;
    const segments = 6;
    let d = `M ${cx - rx * 0.82} ${waveY}`;
    for (let i = 1; i <= segments; i++) {
      const x = cx - rx * 0.82 + (rx * 1.64 * i) / segments;
      const y = waveY + (i % 2 === 0 ? -10 : 10);
      d += ` Q ${x - (rx * 1.64) / segments / 2} ${y} ${x} ${waveY}`;
    }
    const drips = [];
    for (let i = 0; i < 4; i++) {
      const t = 0.15 + i * 0.24 + rand() * 0.05;
      const x = cx - rx * 0.82 + rx * 1.64 * t;
      const len = 14 + rand() * 22;
      const dripPath = `M ${x - 5} ${waveY} Q ${x - 6} ${waveY + len * 0.6} ${x} ${waveY + len} Q ${x + 6} ${waveY + len * 0.6} ${x + 5} ${waveY} Z`;
      drips.push(
        <g key={i}>
          <path d={dripPath} fill={glaze.color} />
          <path
            d={`M ${x - 2.6} ${waveY + 3} Q ${x - 3} ${waveY + len * 0.4} ${x - 0.8} ${waveY + len * 0.62}`}
            fill="none"
            stroke={lighten(glaze.color, 0.4)}
            strokeWidth={1.1}
            strokeLinecap="round"
            opacity={0.55}
          />
        </g>
      );
    }
    return (
      <g className="topping-enter">
        {drips}
        <path d={d} fill="none" stroke={glaze.colorDark} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
        <path d={d} fill="none" stroke={glaze.color} strokeWidth={8} strokeLinecap="round" />
        <path
          d={d}
          fill="none"
          stroke={lighten(glaze.color, 0.45)}
          strokeWidth={2}
          strokeOpacity={0.5}
          strokeLinecap="round"
          transform="translate(0, -1.6)"
        />
      </g>
    );
  }, [glaze, seedBase, cx, cy, rx, ry]);

  const hasPanna = extras.some((e) => e.id === "panna");
  const hasAmarena = extras.some((e) => e.id === "amarena");
  const hasCialda = extras.some((e) => e.id === "cialda");

  const pannaTopY = cy - ry * 0.55;
  const rand = useMemo(() => seededRandom(seedBase + "-extras"), [seedBase]);

  const pannaLayer = hasPanna ? (
    <g className="topping-enter">
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
    <g className="topping-enter">
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
    <g
      className="topping-enter"
      transform={`translate(${cx + rx * 0.5} ${cy - ry * 0.5}) rotate(-24)`}
    >
      <rect x={-6} y={-58} width={12} height={64} rx={3} fill="#D9A45C" stroke="#A9743A" strokeWidth={1.2} />
      {[-40, -24, -8, 8, 24].map((y, i) => (
        <line key={i} x1={-5} y1={y} x2={5} y2={y + 6} stroke="#A9743A" strokeWidth={1} opacity={0.6} />
      ))}
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
