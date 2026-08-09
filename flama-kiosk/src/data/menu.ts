import type { Category, MenuItem, FlavorOption, SauceOption, SizeOption, Ingredient, Extra } from "./types";

export const CATEGORIES: Category[] = [
  { id: "menu", label: "Menu" },
  { id: "burger", label: "Burger" },
  { id: "pollo", label: "Pollo" },
  { id: "contorni", label: "Contorni" },
  { id: "bevande", label: "Bevande" },
  { id: "dolci", label: "Dolci" },
];

export const DRINK_FLAVORS: FlavorOption[] = [
  { id: "cola", label: "Cola", liquidColor: "#3B1E14", lidColor: "#C1272D" },
  { id: "aranciata", label: "Aranciata", liquidColor: "#E8871E", lidColor: "#E8871E" },
  { id: "limonata", label: "Limonata", liquidColor: "#D9D24A", lidColor: "#D9D24A" },
  { id: "acqua", label: "Acqua naturale", liquidColor: "#BFE0EA", lidColor: "#4E9CB5" },
];

export const MILKSHAKE_FLAVORS: FlavorOption[] = [
  { id: "vaniglia", label: "Vaniglia", liquidColor: "#F5EAD1", lidColor: "#E8D7A8" },
  { id: "fragola", label: "Fragola", liquidColor: "#E85C7A", lidColor: "#E85C7A" },
  { id: "cioccolato", label: "Cioccolato", liquidColor: "#5C3A24", lidColor: "#5C3A24" },
];

export const NUGGET_SAUCES: SauceOption[] = [
  { id: "bbq", label: "Barbecue", color: "#6B3416" },
  { id: "curry", label: "Curry", color: "#D8A324" },
  { id: "sweet-chili", label: "Sweet chili", color: "#C1392B" },
  { id: "ketchup", label: "Ketchup", color: "#B3231C" },
];

export const DRINK_SIZES: SizeOption[] = [
  { id: "m", label: "Media", priceDelta: 0 },
  { id: "l", label: "Grande", priceDelta: 0.6 },
];

export const FRIES_SIZES: SizeOption[] = [
  { id: "s", label: "Piccole", priceDelta: -0.6 },
  { id: "m", label: "Medie", priceDelta: 0 },
  { id: "l", label: "Grandi", priceDelta: 0.7 },
];

export const NUGGET_SIZES: SizeOption[] = [
  { id: "6", label: "6 pezzi", priceDelta: 0 },
  { id: "9", label: "9 pezzi", priceDelta: 1.5 },
  { id: "20", label: "20 pezzi", priceDelta: 5.2 },
];

const BEEF_INGREDIENTS: Ingredient[] = [
  { id: "lattuga", label: "Lattuga", defaultOn: true },
  { id: "pomodoro", label: "Pomodoro", defaultOn: true },
  { id: "cetriolini", label: "Cetriolini", defaultOn: true },
  { id: "cipolla", label: "Cipolla", defaultOn: true },
  { id: "formaggio", label: "Formaggio", defaultOn: true },
  { id: "salsa", label: "Salsa della casa", defaultOn: true },
];

