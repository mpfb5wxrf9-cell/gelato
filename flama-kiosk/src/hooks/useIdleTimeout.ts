import { useEffect, useRef } from "react";

export function useIdleTimeout(active: boolean, timeoutMs: number, onIdle: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;

    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(onIdle, timeoutMs);
    };

    reset();
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel"];
    events.forEach((ev) => window.addEventListener(ev, reset));

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [active, timeoutMs, onIdle]);
}
