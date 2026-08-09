import FoodArt from "../art/FoodArt";
import { DRINK_FLAVORS } from "../data/menu";
import { formatPrice } from "../lib/pricing";
import { describeLine } from "../lib/lineDescription";
import { EmptyCartIcon, MinusIcon, PlusIcon, CloseIcon } from "./Icons";
import type { OrderApi } from "../hooks/useOrder";

interface CartPanelProps {
  order: OrderApi;
  className?: string;
}

export default function CartPanel({ order, className }: CartPanelProps) {
  const { cart, totals, updateQuantity, goToCheckout } = order;

  return (
    <aside className={`cart-panel ${className ?? ""}`}>
      <div className="cart-header">
        <h2>Il tuo ordine</h2>
        <span>{totals.itemCount === 0 ? "Nessun articolo" : `${totals.itemCount} articoli`}</span>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <EmptyCartIcon />
          <p>Il carrello è vuoto.
            <br />
            Scegli qualcosa dal menu per iniziare.</p>
        </div>
      ) : (
        <div className="cart-lines">
          {cart.map((line) => {
            const flavorOptions = line.config.isMenu ? DRINK_FLAVORS : line.item.flavorOptions ?? DRINK_FLAVORS;
            const flavor = line.config.flavorId ? flavorOptions.find((f) => f.id === line.config.flavorId) : undefined;
            return (
              <div className="cart-line" key={line.lineId}>
                <FoodArt art={line.item.art} liquidColor={flavor?.liquidColor} lidColor={flavor?.lidColor} className="cart-line-art" />
                <div className="cart-line-body">
                  <h4>{line.item.name}</h4>
                  <div className="cart-line-meta">{describeLine(line.item, line.config) || "Ricetta originale"}</div>
                  <div className="cart-line-footer">
                    <div className="qty-stepper">
                      <button type="button" onClick={() => updateQuantity(line.lineId, -1)} aria-label="Diminuisci">
                        {line.quantity === 1 ? <CloseIcon /> : <MinusIcon />}
                      </button>
                      <span>{line.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(line.lineId, 1)} aria-label="Aumenta">
                        <PlusIcon />
                      </button>
                    </div>
                    <span className="cart-line-price">{formatPrice(line.unitPrice * line.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="cart-footer">
        <div className="cart-total-row">
          <span>Totale</span>
          <strong>{formatPrice(totals.subtotal)}</strong>
        </div>
        <button className="btn-primary" type="button" disabled={cart.length === 0} onClick={goToCheckout}>
          Vai alla cassa
        </button>
      </div>
    </aside>
  );
}
