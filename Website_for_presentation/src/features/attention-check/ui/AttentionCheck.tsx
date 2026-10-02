import type { SampleKey } from "@data/correlations";
import { SENSITIVITY } from "@data/sensitivity";
import { SURVEY } from "@data/survey";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisBottom } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatP } from "@shared/format";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import styles from "./attentionCheck.module.css";

const W = 720;
const H = 320;
const M = { top: 20, right: 24, bottom: 56, left: 24 };
const ROW = 76;
const ALPHA = 0.05;
const P_FLOOR = 0.0001;

const SAMPLES: { value: SampleKey; label: string }[] = [
  { value: "passed", label: `${SURVEY.analysed} คนที่ผ่านข้อดัก` },
  { value: "all", label: `รวมทุกคน ${SURVEY.responses} คน` },
];

/** Put the 14 inattentive respondents back in and watch which p-values cross 0.05. */
export function AttentionCheck() {
  const [sample, setSample] = useState<SampleKey>("passed");
  // p runs on a log axis: 0.0001 at the left, 1 at the right
  const logs = useTweenedValues(SENSITIVITY.map((s) => Math.log10(Math.max(P_FLOOR, s[sample].p))));
  const x = linearScale([Math.log10(P_FLOOR), 0], [M.left, W - M.right]);

  return (
    <Stage
      controls={<SegmentedControl label="วิเคราะห์จาก" options={SAMPLES} value={sample} onChange={setSample} />}
      caption="จุดทึบ = มีนัยสำคัญที่ 0.05, จุดกลวง = ไม่มี แกนนอนเป็นสเกลลอการิทึม"
    >
      <Chart width={W} height={H} label="ค่า p ของผลสามข้อ เทียบกับเส้น 0.05">
        <rect className={styles.significantZone} x={x(-4)} y={M.top} width={x(Math.log10(ALPHA)) - x(-4)} height={3 * ROW - 16} />
        <text className={styles.zoneLabel} x={x(Math.log10(ALPHA)) - 10} y={M.top + 3 * ROW - 26} textAnchor="end">
          ฝั่งนี้มีนัยสำคัญ
        </text>
        <line className={styles.alpha} x1={x(Math.log10(ALPHA))} x2={x(Math.log10(ALPHA))} y1={M.top - 6} y2={M.top + 3 * ROW - 16} />
        {SENSITIVITY.map((result, row) => {
          const cy = M.top + row * ROW + 40;
          const p = 10 ** logs[row];
          const significant = result[sample].p < ALPHA;
          return (
            <g key={result.key}>
              <text className={styles.question} x={M.left} y={cy - 22}>
                {result.question}
              </text>
              <line className={styles.track} x1={M.left} x2={W - M.right} y1={cy} y2={cy} />
              <circle
                cx={x(logs[row])}
                cy={cy}
                r={11}
                className={significant ? styles.dotFilled : styles.dotHollow}
              />
              <text className={styles.value} x={W - M.right} y={cy - 22} textAnchor="end">
                {result.statistic} = {formatNumber(result[sample].value, result.statistic === "F" ? 2 : 3)}, {formatP(Math.max(P_FLOOR, p))}
              </text>
            </g>
          );
        })}
        <AxisBottom
          scale={x}
          at={M.top + 3 * ROW + 4}
          ticks={[-4, -3, -2, Math.log10(ALPHA), -1, 0]}
          format={(v) => (Math.abs(v - Math.log10(ALPHA)) < 1e-9 ? "0.05" : formatNumber(10 ** v, Math.max(0, -v)))}
          title="ค่า p"
        />
      </Chart>
    </Stage>
  );
}
