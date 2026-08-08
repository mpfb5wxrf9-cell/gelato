import { useEffect, useState } from "react";
import GelatoStage from "./components/GelatoStage";
import PickerBar from "./components/PickerBar";
import { useGelatoBuilder } from "./hooks/useGelatoBuilder";

function DiceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 12a8 8 0 1 1 2.6 5.9M4 12V6M4 12h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 13l4.5 4.5L19 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const builder = useGelatoBuilder();
  const { selected, total, reset, randomize, notice } = builder;
  const [toast, setToast] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    if (!notice) return;
    setToast(notice.text);
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [notice]);

  const handleOrder = () => {
    if (selected.flavors.length === 0) {
      setToast("Scegli almeno un gusto prima di ordinare");
      window.setTimeout(() => setToast(null), 2400);
      return;
    }
    setOrderConfirmed(true);
    window.setTimeout(() => setOrderConfirmed(false), 2600);
  };

  const chips = [
    selected.base.label,
    ...selected.flavors.map((f) => f.label),
    ...selected.decorations.map((d) => d.label),
    selected.glaze?.label,
    ...selected.extras.map((e) => e.label),
  ].filter(Boolean) as string[];

  return (
    <div className="app-shell">
      <div className="bg-blob bg-blob-a" aria-hidden="true" />
      <div className="bg-blob bg-blob-b" aria-hidden="true" />

      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">Cono</span>
          <span className="brand-tagline">laboratorio del gelato</span>
        </div>
        <div className="header-actions">
          <button type="button" className="icon-btn" onClick={randomize} title="Sorprendimi">
            <DiceIcon />
            <span>Sorprendimi</span>
          </button>
          <button type="button" className="icon-btn" onClick={reset} title="Ricomincia">
            <ResetIcon />
            <span>Ricomincia</span>
          </button>
        </div>
      </header>

      <main className="stage-area">
        <GelatoStage
          baseId={builder.baseId}
          flavors={selected.flavors}
          decorations={selected.decorations}
          glaze={selected.glaze}
          extras={selected.extras}
        />
      </main>

      <section className="summary-strip">
        <div className="summary-chips">
          {chips.length === 0 ? (
            <span className="chip chip-empty">Comincia a comporre il tuo gelato</span>
          ) : (
            chips.map((c, i) => (
              <span key={i} className="chip">
                {c}
              </span>
            ))
          )}
        </div>
        <div className="summary-order">
          <span className="summary-total">{total.toFixed(2).replace(".", ",")} €</span>
          <button type="button" className="order-btn" onClick={handleOrder}>
            {orderConfirmed ? (
              <>
                <CheckBadgeIcon /> Ordinato
              </>
            ) : (
              "Ordina"
            )}
          </button>
        </div>
      </section>

      <PickerBar builder={builder} />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
