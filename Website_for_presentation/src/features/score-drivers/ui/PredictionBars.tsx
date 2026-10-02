import { DASS_MAX_SCORE, DIMENSION_LABEL, SEVERITY_LABEL, severityOf, type Dimension } from "@domain/dass";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { clamp, linearScale } from "@shared/chart/scale";
import { formatNumber, formatSigned } from "@shared/format";
import { dimensionColor, dimensionInk } from "@shared/theme";
import type { DimensionPrediction } from "../model/useScoreDrivers";
import styles from "./scoreDrivers.module.css";

const W = 440;
const H = 420;
const M = { top: 40, right: 8, bottom: 76, left: 44 };

interface PredictionBarsProps {
  predictions: readonly DimensionPrediction[];
  baseline: Record<Dimension, number>;
}

/** Predicted mean score per dimension, its 95% CI, and a tick where the average student sits. */
export function PredictionBars({ predictions, baseline }: PredictionBarsProps) {
  const shown = useTweenedValues(predictions.flatMap((p) => [p.mean, p.low, p.high]));
  const y = linearScale([0, DASS_MAX_SCORE], [H - M.bottom, M.top]);
  const at = (score: number) => y(clamp(score, 0, DASS_MAX_SCORE));
  const slot = (W - M.left - M.right) / predictions.length;
  const barWidth = slot * 0.46;

  return (
    <Chart width={W} height={H} label="คะแนนเฉลี่ยที่สมการทำนายของสามมิติ พร้อมช่วงความเชื่อมั่น 95%">
      <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 10, 20, 30, 40]} title="คะแนน (เต็ม 42)" />
      {predictions.map((p, i) => {
        const [mean, low, high] = shown.slice(i * 3, i * 3 + 3);
        const center = M.left + slot * i + slot / 2;
        const x = center - barWidth / 2;
        return (
          <g key={p.dimension}>
            <rect x={x} y={at(mean)} width={barWidth} height={y(0) - at(mean)} fill={dimensionColor(p.dimension)} />
            <line className={styles.whisker} x1={center} x2={center} y1={at(low)} y2={at(high)} />
            <line className={styles.whisker} x1={center - 9} x2={center + 9} y1={at(low)} y2={at(low)} />
            <line className={styles.whisker} x1={center - 9} x2={center + 9} y1={at(high)} y2={at(high)} />
            <line
              className={styles.baseline}
              x1={x - 8}
              x2={x + barWidth + 8}
              y1={at(baseline[p.dimension])}
              y2={at(baseline[p.dimension])}
            />
            <text className={styles.score} x={center} y={at(high) - 12} textAnchor="middle">
              {formatNumber(mean, 1)}
            </text>
            <text className={styles.dimension} x={center} y={H - M.bottom + 26} textAnchor="middle" style={{ fill: dimensionInk(p.dimension) }}>
              {DIMENSION_LABEL[p.dimension]}
            </text>
            <text className={styles.change} x={center} y={H - M.bottom + 48} textAnchor="middle">
              {Math.abs(p.change) < 0.05 ? "ค่าเฉลี่ย" : formatSigned(p.change, 1)}
            </text>
            <text className={styles.severity} x={center} y={H - M.bottom + 68} textAnchor="middle">
              {SEVERITY_LABEL[severityOf(p.dimension, p.mean)]}
            </text>
          </g>
        );
      })}
    </Chart>
  );
}
