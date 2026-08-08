import { useMemo, type ReactElement } from "react";
import type { Flavor } from "../data/options";
import { blobPath } from "../lib/blob";
import { seededRandom } from "../lib/rng";

interface ScoopGeometry {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

interface ScoopProps {
  flavor: Flavor;
  geometry: ScoopGeometry;
  seed: string;
  delay: number;
}

export default function Scoop({ flavor, geometry, seed, delay }: ScoopProps) {
  const { cx, cy, rx, ry } = geometry;
  const rand = useMemo(() => seededRandom(seed), [seed]);
  const path = useMemo(
    () => blobPath(cx, cy, rx, ry, rand, 11, 0.1),
    [cx, cy, rx, ry, rand]
  );
  const gradId = `scoop-grad-${seed}`;
  const clipId = `scoop-clip-${seed}`;

  const texture = useMemo(() => {
    const items: ReactElement[] = [];
    const r2 = seededRandom(seed + "-tex");
    if (flavor.texture === "fleck" || flavor.texture === "seed") {
      const count = flavor.texture === "seed" ? 22 : 15;
      for (let i = 0; i < count; i++) {
        const angle = r2() * Math.PI * 2;
        const dist = r2() * 0.72;
        const x = cx + Math.cos(angle) * rx * dist;
        const y = cy + Math.sin(angle) * ry * dist;
        const w = flavor.texture === "seed" ? 1.3 + r2() * 0.8 : 2 + r2() * 2.2;
        const h = flavor.texture === "seed" ? 2 + r2() * 1.2 : 1.4 + r2() * 1.8;
        items.push(
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={w}
            ry={h}
            fill={flavor.fleckColor}
            opacity={0.55 + r2() * 0.3}
            transform={`rotate(${(r2() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`}
          />
        );
      }
    } else if (flavor.texture === "swirl") {
      for (let i = 0; i < 3; i++) {
        const y0 = cy - ry * 0.5 + i * ry * 0.5;
        const d = `M ${cx - rx * 0.75} ${y0} Q ${cx} ${y0 + ry * 0.32 * (i % 2 === 0 ? 1 : -1)} ${cx + rx * 0.75} ${y0}`;
        items.push(
          <path
            key={i}
            d={d}
            fill="none"
            stroke={flavor.fleckColor}
            strokeWidth={4.5}
            strokeLinecap="round"
            opacity={0.45}
          />
        );
      }
    } else if (flavor.texture === "chip") {
      for (let i = 0; i < 12; i++) {
        const angle = r2() * Math.PI * 2;
        const dist = r2() * 0.7;
        const x = cx + Math.cos(angle) * rx * dist;
        const y = cy + Math.sin(angle) * ry * dist;
        const s = 3 + r2() * 3;
        const rot = r2() * 360;
        items.push(
          <polygon
            key={i}
            points={`${-s},${s} ${s},${s} ${0},${-s}`}
            fill={flavor.fleckColor}
            opacity={0.8}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})`}
          />
        );
      }
    } else if (flavor.texture === "grain") {
      for (let i = 0; i < 14; i++) {
        const angle = r2() * Math.PI * 2;
        const dist = r2() * 0.7;
        const x = cx + Math.cos(angle) * rx * dist;
        const y = cy + Math.sin(angle) * ry * dist;
        const rot = r2() * 360;
        items.push(
          <path
            key={i}
            d={`M ${-4} 0 Q 0 ${-3} 4 0`}
            stroke={flavor.fleckColor}
            strokeWidth={1.4}
            fill="none"
            opacity={0.6}
            strokeLinecap="round"
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})`}
          />
        );
      }
    }
    return items;
  }, [flavor, seed, cx, cy, rx, ry]);

  return (
    <g
      className="scoop-enter"
      style={{ animationDelay: `${delay}ms`, transformOrigin: `${cx}px ${cy + ry * 0.6}px` }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor={flavor.highlight} />
          <stop offset="55%" stopColor={flavor.main} />
          <stop offset="100%" stopColor={flavor.shade} />
        </radialGradient>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill={`url(#${gradId})`} stroke={flavor.shade} strokeWidth={1.5} />
      <g clipPath={`url(#${clipId})`}>{texture}</g>
    </g>
  );
}
