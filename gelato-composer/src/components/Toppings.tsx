import { useMemo, type ReactElement } from "react";
import type { Decoration, Extra, Glaze } from "../data/options";
import { blobPath } from "../lib/blob";
import { seededRandom } from "../lib/rng";

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
        scatter(24, (x, y, r, i) => (
          <rect
            key={i}
            x={-3}
            y={-1.2}
            width={6}
            height={2.4}
            rx={1.2}
            fill={SPRINKLE_COLORS[Math.floor(r() * SPRINKLE_COLORS.length)]}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)})`}
          />
        ));
      } else if (dec.id === "nocciole") {
        scatter(16, (x, y, r, i) => (
          <circle key={i} cx={x} cy={y} r={2.2 + r() * 1.8} fill="#8A6540" stroke="#5C4326" strokeWidth={0.6} />
        ));
      } else if (dec.id === "scaglie") {
        scatter(14, (x, y, r, i) => (
          <polygon
            key={i}
            points="-4,3 4,3 0,-4"
            fill="#3B241A"
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)})`}
          />
        ));
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
      drips.push(<path key={i} d={dripPath} fill={glaze.color} />);
    }
    return (
      <g className="topping-enter">
        {drips}
        <path d={d} fill="none" stroke={glaze.color} strokeWidth={9} strokeLinecap="round" />
        <path d={d} fill="none" stroke={glaze.colorDark} strokeWidth={2} strokeOpacity={0.4} strokeLinecap="round" />
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
      <path
        d={blobPath(cx, pannaTopY + 14, 34, 22, rand, 9, 0.08)}
        fill="#FFFDF8"
        stroke="#E9E0CC"
        strokeWidth={1.2}
      />
      <path
        d={blobPath(cx - 2, pannaTopY - 8, 24, 17, rand, 9, 0.09)}
        fill="#FFFEFB"
        stroke="#EDE4D0"
        strokeWidth={1}
      />
      <path
        d={blobPath(cx + 1, pannaTopY - 24, 14, 11, rand, 8, 0.1)}
        fill="#FFFFFC"
        stroke="#EDE4D0"
        strokeWidth={0.8}
      />
    </g>
  ) : null;

  const capTopY = hasPanna ? pannaTopY - 36 : cy - ry * 0.7;

  const amarenaLayer = hasAmarena ? (
    <g className="topping-enter">
      <path d={`M ${cx} ${capTopY} Q ${cx + 6} ${capTopY - 12} ${cx + 10} ${capTopY - 18}`} stroke="#5C6B3B" strokeWidth={2} fill="none" strokeLinecap="round" />
      <circle cx={cx} cy={capTopY + 6} r={8} fill="#8E1B2E" stroke="#5E0F1D" strokeWidth={1.2} />
      <circle cx={cx - 2.5} cy={capTopY + 3} r={2.4} fill="#C24559" opacity={0.7} />
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
