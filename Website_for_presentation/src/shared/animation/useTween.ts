import { useEffect, useRef, useState } from "react";

const DURATION_MS = 450;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Glides a list of numbers from where they are to `target`, so a chart shows what
 * moved after a slider or toggle changes. Jumps straight there under reduced motion.
 */
export function useTweenedValues(target: readonly number[], duration = DURATION_MS): number[] {
  const [current, setCurrent] = useState<number[]>(() => [...target]);
  const shown = useRef<number[]>(current);
  // the joined key stands in for the array, which callers rebuild every render
  const key = target.join(",");

  useEffect(() => {
    const show = (values: number[]) => {
      shown.current = values;
      setCurrent(values);
    };
    if (prefersReducedMotion()) {
      show([...target]);
      return;
    }
    const from = shown.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const k = easeOutCubic(t);
      show(target.map((to, i) => (from[i] ?? to) + (to - (from[i] ?? to)) * k));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [key, duration]);

  return current;
}

export function useTweenedValue(target: number, duration = DURATION_MS): number {
  return useTweenedValues([target], duration)[0];
}
