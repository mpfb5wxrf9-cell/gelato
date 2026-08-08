export type Texture = "fleck" | "swirl" | "chip" | "seed" | "grain" | "plain";

export interface Base {
  id: string;
  label: string;
  desc: string;
  price: number;
}

export interface Flavor {
  id: string;
  label: string;
  desc: string;
  main: string;
  shade: string;
  highlight: string;
  fleckColor: string;
  texture: Texture;
  price: number;
}

export interface Decoration {
  id: string;
  label: string;
  swatch: string;
  price: number;
}

export interface Glaze {
  id: string;
  label: string;
  color: string;
  colorDark: string;
  price: number;
}

export interface Extra {
  id: string;
  label: string;
  swatch: string;
  price: number;
}

export const BASES: Base[] = [
  { id: "cono", label: "Cono", desc: "Cialda croccante", price: 2.5 },
  { id: "coppetta", label: "Coppetta", desc: "Nella vaschetta", price: 2.8 },
];

export const FLAVORS: Flavor[] = [
  {
    id: "pistacchio",
    label: "Pistacchio",
    desc: "Bronte, tostato",
    main: "#8CA85E",
    shade: "#6B8944",
    highlight: "#C4D89A",
    fleckColor: "#4E6B31",
    texture: "fleck",
    price: 1.6,
  },
  {
    id: "cioccolato",
    label: "Cioccolato fondente",
    desc: "Cacao 70%",
    main: "#6B4128",
    shade: "#48291A",
    highlight: "#9A6A48",
    fleckColor: "#2E1810",
    texture: "swirl",
    price: 1.6,
  },
  {
    id: "fragola",
    label: "Fragola",
    desc: "Frutta fresca",
    main: "#E4728C",
    shade: "#C24F6B",
    highlight: "#F5AEBE",
    fleckColor: "#8C2F45",
    texture: "seed",
    price: 1.5,
  },
  {
    id: "limone",
    label: "Limone",
    desc: "Sorbetto, senza latte",
    main: "#EFD25C",
    shade: "#D9B839",
    highlight: "#F8E89B",
    fleckColor: "#B99420",
    texture: "plain",
    price: 1.4,
  },
  {
    id: "nocciola",
    label: "Nocciola",
    desc: "Piemonte IGP",
    main: "#A97A50",
    shade: "#835D3B",
    highlight: "#D4AC80",
    fleckColor: "#5C3F26",
    texture: "chip",
    price: 1.7,
  },
  {
    id: "vaniglia",
    label: "Vaniglia",
    desc: "Bacca del Madagascar",
    main: "#F3E4C4",
    shade: "#DFC79C",
    highlight: "#FBF3E1",
    fleckColor: "#5C4A2E",
    texture: "fleck",
    price: 1.4,
  },
  {
    id: "mirtillo",
    label: "Mirtillo",
    desc: "Frutti di bosco",
    main: "#6A4C93",
    shade: "#4E3670",
    highlight: "#A587C4",
    fleckColor: "#2E1F45",
    texture: "swirl",
    price: 1.6,
  },
  {
    id: "menta",
    label: "Menta e cioccolato",
    desc: "Fresca, gocce fondenti",
    main: "#7FBFA0",
    shade: "#5A9A7C",
    highlight: "#B7E0C9",
    fleckColor: "#2E4A3A",
    texture: "chip",
    price: 1.6,
  },
  {
    id: "caffe",
    label: "Caffè",
    desc: "Espresso torrefatto",
    main: "#4A3226",
    shade: "#301F16",
    highlight: "#7A5A46",
    fleckColor: "#1C120C",
    texture: "swirl",
    price: 1.5,
  },
  {
    id: "cocco",
    label: "Cocco",
    desc: "Polpa fresca",
    main: "#F6F1E4",
    shade: "#E3DAC2",
    highlight: "#FFFCF6",
    fleckColor: "#C9BE9E",
    texture: "grain",
    price: 1.5,
  },
];

export const DECORATIONS: Decoration[] = [
  { id: "zuccherini", label: "Zuccherini colorati", swatch: "conic-gradient(from 90deg, #E4728C, #EFD25C, #7FBFA0, #6A4C93, #E4728C)", price: 0.6 },
  { id: "nocciole", label: "Granella di nocciole", swatch: "#8A6540", price: 0.7 },
  { id: "scaglie", label: "Scaglie di cioccolato", swatch: "#3B241A", price: 0.7 },
  { id: "cocco-rape", label: "Cocco rapé", swatch: "#F8F4E8", price: 0.6 },
];

export const GLAZES: Glaze[] = [
  { id: "cioccolato-g", label: "Cioccolato", color: "#5A3620", colorDark: "#3A2213", price: 0.8 },
  { id: "caramello", label: "Caramello salato", color: "#C4842E", colorDark: "#96601D", price: 0.8 },
  { id: "fragola-g", label: "Fragola", color: "#D9536F", colorDark: "#A5354C", price: 0.8 },
  { id: "pistacchio-g", label: "Pistacchio", color: "#8CA85E", colorDark: "#5F7C3B", price: 0.8 },
];

export const EXTRAS: Extra[] = [
  { id: "panna", label: "Panna montata", swatch: "#FFFDF8", price: 0.9 },
  { id: "amarena", label: "Amarena", swatch: "#8E1B2E", price: 0.6 },
  { id: "cialda", label: "Stecco di cialda", swatch: "#D9A45C", price: 0.5 },
];

export const MAX_FLAVORS = 3;
