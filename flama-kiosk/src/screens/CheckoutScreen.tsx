import { useState } from "react";
import { MENU_ITEMS } from "../data/menu";
import { defaultConfig, formatPrice } from "../lib/pricing";
import { describeLine } from "../lib/lineDescription";
import { CardIcon, ContactlessIcon, RestartIcon } from "../components/Icons";
import FoodArt from "../art/FoodArt";
import type { OrderApi } from "../hooks/useOrder";

interface CheckoutScreenProps {
  order: OrderApi;
  onRestart: () => void;
}

type PaymentMethod = "card" | "contactless";

export default function CheckoutScreen({ order, onRestart }: CheckoutScreenProps) {
  const { cart, totals, backToMenu, confirmOrder, addToCart } = order;
  const [payment, setPayment] = useState<PaymentMethod>("contactless");

  const hasDessert = cart.some((l) => l.item.category === "dolci");
  const upsellItem = MENU_ITEMS.find((m) => m.id === "sundae");

  return (
    <div className="checkout-screen">
      <div className="step-topbar">
        <span className="step-brand">FLAMA</span>
        <button className="step-restart" type="button" onClick={onRestart}>
          <RestartIcon />
          Ricomincia
        </button>
      </div>

      <div className="checkout-body">
        <div className="checkout-column">
          <h1 className="checkout-title">Riepilogo ordine</h1>

          <div className="checkout-card">
            {cart.map((line) => (
              <div className="checkout-line" key={line.lineId}>
                <div className="checkout-line-name">
                  <span>
                    {line.quantity}× {line.item.name}
                  </span>
                  <small>{describeLine(line.item, line.config) || "Ricetta originale"}</small>
                </div>
                <strong>{formatPrice(line.unitPrice * line.quantity)}</strong>
              </div>
            ))}
          </div>

          {!hasDessert && upsellItem && (
            <div className="upsell-card">
              <FoodArt art={upsellItem.art} />
              <p>
                Concediti una <strong>{upsellItem.name}</strong> a soli {formatPrice(upsellItem.price)}?
              </p>
              <button
                type="button"
                onClick={() => addToCart(upsellItem, defaultConfig(upsellItem), 1)}
              >
                Aggiungi
              </button>
            </div>
          )}

          <div className="checkout-card">
            <h3 style={{ margin: "0 0 10px", fontSize: 13.5, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Metodo di pagamento
            </h3>
            <div className="payment-options">
              <button
                type="button"
                className={`payment-option ${payment === "contactless" ? "selected" : ""}`}
                onClick={() => setPayment("contactless")}
              >
                <ContactlessIcon />
                Contactless
              </button>
              <button
                type="button"
                className={`payment-option ${payment === "card" ? "selected" : ""}`}
                onClick={() => setPayment("card")}
              >
                <CardIcon />
                Carta
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={backToMenu}
            style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 13, fontWeight: 700, textAlign: "left", padding: 0 }}
          >
            ← Torna al menu
          </button>
        </div>
      </div>

      <div className="checkout-footer">
        <div className="checkout-footer-inner">
          <div className="checkout-footer-total">
            <span>Totale ({totals.itemCount} articoli)</span>
            <strong>{formatPrice(totals.subtotal)}</strong>
          </div>
          <button className="btn-primary" type="button" onClick={confirmOrder}>
            Conferma e paga
          </button>
        </div>
      </div>
    </div>
  );
}
