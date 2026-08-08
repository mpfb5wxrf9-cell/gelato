import { useMemo, type ReactElement } from "react";
import type { Flavor } from "../data/options";
import { blobPath } from "../lib/blob";
import { hashSeed, seededRandom } from "../lib/rng";
import { darken, lighten } from "../lib/color";

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
  const creamId = `scoop-cream-${seed}`;
  const deepShade = useMemo(() => darken(flavor.shade, 0.32), [flavor.shade]);
  const turbSeed = useMemo(() => hashSeed(seed) % 90, [seed]);

  const glossPath = useMemo(
    () =>
      blobPath(
        cx - rx * 0.28,
        cy - ry * 0.42,
        rx * 0.34,
        ry * 0.24,
        seededRandom(seed + "-gloss"),
        7,
        0.18
      ),
    [cx, cy, rx, ry, seed]
  );

  const ripple = useMemo(() => {
    const r3 = seededRandom(seed + "-ripple");
    const y0 = cy - ry * (0.12 + r3() * 0.14);
    const bow = ry * (0.22 + r3() * 0.12) * (r3() > 0.5 ? 1 : -1);
    const x0 = cx - rx * 0.68;
    const x1 = cx + rx * 0.7;
    return `M ${x0} ${y0} Q ${cx} ${y0 + bow} ${x1} ${y0 - bow * 0.35}`;
  }, [cx, cy, rx, ry, seed]);

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
        <radialGradient id={gradId} cx="33%" cy="24%" r="80%">
          <stop offset="0%" stopColor={flavor.highlight} />
          <stop offset="30%" stopColor={flavor.main} />
          <stop offset="72%" stopColor={flavor.shade} />
          <stop offset="100%" stopColor={deepShade} />
        </radialGradient>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
        <filter id={creamId} x="-20%" y="-20%" width="140%" height="140%" primitiveUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency="0.055 0.07" numOctaves="3" seed={turbSeed} result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.3" result="noiseSmooth" />
          <feDiffuseLighting in="noiseSmooth" surfaceScale="3.4" diffuseConstant="1.05" lightingColor="#fff9ee" result="diff">
            <feDistantLight azimuth="235" elevation="55" />
          </feDiffuseLighting>
          <feSpecularLighting in="noiseSmooth" surfaceScale="3.4" specularConstant="0.45" specularExponent="17" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth="235" elevation="55" />
          </feSpecularLighting>
          <feComposite in="diff" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="shaded" />
          <feComposite in="spec" in2="shaded" operator="arithmetic" k1="0" k2="0.8" k3="1" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <ellipse
        cx={cx}
        cy={cy + ry * 0.78}
        rx={rx * 0.72}
        ry={ry * 0.3}
        fill="#2A1B10"
        opacity={0.28}
        filter="url(#f-contact-blur)"
      />
      <path
        d={path}
        fill={`url(#${gradId})`}
        stroke={deepShade}
        strokeWidth={1}
        strokeOpacity={0.55}
        filter={`url(#${creamId})`}
      />
      <g clipPath={`url(#${clipId})`}>
        {texture}
        <path
          d={ripple}
          fill="none"
          stroke={deepShade}
          strokeWidth={2.2}
          strokeLinecap="round"
          opacity={0.22}
        />
        <path
          d={ripple}
          fill="none"
          stroke={lighten(flavor.highlight, 0.3)}
          strokeWidth={1.1}
          strokeLinecap="round"
          opacity={0.35}
          transform="translate(0, -1.6)"
        />
        <path
          d={glossPath}
          fill="#ffffff"
          opacity={0.32}
          filter="url(#f-gloss-blur)"
          style={{ mixBlendMode: "screen" }}
        />
      </g>
    </g>
  );
}