const BURGER_EXTRAS: Extra[] = [
  { id: "extra-formaggio", label: "Extra formaggio", price: 0.9 },
  { id: "extra-bacon", label: "Extra bacon", price: 1.2 },
  { id: "extra-carne", label: "Extra carne", price: 2.0 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "smash-classic",
    category: "burger",
    name: "Smash Classic",
    description: "Manzo smash, formaggio cheddar, lattuga, pomodoro, cetriolini, cipolla, salsa della casa.",
    price: 5.9,
    art: { kind: "burger", patty: "beef", cheese: true, bacon: false, bunTop: "sesame" },
    badge: "popolare",
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: BEEF_INGREDIENTS,
    extras: BURGER_EXTRAS,
  },
  {
    id: "smash-bacon",
    category: "burger",
    name: "Smash Bacon Deluxe",
    description: "Doppio manzo smash, bacon croccante, cheddar fuso, cipolla caramellata, salsa affumicata.",
    price: 7.4,
    art: { kind: "burger", patty: "beef", cheese: true, bacon: true, bunTop: "sesame" },
    badge: "novita",
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: BEEF_INGREDIENTS,
    extras: BURGER_EXTRAS,
  },
  {
    id: "veggie-burger",
    category: "burger",
    name: "Veggie Garden",
    description: "Burger vegetale di legumi e verdure grigliate, formaggio, rucola, pomodoro, salsa yogurt.",
    price: 6.2,
    art: { kind: "burger", patty: "veggie", cheese: true, bacon: false, bunTop: "plain" },
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: [
      { id: "rucola", label: "Rucola", defaultOn: true },
      { id: "pomodoro", label: "Pomodoro", defaultOn: true },
      { id: "cipolla", label: "Cipolla rossa", defaultOn: true },
      { id: "formaggio", label: "Formaggio", defaultOn: true },
      { id: "salsa", label: "Salsa yogurt", defaultOn: true },
    ],
    extras: [
      { id: "extra-formaggio", label: "Extra formaggio", price: 0.9 },
      { id: "extra-avocado", label: "Avocado", price: 1.4 },
    ],
  },
  {
    id: "doppio-cheddar",
    category: "burger",
    name: "Doppio Cheddar",
    description: "Due smash di manzo, doppio cheddar fuso, cipolla, cetriolini, salsa della casa.",
    price: 7.9,
    art: { kind: "burger", patty: "beef", cheese: true, bacon: false, bunTop: "sesame", double: true },
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: BEEF_INGREDIENTS,
    extras: BURGER_EXTRAS,
  },
  {
    id: "ocean-crunch",
    category: "burger",
    name: "Ocean Crunch",
    description: "Filetto di pesce impanato croccante, lattuga, salsa tartara, panino morbido.",
    price: 6.4,
    art: { kind: "burger", patty: "fish", cheese: false, bacon: false, bunTop: "plain" },
    badge: "novita",
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: [
      { id: "lattuga", label: "Lattuga", defaultOn: true },
      { id: "salsa", label: "Salsa tartara", defaultOn: true },
    ],
    extras: [{ id: "extra-formaggio", label: "Extra formaggio", price: 0.9 }],
  },
  {
    id: "chicken-crunch",
    category: "pollo",
    name: "Chicken Crunch",
    description: "Petto di pollo impanato croccante, lattuga iceberg, maionese, panino morbido.",
    price: 6.5,
    art: { kind: "burger", patty: "chicken", cheese: false, bacon: false, bunTop: "plain" },
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: [
      { id: "lattuga", label: "Lattuga", defaultOn: true },
      { id: "salsa", label: "Maionese", defaultOn: true },
    ],
    extras: [{ id: "extra-formaggio", label: "Extra formaggio", price: 0.9 }],
  },
  {
    id: "chicken-wrap",
    category: "pollo",
    name: "Wrap di Pollo Piccante",
    description: "Striscioline di pollo speziate, insalata, pomodorini e salsa piccante in piadina morbida.",
    price: 5.5,
    art: { kind: "wrap" },
    canBeMenu: true,
    menuUpcharge: 3.0,
    ingredients: [
      { id: "insalata", label: "Insalata", defaultOn: true },
      { id: "pomodorini", label: "Pomodorini", defaultOn: true },
      { id: "salsa", label: "Salsa piccante", defaultOn: true },
    ],
  },
  {
    id: "nuggets",
    category: "pollo",
    name: "Chicken Nuggets",
    description: "Bocconcini di pollo croccanti, da accompagnare con la salsa che preferisci.",
    price: 3.9,
    art: { kind: "nuggets" },
    isNuggets: true,
    sizes: NUGGET_SIZES,
  },
  {
    id: "patatine",
    category: "contorni",
    name: "Patatine Fritte",
    description: "Tagliate a bastoncino, fritte croccanti fuori e morbide dentro, salate al punto giusto.",
    price: 2.6,
    art: { kind: "fries" },
    badge: "popolare",
    sizes: FRIES_SIZES,
  },
  {
    id: "onion-rings",
    category: "contorni",
    name: "Anelli di Cipolla",
    description: "Anelli di cipolla in pastella croccante, fritti dorati.",
    price: 3.2,
    art: { kind: "fries" },
  },
  {
    id: "insalata-mista",
    category: "contorni",
    name: "Insalata Mista",
    description: "Insalata fresca con pomodorini, carote e crostini croccanti.",
    price: 3.5,
    art: { kind: "fries" },
  },
  {
    id: "bocconcini-filanti",
    category: "contorni",
    name: "Bocconcini Filanti",
    description: "Bocconcini di formaggio impanati e fritti, filanti al morso.",
    price: 3.4,
    art: { kind: "cheesebites" },
    badge: "novita",
  },
  {
    id: "rosti-dorato",
    category: "contorni",
    name: "Rösti Dorato",
    description: "Tortino di patate grattugiate, dorato e croccante fuori, morbido dentro.",
    price: 2.3,
    art: { kind: "hashbrown" },
  },
  {
    id: "bibita",
    category: "bevande",
    name: "Bibita alla Spina",
    description: "Scegli il tuo gusto preferito, servita fresca con ghiaccio.",
    price: 2.2,
    art: { kind: "drink" },
    sizes: DRINK_SIZES,
  },
  {
    id: "caffe-americano",
    category: "bevande",
    name: "Caffè Americano",
    description: "Caffè filtro caldo, intenso e mai amaro.",
    price: 2.0,
    art: { kind: "hotdrink" },
  },
  {
    id: "milkshake",
    category: "dolci",
    name: "Milkshake",
    description: "Cremoso frappè al gusto vaniglia, fragola o cioccolato.",
    price: 3.6,
    art: { kind: "drink" },
    sizes: DRINK_SIZES,
    flavorOptions: MILKSHAKE_FLAVORS,
    flavorLabel: "Gusto",
  },
  {
    id: "sundae",
    category: "dolci",
    name: "Coppa Sundae",
    description: "Gelato soft vaniglia con topping caramello o cioccolato croccante.",
    price: 2.4,
    art: { kind: "sundae" },
    badge: "popolare",
  },
  {
    id: "apple-pie",
    category: "dolci",
    name: "Apple Pie",
    description: "Sfoglia calda e croccante con ripieno di mela cannella.",
    price: 1.9,
    art: { kind: "pie" },
  },
  {
    id: "cornetto-crema",
    category: "dolci",
    name: "Cornetto alla Crema",
    description: "Sfoglia burrosa e friabile, farcita con crema pasticcera.",
    price: 2.1,
    art: { kind: "pastry" },
  },
];
