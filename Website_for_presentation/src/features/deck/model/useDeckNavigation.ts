import { useCallback, useEffect, useRef, useState } from "react";

const SLIDE_SELECTOR = "[data-slide]";

/**
 * Keys a focused control may need for itself. PageUp and PageDown always change slides,
 * since that is what a clicker sends.
 */
const CONTROL_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", " "]);

/** Fields that read typed text keep every control key. */
const TEXT_FIELD = "textarea, select, [contenteditable], input:not([type=range]):not([type=radio]):not([type=checkbox])";

/**
 * Whether the focused element should keep this key instead of changing slides.
 * A button only needs Space. A slider or radio keeps the arrows when reached with the
 * keyboard, but after a mouse click the arrows go back to the slides, so a presenter
 * who clicks a control is not stuck on that slide.
 */
function controlOwnsKey(target: EventTarget | null, key: string, focusedByPointer: boolean): boolean {
  if (!CONTROL_KEYS.has(key) || !(target instanceof HTMLElement)) return false;
  if (target.closest(TEXT_FIELD)) return true;
  if (target.closest("button")) return key === " ";
  if (target.matches("input")) return key === " " || !focusedByPointer;
  return false;
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

  // browsers count a clicked slider as :focus-visible, so track where focus came from
  const focusedByPointer = useRef(false);
  useEffect(() => {
    let pointerDown = false;
    const onPointer = () => {
      pointerDown = true;
    };
    const onTab = (event: KeyboardEvent) => {
      if (event.key === "Tab") pointerDown = false;
    };
    const onFocus = () => {
      focusedByPointer.current = pointerDown;
    };
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onTab, true);
    window.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onTab, true);
      window.removeEventListener("focusin", onFocus);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (controlOwnsKey(event.target, event.key, focusedByPointer.current)) return;

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
