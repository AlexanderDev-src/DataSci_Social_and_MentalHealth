import { DECIMAL_DIGIT_SHARE, QUALITY_CHECKS, SOURCE_LABEL, type Source } from "@data/dataQuality";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisBottom, AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatPercent } from "@shared/format";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import styles from "./syntheticCheck.module.css";

const W = 720;
const H = 330;
const M = { top: 36, right: 16, bottom: 64, left: 56 };
const DIGITS = Array.from({ length: 10 }, (_, d) => d);
const SOURCES: readonly Source[] = ["kaggle", "survey"];

/** Flip between the Kaggle data and our survey; real people answer in round numbers. */
export function SyntheticCheck() {
  const [source, setSource] = useState<Source>("kaggle");
  const shares = useTweenedValues(DECIMAL_DIGIT_SHARE[source]);

  const x = linearScale([0, 10], [M.left, W - M.right]);
  const y = linearScale([0, 0.7], [H - M.bottom, M.top]);
  const band = x(1) - x(0);

  return (
    <Stage
      controls={
        <SegmentedControl
          label="ดูข้อมูลจาก"
          options={SOURCES.map((s) => ({ value: s, label: SOURCE_LABEL[s] }))}
          value={source}
          onChange={setSource}
        />
      }
      readouts={
        <dl className={styles.checks} aria-live="polite">
          {QUALITY_CHECKS.map((check) => (
            <div key={check.key}>
              <dt>{check.label}</dt>
              <dd>{check[source]}</dd>
            </div>
          ))}
        </dl>
      }
    >
      <Chart width={W} height={H} label={`สัดส่วนทศนิยมหลักแรกของชั่วโมงใช้งาน ${SOURCE_LABEL[source]}`}>
        <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 0.2, 0.4, 0.6]} format={(v) => formatPercent(v, 0)} />
        <line className={styles.uniform} x1={M.left} x2={W - M.right} y1={y(0.1)} y2={y(0.1)} />
        <text className={styles.uniformLabel} x={W - M.right} y={M.top - 14} textAnchor="end">
          เส้นประ: ถ้าสุ่มด้วยโปรแกรม ทุกหลักได้ 10%
        </text>
        {DIGITS.map((d) => (
          <rect
            key={d}
            className={styles.bar}
            x={x(d) + band * 0.15}
            width={band * 0.7}
            y={y(shares[d])}
            height={y(0) - y(shares[d])}
          />
        ))}
        {DIGITS.map((d) => (
          <text key={d} className={styles.value} x={x(d) + band / 2} y={y(shares[d]) - 8} textAnchor="middle">
            {shares[d] >= 0.005 ? formatPercent(shares[d], 0) : ""}
          </text>
        ))}
        <AxisBottom
          scale={x}
          at={H - M.bottom}
          ticks={DIGITS.map((d) => d + 0.5)}
          format={(v) => `.${v - 0.5}`}
          title="ทศนิยมหลักแรกของชั่วโมงที่ตอบ เช่น 7.5 คือ .5"
        />
      </Chart>
    </Stage>
  );
}
