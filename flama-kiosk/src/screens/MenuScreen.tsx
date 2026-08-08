import { useMemo, useState, type ComponentType } from "react";
import { CATEGORIES, MENU_ITEMS } from "../data/menu";
import type { CategoryId, MenuItem } from "../data/types";
import FoodArt from "../art/FoodArt";
import CartPanel from "../components/CartPanel";
import CustomizeModal from "../components/CustomizeModal";
import { formatPrice } from "../lib/pricing";
import {
  CatMenuIcon,
  CatBurgerIcon,
  CatChickenIcon,
  CatFriesIcon,
  CatDrinkIcon,
  CatDessertIcon,
  CartIcon,
  RestartIcon,
  TrayIcon,
  BagIcon,
} from "../components/Icons";
import type { OrderApi } from "../hooks/useOrder";

interface MenuScreenProps {
  order: OrderApi;
  onRestart: () => void;
}

const CATEGORY_ICONS: Record<CategoryId, ComponentType<{ className?: string }>> = {
  menu: CatMenuIcon,
  burger: CatBurgerIcon,
  pollo: CatChickenIcon,
  contorni: CatFriesIcon,
  bevande: CatDrinkIcon,
  dolci: CatDessertIcon,
};

export default function MenuScreen({ order, onRestart }: MenuScreenProps) {
  const [category, setCategory] = useState<CategoryId>("menu");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const items = useMemo(() => {
    if (category === "menu") return MENU_ITEMS.filter((m) => m.canBeMenu);
    return MENU_ITEMS.filter((m) => m.category === category);
  }, [category]);

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label ?? "";

  return (
    <div className="menu-screen">
      <div className="step-topbar">
        <span className="step-brand">FLAMA</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--ink-soft)",
            }}
          >
            {order.orderType === "qui" ? <TrayIcon className="icon-18" /> : <BagIcon className="icon-18" />}
            {order.orderType === "qui" ? "Mangi qui" : "Porti via"}
          </span>
          <button className="step-restart" type="button" onClick={onRestart}>
            <RestartIcon />
            Ricomincia
          </button>
        </div>
      </div>

      <div className="menu-body">
        <nav className="category-rail">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${category === cat.id ? "active" : ""}`}
                onClick={() => setCategory(cat.id)}
              >
                <Icon />
                {cat.label}
              </button>
            );
          })}
        </nav>

        <div className="item-grid">
          <h2 className="item-grid-heading">{categoryLabel}</h2>
          <div className="item-grid-cards">
            {items.map((item) => (
              <button className="item-card" type="button" key={item.id} onClick={() => setActiveItem(item)}>
                {item.badge && <span className={`item-card-badge ${item.badge}`}>{item.badge === "popolare" ? "Popolare" : "Novità"}</span>}
                <FoodArt art={item.art} className="item-card-art" />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="item-card-price">
                  <strong>
                    {category === "menu" && item.menuUpcharge
                      ? formatPrice(item.price + item.menuUpcharge)
                      : formatPrice(item.price)}
                  </strong>
                  <span className="item-card-add" aria-hidden="true">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <CartPanel order={order} className={cartOpen ? "open" : ""} />
      </div>

      <button className="cart-fab" type="button" onClick={() => setCartOpen(true)}>
        <CartIcon />
        Carrello
        {order.totals.itemCount > 0 && <span className="cart-fab-badge">{order.totals.itemCount}</span>}
      </button>

      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(36,31,28,0.3)" }}
        />
      )}

      {activeItem && (
        <CustomizeModal
          item={activeItem}
          startAsMenu={category === "menu"}
          onClose={() => setActiveItem(null)}
          onAdd={(item, config, qty) => order.addToCart(item, config, qty)}
        />
      )}
    </div>
  );
}
