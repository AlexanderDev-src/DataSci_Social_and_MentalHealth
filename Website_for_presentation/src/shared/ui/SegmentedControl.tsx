import { useId, type CSSProperties } from "react";
import styles from "./controls.module.css";

export interface Option<T extends string> {
  value: T;
  label: string;
  /** Underline colour of the chosen option, e.g. a DASS-21 dimension colour. */
  color?: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Hide the group label visually; screen readers still announce it. */
  hideLabel?: boolean;
}

/** One choice out of a few, as a row of radio buttons styled like tabs. */
export function SegmentedControl<T extends string>({ label, options, value, onChange, hideLabel }: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <fieldset className={styles.segmented}>
      <legend className={hideLabel ? "visually-hidden" : styles.legend}>{label}</legend>
      <div className={styles.segments}>
        {options.map((option) => (
          <label
            key={option.value}
            className={styles.segment}
            style={{ "--accent": option.color ?? "var(--ink)" } as CSSProperties}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
