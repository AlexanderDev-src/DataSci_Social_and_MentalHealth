import { useCallback, useEffect, useState } from "react";

const SLIDE_SELECTOR = "[data-slide]";

/**
 * Keys a slider or button needs for itself; they only change slides when no control
 * is focused. PageUp and PageDown always change slides, since that is what a clicker sends.
 */
const CONTROL_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", " "]);

function isControl(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest("input, button, select, textarea, [contenteditable]") !== null;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface DeckNavigation {
  index: number;
  total: number;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
}

/**
 * Slides are plain sections in one scrolling page. This hook works out which one
 * fills the screen, keeps the URL hash on it, and moves between them with the
 * keyboard or a presentation clicker (which sends PageUp and PageDown).
 */
export function useDeckNavigation(): DeckNavigation {
  const [slides, setSlides] = useState<HTMLElement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setSlides(Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR)));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = slides.indexOf(entry.target as HTMLElement);
          setIndex(i);
          history.replaceState(null, "", `#${slides[i].id}`);
        }
      },
      // the slide crossing the middle of the screen is the current one, however tall it is
      { rootMargin: "-50% 0px -50% 0px" },
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [slides]);

  const goTo = useCallback(
    (target: number) => {
      const slide = slides[Math.max(0, Math.min(slides.length - 1, target))];
      slide?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    },
    [slides],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (CONTROL_KEYS.has(event.key) && isControl(event.target)) return;

      const actions: Record<string, () => void> = {
        ArrowRight: next,
        ArrowDown: next,
        PageDown: next,
        " ": next,
        ArrowLeft: previous,
        ArrowUp: previous,
        PageUp: previous,
        Home: () => goTo(0),
        End: () => goTo(slides.length - 1),
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, next, previous, slides.length]);

  return { index, total: slides.length, goTo, next, previous };
}
