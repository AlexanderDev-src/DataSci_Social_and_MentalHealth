import { useEffect, type CSSProperties } from "react";
import { useDeckNavigation } from "../model/useDeckNavigation";
import { useFullscreen, useTheme } from "../model/useDisplayMode";
import styles from "./deck.module.css";

/** Progress line, slide counter and the few buttons a presenter needs. */
export function DeckController() {
  const { index, total, next, previous } = useDeckNavigation();
  const theme = useTheme();
  const fullscreen = useFullscreen();
  const toggleTheme = theme.toggle;
  const toggleFullscreen = fullscreen.toggle;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "f") toggleFullscreen();
      if (event.key === "t") toggleTheme();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen, toggleTheme]);

  const progress = total > 0 ? (index + 1) / total : 0;

  return (
    <nav className={styles.deck} aria-label="ควบคุมสไลด์">
      <div className={styles.progress} style={{ "--progress": progress } as CSSProperties} aria-hidden="true" />
      <div className={styles.bar}>
        <button type="button" onClick={previous} disabled={index === 0} aria-label="สไลด์ก่อนหน้า">
          ‹
        </button>
        <span className={`${styles.counter} num`} aria-live="polite">
          {index + 1} / {total || "–"}
        </span>
        <button type="button" onClick={next} disabled={index >= total - 1} aria-label="สไลด์ถัดไป">
          ›
        </button>
        <button type="button" onClick={theme.toggle} aria-pressed={theme.theme === "dark"} title="สลับพื้นมืด (T)">
          {theme.theme === "dark" ? "พื้นสว่าง" : "พื้นมืด"}
        </button>
        <button type="button" onClick={fullscreen.toggle} aria-pressed={fullscreen.active} title="เต็มจอ (F)">
          {fullscreen.active ? "ออกจากเต็มจอ" : "เต็มจอ"}
        </button>
      </div>
    </nav>
  );
}
