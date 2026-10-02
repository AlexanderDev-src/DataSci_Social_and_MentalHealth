import type { ReactNode } from "react";
import styles from "./chart.module.css";

interface ChartProps {
  width: number;
  height: number;
  /** What the chart shows, for screen readers. */
  label: string;
  children: ReactNode;
}

/** An SVG canvas in its own coordinate system; it scales to the column it sits in. */
export function Chart({ width, height, label, children }: ChartProps) {
  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {children}
    </svg>
  );
}
