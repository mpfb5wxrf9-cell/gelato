import { useId } from "react";
import { scallopEdge, dripEdge, domePath, crinkleStrip } from "./shapes";

interface BurgerProps {
  patty: "beef" | "chicken" | "veggie";
  cheese: boolean;
  bacon: boolean;
  bunTop: "sesame" | "plain";
  className?: string;
}

const PATTY_COLORS: Record<BurgerProps["patty"], { main: string; dark: string; edge: string; fleck: string }> = {
  beef: { main: "#6B3A22", dark: "#4A2415", edge: "#301207", fleck: "#2A140A" },
  chicken: { main: "#E3B45C", dark: "#C4934A", edge: "#A97530", fleck: "#B98A3E" },
  veggie: { main: "#8B9A54", dark: "#6C7A3D", edge: "#4F5C2E", fleck: "#D9B94A" },
};

export default function Burger({ patty, cheese, bacon, bunTop, className }: BurgerProps) {
  const uid = useId().replace(/[:]/g, "");
  const cx = 120;
  const pc = PATTY_COLORS[patty];

  const bottomBunTop = domePath(cx, 178, 62, 24, 0.45);
  const lettuceD =
    `M ${cx - 70} 156` +
    scallopEdge(cx - 70, cx + 70, 140, 8, 6) +
    ` L ${cx + 64} 156 Z`;
  const tomatoD = domePath(cx, 142, 64, 9, 0.7);

  const pattyLeft = cx - 68;
  const pattyRight = cx + 68;
  const pattyTop = 114;
  const pattyBottom = 134;
  const pattyD = `M ${pattyLeft} ${pattyBottom}
    Q ${pattyLeft - 4} ${(pattyTop + pattyBottom) / 2} ${pattyLeft} ${pattyTop}
    L ${pattyRight} ${pattyTop}
    Q ${pattyRight + 4} ${(pattyTop + pattyBottom) / 2} ${pattyRight} ${pattyBottom}
    Z`;

  const cheeseLeft = cx - 62;
  const cheeseRight = cx + 62;
  const cheeseTop = 104;
  const cheeseBase = 116;
  const cheeseD =
    `M ${cheeseLeft} ${cheeseTop} L ${cheeseRight} ${cheeseTop} L ${cheeseRight} ${cheeseBase}` +
    dripEdge(cheeseRight, cheeseLeft, cheeseBase, 5, 13) +
    ` Z`;

  const baconLeftD = crinkleStrip(pattyLeft - 16, cheeseLeft + 12, 108, 122, 3, 3.4);
  const baconRightD = crinkleStrip(cheeseRight - 12, pattyRight + 16, 111, 124, 3, 3.4);

  const topBunHeight = 50;
  const topBunBase = 104;
  const topBunD = domePath(cx, topBunBase, 64, topBunHeight, 0.22);

  const seeds = bunTop === "sesame"
    ? [
        [-30, -30], [-10, -38], [12, -37], [32, -28],
        [-20, -18], [4, -22], [22, -12], [-2, -8],
      ]
    : [];

  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="Illustrazione del panino">
      <defs>
        <radialGradient id={`bb-${uid}`} cx="35%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#F2C77A" />
          <stop offset="60%" stopColor="#E0A855" />
          <stop offset="100%" stopColor="#C1893C" />
        </radialGradient>
        <linearGradient id={`lt-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8CC152" />
          <stop offset="100%" stopColor="#5D9C34" />
        </linearGradient>
        <linearGradient id={`tm-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8544A" />
          <stop offset="100%" stopColor="#C43A32" />
        </linearGradient>
        <linearGradient id={`pt-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pc.main} />
          <stop offset="100%" stopColor={pc.dark} />
        </linearGradient>
        <linearGradient id={`ch-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFDD6B" />
          <stop offset="100%" stopColor="#F3B93E" />
        </linearGradient>
        <linearGradient id={`bc-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4573B" />
          <stop offset="100%" stopColor="#8E3524" />
        </linearGradient>
        <radialGradient id={`tb-${uid}`} cx="38%" cy="22%" r="95%">
          <stop offset="0%" stopColor="#F7CD84" />
          <stop offset="55%" stopColor="#E7AC58" />
          <stop offset="100%" stopColor="#C1893C" />
        </radialGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2A1608" floodOpacity="0.28" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        <ellipse cx={cx} cy={186} rx={70} ry={8} fill="#2A1608" opacity={0.18} />

        <path d={bottomBunTop} fill={`url(#bb-${uid})`} stroke="#A9722E" strokeWidth={1.2} />
        <path d={lettuceD} fill={`url(#lt-${uid})`} stroke="#4C821F" strokeWidth={1} />
        <path d={tomatoD} fill={`url(#tm-${uid})`} stroke="#A32E27" strokeWidth={1} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={cx - 20 + i * 20} cy={142} r={1.6} fill="#F3B9A8" opacity={0.8} />
        ))}

        <path d={pattyD} fill={`url(#pt-${uid})`} stroke={pc.edge} strokeWidth={1.4} />
        {patty === "beef" &&
          [-40, -18, 4, 26, 44].map((dx, i) => (
            <line
              key={i}
              x1={cx + dx}
              y1={pattyTop + 4}
              x2={cx + dx + 10}
              y2={pattyBottom - 4}
              stroke={pc.fleck}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.55}
            />
          ))}
        {patty !== "beef" &&
          Array.from({ length: 10 }).map((_, i) => {
            const fx = pattyLeft + 8 + ((i * 53) % (pattyRight - pattyLeft - 16));
            const fy = pattyTop + 5 + ((i * 29) % (pattyBottom - pattyTop - 10));
            return <circle key={i} cx={fx} cy={fy} r={1.4} fill={pc.fleck} opacity={0.7} />;
          })}

        {cheese && <path d={cheeseD} fill={`url(#ch-${uid})`} stroke="#D89A2C" strokeWidth={1} />}

        {bacon && (
          <>
            <path d={baconLeftD} fill={`url(#bc-${uid})`} stroke="#6E2718" strokeWidth={1} />
            <path d={baconRightD} fill={`url(#bc-${uid})`} stroke="#6E2718" strokeWidth={1} />
            <path d={`M ${pattyLeft - 10} 113 Q ${cheeseLeft - 4} 110 ${cheeseLeft + 6} 114`} fill="none" stroke="#F3C9B8" strokeWidth={1.4} opacity={0.75} strokeLinecap="round" />
            <path d={`M ${cheeseRight - 8} 115 Q ${cheeseRight + 8} 118 ${pattyRight + 10} 116`} fill="none" stroke="#F3C9B8" strokeWidth={1.4} opacity={0.75} strokeLinecap="round" />
          </>
        )}

        <path
          d={`M ${cx - 60} 106 Q ${cx - 30} 118 ${cx - 4} 108`}
          fill="none"
          stroke="#F6EBD2"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.85}
        />

        <path d={topBunD} fill={`url(#tb-${uid})`} stroke="#A9722E" strokeWidth={1.2} />
        {seeds.map(([sx, sy], i) => (
          <ellipse
            key={i}
            cx={cx + sx}
            cy={topBunBase - topBunHeight * 0.62 + sy}
            rx={3.2}
            ry={1.6}
            fill="#FBEBC4"
            stroke="#D8B36A"
            strokeWidth={0.4}
            transform={`rotate(${(i * 37) % 180} ${cx + sx} ${topBunBase - topBunHeight * 0.62 + sy})`}
          />
        ))}
      </g>
    </svg>
  );
}
