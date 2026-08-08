import { useState } from "react";
import type { CartLineConfig, MenuItem } from "../data/types";
import { DRINK_FLAVORS, NUGGET_SAUCES } from "../data/menu";
import { defaultConfig, formatPrice, unitPrice } from "../lib/pricing";
import { CloseIcon, MinusIcon, PlusIcon, CheckIcon } from "./Icons";
import FoodArt from "../art/FoodArt";

interface CustomizeModalProps {
  item: MenuItem;
  startAsMenu: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, config: CartLineConfig, quantity: number) => void;
}

export default function CustomizeModal({ item, startAsMenu, onClose, onAdd }: CustomizeModalProps) {
  const [config, setConfig] = useState<CartLineConfig>(() => {
    const base = defaultConfig(item);
    if (startAsMenu && item.canBeMenu) {
      return { ...base, isMenu: true, sizeId: item.sizes ? base.sizeId : "m" };
    }
    return base;
  });
  const [quantity, setQuantity] = useState(1);

  const price = unitPrice(item, config);
  const flavor = DRINK_FLAVORS.find((f) => f.id === config.flavorId);

  const toggleMenu = (isMenu: boolean) => {
    setConfig((c) => ({ ...c, isMenu, sizeId: isMenu && !item.sizes ? c.sizeId ?? "m" : c.sizeId }));
  };

  const toggleIngredient = (id: string) => {
    setConfig((c) => ({
      ...c,
      removedIngredients: c.removedIngredients.includes(id)
        ? c.removedIngredients.filter((i) => i !== id)
        : [...c.removedIngredients, id],
    }));
  };

  const toggleExtra = (id: string) => {
    setConfig((c) => ({
      ...c,
      extraIds: c.extraIds.includes(id) ? c.extraIds.filter((i) => i !== id) : [...c.extraIds, id],
    }));
  };

  const needsFlavor = config.isMenu || item.art.kind === "drink";
  const comboSizeOptions = [
    { id: "m", label: "Media", priceDelta: 0 },
    { id: "l", label: "Grande", priceDelta: 0.6 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <FoodArt art={item.art} liquidColor={flavor?.liquidColor} lidColor={flavor?.lidColor} className="modal-art" />
          <div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Chiudi">
            <CloseIcon />
          </button>
        </div>

        <div className="modal-scroll">
          {item.canBeMenu && (
            <div className="modal-section">
              <h3>Formula</h3>
              <div className="formula-toggle">
                <button
                  type="button"
                  className={`formula-option ${!config.isMenu ? "selected" : ""}`}
                  onClick={() => toggleMenu(false)}
                >
                  <strong>Solo prodotto</strong>
                  <span>{formatPrice(item.price)}</span>
                </button>
                <button
                  type="button"
                  className={`formula-option ${config.isMenu ? "selected" : ""}`}
                  onClick={() => toggleMenu(true)}
                >
                  <strong>Menu completo</strong>
                  <span>Con patatine e bibita • {formatPrice(item.price + (item.menuUpcharge ?? 0))}</span>
                </button>
              </div>
            </div>
          )}

          {config.isMenu && !item.sizes && (
            <div className="modal-section">
              <h3>Dimensione menu</h3>
              <div className="chip-row">
                {comboSizeOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip-option ${config.sizeId === s.id ? "selected" : ""}`}
                    onClick={() => setConfig((c) => ({ ...c, sizeId: s.id }))}
                  >
                    {s.label}
                    {s.priceDelta > 0 && ` +${formatPrice(s.priceDelta)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.sizes && (
            <div className="modal-section">
              <h3>{item.isNuggets ? "Numero di pezzi" : "Dimensione"}</h3>
              <div className="chip-row">
                {item.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip-option ${config.sizeId === s.id ? "selected" : ""}`}
                    onClick={() => setConfig((c) => ({ ...c, sizeId: s.id }))}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {needsFlavor && (
            <div className="modal-section">
              <h3>Bibita</h3>
              <div className="chip-row">
                {DRINK_FLAVORS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`chip-option ${config.flavorId === f.id ? "selected" : ""}`}
                    onClick={() => setConfig((c) => ({ ...c, flavorId: f.id }))}
                  >
                    <span className="chip-swatch" style={{ background: f.lidColor }} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.isNuggets && (
            <div className="modal-section">
              <h3>Salsa</h3>
              <div className="chip-row">
                {NUGGET_SAUCES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip-option ${config.sauceId === s.id ? "selected" : ""}`}
                    onClick={() => setConfig((c) => ({ ...c, sauceId: s.id }))}
                  >
                    <span className="chip-swatch" style={{ background: s.color }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="modal-section">
              <h3>Personalizza ingredienti</h3>
              {item.ingredients.map((ing) => {
                const removed = config.removedIngredients.includes(ing.id);
                return (
                  <div className="toggle-row" key={ing.id}>
                    <span>{ing.label}</span>
                    <button
                      type="button"
                      className={`switch ${!removed ? "on" : ""}`}
                      onClick={() => toggleIngredient(ing.id)}
                      aria-pressed={!removed}
                      aria-label={ing.label}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {item.extras && item.extras.length > 0 && (
            <div className="modal-section">
              <h3>Aggiungi extra</h3>
              {item.extras.map((extra) => {
                const active = config.extraIds.includes(extra.id);
                return (
                  <div className="extra-row" key={extra.id}>
                    <span>
                      <span className="extra-row-label">{extra.label}</span>
                      <span className="extra-row-price">+{formatPrice(extra.price)}</span>
                    </span>
                    <button
                      type="button"
                      className={`chip-option ${active ? "selected" : ""}`}
                      onClick={() => toggleExtra(extra.id)}
                    >
                      {active ? <CheckIcon /> : <PlusIcon />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="qty-stepper">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuisci">
              <MinusIcon />
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(9, q + 1))} aria-label="Aumenta">
              <PlusIcon />
            </button>
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              onAdd(item, config, quantity);
              onClose();
            }}
          >
            Aggiungi — {formatPrice(price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
