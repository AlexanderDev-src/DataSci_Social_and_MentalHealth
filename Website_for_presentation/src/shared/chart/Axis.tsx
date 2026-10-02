import type { LinearScale } from "./scale";
import styles from "./chart.module.css";

interface AxisProps {
  scale: LinearScale;
  /** Where the axis line sits on the other axis, in SVG units. */
  at: number;
  /** Far end of the gridlines on the other axis; omit for no gridlines. */
  gridTo?: number;
  ticks?: number[];
  format?: (value: number) => string;
  title?: string;
}

const plain = (v: number) => String(v);

export function AxisBottom({ scale, at, gridTo, ticks = scale.ticks(), format = plain, title }: AxisProps) {
  const [x0, x1] = scale.range;
  return (
    <g className={styles.axis}>
      {ticks.map((t) => (
        <g key={t} transform={`translate(${scale(t)},0)`}>
          {gridTo !== undefined && <line className={styles.grid} y1={at} y2={gridTo} />}
          <text y={at + 22} textAnchor="middle">
            {format(t)}
          </text>
        </g>
      ))}
      <line className={styles.baseline} x1={x0} x2={x1} y1={at} y2={at} />
      {title && (
        <text className={styles.title} x={x1} y={at + 50} textAnchor="end">
          {title}
        </text>
      )}
    </g>
  );
}

export function AxisLeft({ scale, at, gridTo, ticks = scale.ticks(), format = plain, title }: AxisProps) {
  const [y0, y1] = scale.range;
  return (
    <g className={styles.axis}>
      {ticks.map((t) => (
        <g key={t} transform={`translate(0,${scale(t)})`}>
          {gridTo !== undefined && <line className={styles.grid} x1={at} x2={gridTo} />}
          <text x={at - 10} dy="0.35em" textAnchor="end">
            {format(t)}
          </text>
        </g>
      ))}
      <line className={styles.baseline} x1={at} x2={at} y1={y0} y2={y1} />
      {title && (
        <text className={styles.title} x={at - 10} y={Math.min(y0, y1) - 16} textAnchor="start">
          {title}
        </text>
      )}
    </g>
  );
}
