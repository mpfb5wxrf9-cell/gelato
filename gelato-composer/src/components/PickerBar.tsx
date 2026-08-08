import { BASES, DECORATIONS, EXTRAS, FLAVORS, GLAZES, MAX_FLAVORS } from "../data/options";
import type { GelatoBuilder, TabId } from "../hooks/useGelatoBuilder";
import OptionCard from "./OptionCard";

const TABS: { id: TabId; label: string }[] = [
  { id: "base", label: "Base" },
  { id: "gusti", label: "Gusti" },
  { id: "decorazioni", label: "Decorazioni" },
  { id: "glassa", label: "Glassa" },
  { id: "extra", label: "Extra" },
];

export default function PickerBar({ builder }: { builder: GelatoBuilder }) {
  const {
    activeTab,
    setActiveTab,
    baseId,
    setBaseId,
    flavorIds,
    toggleFlavor,
    decorationIds,
    toggleDecoration,
    glazeId,
    setGlaze,
    extraIds,
    toggleExtra,
  } = builder;

  return (
    <div className="picker">
      <div className="picker-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === "gusti" && (
              <span className="tab-count">
                {flavorIds.length}/{MAX_FLAVORS}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="picker-row">
        {activeTab === "base" &&
          BASES.map((b) => (
            <OptionCard
              key={b.id}
              label={b.label}
              sub={b.desc}
              price={0}
              swatch={b.id === "cono" ? "linear-gradient(160deg, #F0C27F, #C88A3E)" : "linear-gradient(160deg, #EAD2AA, #C89968)"}
              selected={baseId === b.id}
              onClick={() => setBaseId(b.id)}
            />
          ))}

        {activeTab === "gusti" &&
          FLAVORS.map((f) => (
            <OptionCard
              key={f.id}
              label={f.label}
              sub={f.desc}
              price={f.price}
              swatch={`radial-gradient(circle at 32% 28%, ${f.highlight}, ${f.main} 60%, ${f.shade})`}
              selected={flavorIds.includes(f.id)}
              disabled={!flavorIds.includes(f.id) && flavorIds.length >= MAX_FLAVORS}
              onClick={() => toggleFlavor(f.id)}
            />
          ))}

        {activeTab === "decorazioni" &&
          DECORATIONS.map((d) => (
            <OptionCard
              key={d.id}
              label={d.label}
              price={d.price}
              swatch={d.swatch}
              selected={decorationIds.includes(d.id)}
              onClick={() => toggleDecoration(d.id)}
            />
          ))}

        {activeTab === "glassa" &&
          GLAZES.map((g) => (
            <OptionCard
              key={g.id}
              label={g.label}
              price={g.price}
              swatch={`linear-gradient(160deg, ${g.color}, ${g.colorDark})`}
              selected={glazeId === g.id}
              onClick={() => setGlaze(g.id)}
            />
          ))}

        {activeTab === "extra" &&
          EXTRAS.map((e) => (
            <OptionCard
              key={e.id}
              label={e.label}
              price={e.price}
              swatch={e.swatch}
              selected={extraIds.includes(e.id)}
              onClick={() => toggleExtra(e.id)}
            />
          ))}
      </div>
    </div>
  );
}
