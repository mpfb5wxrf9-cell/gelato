import { useCallback, useMemo, useState } from "react";
import {
  BASES,
  DECORATIONS,
  EXTRAS,
  FLAVORS,
  GLAZES,
  MAX_FLAVORS,
} from "../data/options";

export type TabId = "base" | "gusti" | "decorazioni" | "glassa" | "extra";

export interface Notice {
  id: number;
  text: string;
}

export function useGelatoBuilder() {
  const [baseId, setBaseId] = useState<string>(BASES[0].id);
  const [flavorIds, setFlavorIds] = useState<string[]>(["pistacchio", "fragola"]);
  const [decorationIds, setDecorationIds] = useState<string[]>([]);
  const [glazeId, setGlazeId] = useState<string | null>(null);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("gusti");
  const [notice, setNotice] = useState<Notice | null>(null);

  const showNotice = useCallback((text: string) => {
    setNotice({ id: Date.now(), text });
  }, []);

  const toggleFlavor = useCallback(
    (id: string) => {
      setFlavorIds((prev) => {
        if (prev.includes(id)) return prev.filter((f) => f !== id);
        if (prev.length >= MAX_FLAVORS) {
          showNotice(`Puoi scegliere al massimo ${MAX_FLAVORS} gusti`);
          return prev;
        }
        return [...prev, id];
      });
    },
    [showNotice]
  );

  const toggleDecoration = useCallback((id: string) => {
    setDecorationIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }, []);

  const toggleExtra = useCallback((id: string) => {
    setExtraIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }, []);

  const setGlaze = useCallback((id: string) => {
    setGlazeId((prev) => (prev === id ? null : id));
  }, []);

  const reset = useCallback(() => {
    setBaseId(BASES[0].id);
    setFlavorIds([]);
    setDecorationIds([]);
    setGlazeId(null);
    setExtraIds([]);
    setActiveTab("gusti");
    showNotice("Hai iniziato un nuovo gelato");
  }, [showNotice]);

  const randomize = useCallback(() => {
    const pickSome = <T,>(arr: T[], min: number, max: number) => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      const count = Math.floor(Math.random() * (max - min + 1)) + min;
      return shuffled.slice(0, count);
    };
    setBaseId(BASES[Math.floor(Math.random() * BASES.length)].id);
    setFlavorIds(pickSome(FLAVORS, 1, MAX_FLAVORS).map((f) => f.id));
    setDecorationIds(pickSome(DECORATIONS, 0, 2).map((d) => d.id));
    setExtraIds(pickSome(EXTRAS, 0, 2).map((e) => e.id));
    const shouldGlaze = Math.random() > 0.35;
    setGlazeId(
      shouldGlaze ? GLAZES[Math.floor(Math.random() * GLAZES.length)].id : null
    );
    showNotice("Ecco una combinazione a sorpresa");
  }, [showNotice]);

  const selected = useMemo(() => {
    const base = BASES.find((b) => b.id === baseId) ?? BASES[0];
    const flavors = flavorIds
      .map((id) => FLAVORS.find((f) => f.id === id))
      .filter((f): f is (typeof FLAVORS)[number] => Boolean(f));
    const decorations = decorationIds
      .map((id) => DECORATIONS.find((d) => d.id === id))
      .filter((d): d is (typeof DECORATIONS)[number] => Boolean(d));
    const glaze = glazeId ? GLAZES.find((g) => g.id === glazeId) ?? null : null;
    const extras = extraIds
      .map((id) => EXTRAS.find((e) => e.id === id))
      .filter((e): e is (typeof EXTRAS)[number] => Boolean(e));
    return { base, flavors, decorations, glaze, extras };
  }, [baseId, flavorIds, decorationIds, glazeId, extraIds]);

  const total = useMemo(() => {
    const { base, flavors, decorations, glaze, extras } = selected;
    return (
      base.price +
      flavors.reduce((s, f) => s + f.price, 0) +
      decorations.reduce((s, d) => s + d.price, 0) +
      (glaze ? glaze.price : 0) +
      extras.reduce((s, e) => s + e.price, 0)
    );
  }, [selected]);

  const compositionKey = useMemo(
    () =>
      [
        baseId,
        flavorIds.join("-"),
        decorationIds.join("-"),
        glazeId ?? "none",
        extraIds.join("-"),
      ].join("|"),
    [baseId, flavorIds, decorationIds, glazeId, extraIds]
  );

  return {
    baseId,
    setBaseId,
    flavorIds,
    toggleFlavor,
    decorationIds,
    toggleDecoration,
    glazeId,
    setGlaze,
    extraIds,
    toggleExtra,
    activeTab,
    setActiveTab,
    selected,
    total,
    compositionKey,
    reset,
    randomize,
    notice,
  };
}

export type GelatoBuilder = ReturnType<typeof useGelatoBuilder>;
