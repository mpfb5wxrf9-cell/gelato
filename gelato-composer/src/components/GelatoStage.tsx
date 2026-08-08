import { useMemo } from "react";
import type { Decoration, Extra, Flavor, Glaze } from "../data/options";
import GelatoBase from "./GelatoBase";
import Scoop from "./Scoop";
import Toppings from "./Toppings";
import { seededRandom } from "../lib/rng";

interface GelatoStageProps {
  baseId: string;
  flavors: Flavor[];
  decorations: Decoration[];
  glaze: Glaze | null;
  extras: Extra[];
}

const RIM_Y = 430;

const BASE_RX = 92;
const BASE_RY = BASE_RX * 0.86;

function scoopGeometry(index: number, total: number, baseId: string, flavorId: string) {
  const rand = seededRandom(`${flavorId}-${index}-${total}-${baseId}`);
  const rx = 92 - index * 13;
  const ry = rx * 0.86;
  // A coppetta has tapered walls below the rim: keep the whole stack
  // mounded above/at the rim so the round scoops don't poke through the
  // narrower cup sides lower down. A cone has no enclosing walls, so the
  // scoop can sit lower, bulging naturally over the rim.
  const restOffset = baseId === "coppetta" ? BASE_RY - 14 : 20;
  const cy = RIM_Y - restOffset - index * 93;
  const jitter = (rand() - 0.5) * 14;
  const cx = 200 + jitter;
  return { cx, cy, rx, ry };
}

export default function GelatoStage({ baseId, flavors, decorations, glaze, extras }: GelatoStageProps) {
  const geometries = useMemo(
    () => flavors.map((f, i) => scoopGeometry(i, flavors.length, baseId, f.id)),
    [flavors, baseId]
  );

  const topGeometry = geometries[geometries.length - 1] ?? {
    cx: 200,
    cy: RIM_Y - 40,
    rx: 80,
    ry: 69,
  };

  const seedKey = `${baseId}|${flavors.map((f) => f.id).join(",")}`;

  const frame = useMemo(() => {
    let topBuffer = 20;
    if (glaze) topBuffer = Math.max(topBuffer, 34);
    const hasPanna = extras.some((e) => e.id === "panna");
    const hasAmarena = extras.some((e) => e.id === "amarena");
    const hasCialda = extras.some((e) => e.id === "cialda");
    if (hasCialda) topBuffer = Math.max(topBuffer, 78);
    if (hasPanna) topBuffer = Math.max(topBuffer, 98);
    if (hasAmarena) topBuffer = Math.max(topBuffer, hasPanna ? 132 : 74);

    const contentTop =
      flavors.length > 0 ? topGeometry.cy - topGeometry.ry - topBuffer : RIM_Y - 92;
    const contentBottom = baseId === "coppetta" ? RIM_Y + 118 + 24 : RIM_Y + 168 + 28;

    const targetTop = 34;
    const targetBottom = 604;
    const rawScale = (targetBottom - targetTop) / (contentBottom - contentTop);
    const scale = Math.min(1.55, Math.max(0.85, rawScale));
    const translateY = targetTop - contentTop * scale;
    const translateX = 200 * (1 - scale);
    return { scale, translateX, translateY };
  }, [flavors.length, topGeometry, glaze, extras, baseId]);

  return (
    <div className="stage-wrap">
      <svg
        viewBox="0 0 400 620"
        className="stage-svg"
        role="img"
        aria-label="Anteprima del gelato composto"
      >
        <defs>
          <filter id="f-ground-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="f-contact-blur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
          <filter id="f-gloss-blur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="f-grain" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
          </filter>
        </defs>
        <g
          className="stage-frame"
          style={{
            transform: `translate(${frame.translateX}px, ${frame.translateY}px) scale(${frame.scale})`,
          }}
        >
          <ellipse cx={200} cy={588} rx={104} ry={13} fill="#2A1B10" opacity={0.22} filter="url(#f-ground-blur)" />
          <GelatoBase baseId={baseId} rimY={RIM_Y} />
          {flavors.map((flavor, i) => (
            <Scoop
              key={`${flavor.id}-${i}`}
              flavor={flavor}
              geometry={geometries[i]}
              seed={`${flavor.id}-${i}-${flavors.length}-${baseId}`}
              delay={i * 90}
            />
          ))}
          {flavors.length > 0 && (
            <Toppings
              geometries={geometries}
              decorations={decorations}
              glaze={glaze}
              extras={extras}
              seedBase={seedKey}
            />
          )}
        </g>
      </svg>
      {flavors.length === 0 && (
        <div className="stage-empty">
          <p>Scegli il tuo primo gusto qui sotto</p>
        </div>
      )}
    </div>
  );
}
