import { HIERARCHICAL, REGRESSION_N } from "@data/regression";
import { DIMENSION_LABEL } from "@domain/dass";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatPercent, formatPValue } from "@shared/format";
import { dimensionColor, dimensionInk } from "@shared/theme";
import { Readouts } from "@shared/ui/Readouts";
import { SegmentedControl, type Option } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import styles from "./varianceExplained.module.css";

const W = 720;
const H = 360;
const M = { top: 40, right: 16, bottom: 56, left: 56 };

type Step = "controls" | "full";

const STEPS: readonly Option<Step>[] = [
  { value: "controls", label: "ขั้น 1 ตัวแปรควบคุม 6 ตัว" },
  { value: "full", label: "ขั้น 2 เพิ่มชั่วโมงใช้งานและการติดตามข่าว" },
];

/** Add the two social media variables to the model and see how little the bars grow. */
export function VarianceExplained() {
  const [step, setStep] = useState<Step>("controls");
  const added = useTweenedValues(HIERARCHICAL.map((h) => (step === "full" ? h.r2Full - h.r2Controls : 0)));

  const y = linearScale([0, 0.3], [H - M.bottom, M.top]);
  const slot = (W - M.left - M.right) / HIERARCHICAL.length;
  const barWidth = slot * 0.5;

  return (
    <Stage
      readouts={
        <Readouts
          items={HIERARCHICAL.map((h, i) => ({
            label: `R² เพิ่มขึ้น ${DIMENSION_LABEL[h.dimension]}`,
            value: `+${formatNumber(added[i], 3)}`,
            color: dimensionInk(h.dimension),
          }))}
        />
      }
      controls={<SegmentedControl label="สมการถดถอย" options={STEPS} value={step} onChange={setStep} />}
      caption={`R² คือสัดส่วนความต่างของคะแนนที่สมการอธิบายได้ (n = ${REGRESSION_N}) ค่า p ของส่วนที่เพิ่ม: ${HIERARCHICAL.map((h) => `${DIMENSION_LABEL[h.dimension]} ${formatPValue(h.p)}`).join(", ")}`}
    >
      <Chart width={W} height={H} label="R² ของสมการถดถอยสามมิติ ก่อนและหลังเพิ่มตัวแปรโซเชียลมีเดีย">
        <defs>
          <pattern id="added-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" className={styles.hatchBack} />
            <line y2="7" className={styles.hatchLine} />
          </pattern>
        </defs>
        <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 0.1, 0.2, 0.3]} format={(v) => formatPercent(v, 0)} />
        {HIERARCHICAL.map((h, i) => {
          const x = M.left + slot * i + (slot - barWidth) / 2;
          const total = h.r2Controls + added[i];
          return (
            <g key={h.dimension}>
              <rect x={x} y={y(h.r2Controls)} width={barWidth} height={y(0) - y(h.r2Controls)} fill={dimensionColor(h.dimension)} />
              <rect
                x={x}
                y={y(total)}
                width={barWidth}
                height={Math.max(0, y(h.r2Controls) - y(total))}
                fill="url(#added-hatch)"
                stroke="var(--ink)"
                strokeWidth={added[i] > 0.0005 ? 1.5 : 0}
              />
              <text className={styles.value} x={x + barWidth / 2} y={y(total) - 10} textAnchor="middle">
                {formatPercent(total)}
              </text>
              <text className={styles.dimension} x={x + barWidth / 2} y={H - M.bottom + 26} textAnchor="middle">
                {DIMENSION_LABEL[h.dimension]}
              </text>
            </g>
          );
        })}
      </Chart>
    </Stage>
  );
}
