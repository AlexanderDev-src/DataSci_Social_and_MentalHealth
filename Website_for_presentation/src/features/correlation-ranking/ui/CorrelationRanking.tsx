import { isSocialMedia, PREDICTOR_INFO, PREDICTORS } from "@data/predictors";
import { DIMENSION_LABEL, type Dimension } from "@domain/dass";
import { criticalR } from "@domain/stats/correlation";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisBottom } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber } from "@shared/format";
import { dimensionColor } from "@shared/theme";
import { DIMENSION_OPTIONS } from "@shared/ui/dimensionOptions";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import { rankCorrelations } from "../model/rankCorrelations";
import styles from "./correlationRanking.module.css";

const W = 760;
const ROW = 40;
const M = { top: 34, right: 64, bottom: 56, left: 220 };
const H = M.top + ROW * PREDICTORS.length + M.bottom;
const N = 107;

/** Every predictor's r with one dimension, strongest first; rows slide into their new order. */
export function CorrelationRanking() {
  const [dimension, setDimension] = useState<Dimension>("depression");
  const rows = rankCorrelations(dimension);
  // tween each row's position and its three numbers together
  const shown = useTweenedValues(rows.flatMap((row) => [row.rank, row.r, row.ciLow, row.ciHigh]));

  const x = linearScale([-0.6, 0.6], [M.left, W - M.right]);
  const critical = criticalR(N);
  const color = dimensionColor(dimension);
  const bottom = M.top + ROW * PREDICTORS.length;

  return (
    <Stage
      controls={<SegmentedControl label="ดูมิติ" options={DIMENSION_OPTIONS} value={dimension} onChange={setDimension} />}
      caption="เส้นคือช่วงความเชื่อมั่น 95% จุดทึบ = มีนัยสำคัญที่ 0.05, จุดกลวง = ไม่มี"
    >
      <Chart width={W} height={H} label={`สหสัมพันธ์ของตัวแปรทั้งแปดกับคะแนน${DIMENSION_LABEL[dimension]} เรียงจากแรงไปอ่อน`}>
        <rect
          className={styles.noise}
          x={x(-critical)}
          y={M.top - 10}
          width={x(critical) - x(-critical)}
          height={bottom - M.top + 10}
        />
        <text className={styles.noiseLabel} x={x(0)} y={M.top - 16} textAnchor="middle">
          |r| ต่ำกว่า {formatNumber(critical)} แยกจากศูนย์ไม่ได้
        </text>
        <line className={styles.zero} x1={x(0)} x2={x(0)} y1={M.top - 10} y2={bottom} />
        {rows.map((row, i) => {
          const [rank, r, low, high] = shown.slice(i * 4, i * 4 + 4);
          const cy = M.top + rank * ROW + ROW / 2;
          const focus = isSocialMedia(row.predictor);
          return (
            <g key={row.predictor}>
              {focus && <rect className={styles.focusRow} x={8} y={cy - ROW / 2 + 3} width={W - 8} height={ROW - 6} />}
              <text className={focus ? styles.labelFocus : styles.label} x={M.left - 16} y={cy} dy="0.35em" textAnchor="end">
                {PREDICTOR_INFO[row.predictor].label}
              </text>
              <line x1={x(low)} x2={x(high)} y1={cy} y2={cy} stroke={color} strokeWidth={3} />
              <circle cx={x(r)} cy={cy} r={8} fill={row.significant ? color : "var(--paper)"} stroke={color} strokeWidth={3} />
              <text className={styles.value} x={W - M.right + 12} y={cy} dy="0.35em">
                {formatNumber(r)}
              </text>
            </g>
          );
        })}
        <AxisBottom scale={x} at={bottom + 6} ticks={[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6]} format={(v) => formatNumber(v, 1)} title="r" />
      </Chart>
    </Stage>
  );
}
