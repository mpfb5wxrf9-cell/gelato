import type { CartLineConfig, MenuItem } from "../data/types";
import { DRINK_FLAVORS, NUGGET_SAUCES } from "../data/menu";

export function describeLine(item: MenuItem, config: CartLineConfig): string {
  const parts: string[] = [];

  if (config.isMenu) parts.push("Menu completo");

  if (config.sizeId && item.sizes) {
    const size = item.sizes.find((s) => s.id === config.sizeId);
    if (size) parts.push(size.label);
  }

  if (config.flavorId) {
    const flavor = DRINK_FLAVORS.find((f) => f.id === config.flavorId);
    if (flavor) parts.push(flavor.label);
  }

  if (config.sauceId) {
    const sauce = NUGGET_SAUCES.find((s) => s.id === config.sauceId);
    if (sauce) parts.push(`Salsa ${sauce.label}`);
  }

  if (config.removedIngredients.length && item.ingredients) {
    const labels = config.removedIngredients
      .map((id) => item.ingredients!.find((ing) => ing.id === id)?.label)
      .filter(Boolean);
    if (labels.length) parts.push("Senza " + labels.join(", "));
  }

  if (config.extraIds.length && item.extras) {
    const labels = config.extraIds
      .map((id) => item.extras!.find((e) => e.id === id)?.label)
      .filter(Boolean);
    if (labels.length) parts.push("+ " + labels.join(", "));
  }

  return parts.join(" • ");
}
