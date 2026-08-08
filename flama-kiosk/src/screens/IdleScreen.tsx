import FoodArt from "../art/FoodArt";
import { MENU_ITEMS } from "../data/menu";

interface IdleScreenProps {
  onStart: () => void;
}

const PROMO_IDS = ["smash-bacon", "chicken-crunch", "sundae"];

export default function IdleScreen({ onStart }: IdleScreenProps) {
  const promos = PROMO_IDS.map((id) => MENU_ITEMS.find((m) => m.id === id)!).filter(Boolean);

  return (
    <div className="idle-screen" onClick={onStart} role="button" tabIndex={0}>
      <div className="idle-glow idle-glow-a" aria-hidden="true" />
      <div className="idle-glow idle-glow-b" aria-hidden="true" />

      <div className="idle-topbar">
        <div className="idle-brand">
          <svg className="idle-brand-mark" viewBox="0 0 64 64" fill="none">
            <path d="M14 30c0-4 3-7 7-7 1-4 5-7 11-7s10 3 11 7c4 0 7 3 7 7 0 3-2 5-5 6H19c-3-1-5-3-5-6z" fill="#F2C77A" />
            <rect x="16" y="38" width="32" height="6" rx="2" fill="#E1462C" />
          </svg>
          FLAMA
        </div>
        <div className="idle-lang">
          <span className="active">IT</span>
          <span>EN</span>
        </div>
      </div>

      <div className="idle-main">
        <span className="idle-kicker">Self order</span>
        <h1 className="idle-title">Componi il tuo ordine, a modo tuo.</h1>
        <p className="idle-sub">
          Scegli tra burger, pollo, contorni e dolci. Personalizza ogni dettaglio e ritira il tuo numero alla cassa.
        </p>
        <button className="idle-cta" type="button" onClick={onStart}>
          Tocca per iniziare
        </button>
      </div>

      <div className="idle-carousel">
        {promos.map((p) => (
          <div className="idle-promo" key={p.id}>
            <FoodArt art={p.art} />
            <p>{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
