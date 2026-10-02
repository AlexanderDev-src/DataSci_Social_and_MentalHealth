import type { ReactNode } from "react";
import styles from "./controls.module.css";

export interface ReadoutItem {
  label: ReactNode;
  value: ReactNode;
  color?: string;
}

/** A row of live numbers under a chart; announced politely when they change. */
export function Readouts({ items }: { items: readonly ReadoutItem[] }) {
  return (
    <dl className={styles.readouts} aria-live="polite">
      {items.map((item, i) => (
        <div key={i} className={styles.readout}>
          <dt>{item.label}</dt>
          <dd style={item.color ? { color: item.color } : undefined}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
