import { useId, type CSSProperties, type ReactNode } from "react";
import styles from "./controls.module.css";

interface RangeSliderProps {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Text shown next to the label; defaults to the raw value. */
  display?: string;
  /** Marks a reference point on the track, such as the sample mean. */
  mark?: { value: number; label: string };
  hint?: ReactNode;
}

export function RangeSlider({ label, value, min, max, step, onChange, display, mark, hint }: RangeSliderProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  const markAt = mark ? ((mark.value - min) / (max - min)) * 100 : undefined;

  return (
    <div className={styles.slider}>
      <div className={styles.sliderHead}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="num">
          {display ?? value}
        </output>
      </div>
      <div className={styles.track} style={{ "--fill": `${fill}%` } as CSSProperties}>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={display}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
        />
        {markAt !== undefined && (
          <span className={styles.mark} style={{ left: `${markAt}%` }} title={mark?.label} aria-hidden="true" />
        )}
      </div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}
