import type { ReactNode } from "react";
import styles from "./stage.module.css";

interface StageProps {
  children: ReactNode;
  /** Sliders and toggles that drive the chart, placed under it. */
  controls?: ReactNode;
  /** Live numbers that answer the controls. */
  readouts?: ReactNode;
  caption?: ReactNode;
}

/** The interactive half of a slide: chart, then readouts, then the controls. */
export function Stage({ children, controls, readouts, caption }: StageProps) {
  return (
    <figure className={styles.stage}>
      <div className={styles.canvas}>{children}</div>
      {readouts}
      {controls && <div className={styles.controls}>{controls}</div>}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
