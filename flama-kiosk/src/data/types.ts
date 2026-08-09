export type CategoryId = "menu" | "burger" | "pollo" | "contorni" | "bevande" | "dolci";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Ingredient {
  id: string;
  label: string;
  defaultOn: boolean;
}

export interface Extra {
  id: string;
  label: string;
  price: number;
}

export interface SizeOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface FlavorOption {
  id: string;
  label: string;
  liquidColor: string;
  lidColor: string;
}

export interface SauceOption {
  id: string;
  label: string;
  color: string;
}

export type ArtSpec =
  | {
      kind: "burger";
      patty: "beef" | "chicken" | "veggie" | "fish";
      cheese: boolean;
      bacon: boolean;
      bunTop: "sesame" | "plain";
      double?: boolean;
    }
  | { kind: "fries" }
  | { kind: "nuggets" }
  | { kind: "drink" }
  | { kind: "sundae" }
  | { kind: "pie" }
  | { kind: "wrap" }
  | { kind: "cheesebites" }
  | { kind: "hashbrown" }
  | { kind: "hotdrink" }
  | { kind: "pastry" };

export interface CartLineConfig {
  isMenu: boolean;
  sizeId: string | null;
  flavorId: string | null;
  sauceId: string | null;
  removedIngredients: string[];
  extraIds: string[];
}

export interface CartLine {
  lineId: string;
  item: MenuItem;
  quantity: number;
  config: CartLineConfig;
  unitPrice: number;
}

export interface MenuItem {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  price: number;
  art: ArtSpec;
  badge?: "popolare" | "novita";
  canBeMenu?: boolean;
  menuUpcharge?: number;
  ingredients?: Ingredient[];
  extras?: Extra[];
  sizes?: SizeOption[];
  isNuggets?: boolean;
  flavorOptions?: FlavorOption[];
  flavorLabel?: string;
}
