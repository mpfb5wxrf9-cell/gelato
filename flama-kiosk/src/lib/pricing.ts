import type { CartLineConfig, MenuItem } from "../data/types";
import { DRINK_FLAVORS } from "../data/menu";

export const COMBO_LARGE_UPCHARGE = 0.6;

export function unitPrice(item: MenuItem, config: CartLineConfig): number {
  let price = item.price;

  if (config.isMenu && item.menuUpcharge) {
    price += item.menuUpcharge;
  }

  if (config.isMenu && !item.sizes && config.sizeId === "l") {
    price += COMBO_LARGE_UPCHARGE;
  }

  if (config.sizeId && item.sizes) {
    const size = item.sizes.find((s) => s.id === config.sizeId);
    if (size) price += size.priceDelta;
  }

  if (config.extraIds.length && item.extras) {
    for (const extraId of config.extraIds) {
      const extra = item.extras.find((e) => e.id === extraId);
      if (extra) price += extra.price;
    }
  }

  return Math.round(price * 100) / 100;
}

export function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",") + " €";
}

export function defaultConfig(item: MenuItem): CartLineConfig {
  const defaultSize = item.sizes ? item.sizes.find((s) => s.id === "m")?.id ?? item.sizes[0].id : null;
  return {
    isMenu: false,
    sizeId: defaultSize,
    flavorId: DRINK_FLAVORS[0].id,
    sauceId: item.isNuggets ? "ketchup" : null,
    removedIngredients: [],
    extraIds: [],
  };
}
