import { useCallback, useMemo, useState } from "react";
import type { CartLine, CartLineConfig, MenuItem } from "../data/types";
import { unitPrice } from "../lib/pricing";

export type OrderType = "asporto" | "qui";
export type Stage = "idle" | "orderType" | "menu" | "checkout" | "confirmation";

let lineCounter = 0;

export function useOrder() {
  const [stage, setStage] = useState<Stage>("idle");
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const addToCart = useCallback((item: MenuItem, config: CartLineConfig, quantity: number) => {
    const price = unitPrice(item, config);
    setCart((prev) => [
      ...prev,
      { lineId: `line-${++lineCounter}`, item, quantity, config, unitPrice: price },
    ]);
  }, []);

  const updateQuantity = useCallback((lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.lineId === lineId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setCart((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const resetOrder = useCallback(() => {
    setCart([]);
    setOrderType(null);
    setOrderNumber(null);
    setStage("idle");
  }, []);

  const startOrder = useCallback(() => setStage("orderType"), []);

  const chooseOrderType = useCallback((type: OrderType) => {
    setOrderType(type);
    setStage("menu");
  }, []);

  const goToCheckout = useCallback(() => setStage("checkout"), []);
  const backToMenu = useCallback(() => setStage("menu"), []);

  const confirmOrder = useCallback(() => {
    const num = 100 + Math.floor(Math.random() * 800);
    setOrderNumber(num);
    setStage("confirmation");
  }, []);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    const itemCount = cart.reduce((s, l) => s + l.quantity, 0);
    return { subtotal: Math.round(subtotal * 100) / 100, itemCount };
  }, [cart]);

  return {
    stage,
    setStage,
    orderType,
    cart,
    orderNumber,
    totals,
    addToCart,
    updateQuantity,
    removeLine,
    resetOrder,
    startOrder,
    chooseOrderType,
    goToCheckout,
    backToMenu,
    confirmOrder,
  };
}

export type OrderApi = ReturnType<typeof useOrder>;
