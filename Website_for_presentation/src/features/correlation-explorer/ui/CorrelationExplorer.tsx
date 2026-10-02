import { PREDICTOR_INFO } from "@data/predictors";
import { DIMENSION_LABEL } from "@domain/dass";
import { Chart } from "@shared/chart/Chart";
import { clamp, linearScale } from "@shared/chart/scale";
import { formatNumber, formatPercent, formatPValue } from "@shared/format";
import { dimensionColor } from "@shared/theme";
import { RangeSlider } from "@shared/ui/RangeSlider";
import { Readouts } from "@shared/ui/Readouts";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { PRESETS, R_LIMIT, SAMPLE_SIZE, useCorrelationExplorer } from "../model/useCorrelationExplorer";
import { VarianceGrid } from "./VarianceGrid";
import styles from "./correlationExplorer.module.css";

const W = 560;
const H = 400;
const M = { top: 24, right: 16, bottom: 48, left: 40 };
const SPREAD = 3;

export function CorrelationExplorer() {
  const model = useCorrelationExplorer();
  const { variables } = model;
  const color = dimensionColor(variables.dimension);

  const x = linearScale([-SPREAD, SPREAD], [M.left, W - M.right]);
  const y = linearScale([-SPREAD, SPREAD], [H - M.bottom, M.top]);
  const xLabel = PREDICTOR_INFO[variables.predictor].label;
  const yLabel = `คะแนน${DIMENSION_LABEL[variables.dimension]}`;

  return (
    <Stage
      readouts={
        <Readouts
          items={[
            { label: "r", value: formatNumber(model.r) },
            { label: "อธิบายคะแนนได้", value: formatPercent(model.explained) },
            { label: `ค่า p เมื่อมี ${SAMPLE_SIZE} คน`, value: formatPValue(model.p) },
            { label: "ผลการทดสอบ", value: model.significant ? "มีนัยสำคัญ" : "ไม่มีนัยสำคัญ" },
          ]}
        />
      }
      controls={
        <>
          <SegmentedControl
            label="ค่าที่พบจริงในข้อมูล"
            options={PRESETS.map((p) => ({ value: p.key, label: `${p.label} (${formatNumber(p.r)})` }))}
            value={model.presetKey ?? ""}
            onChange={model.choosePreset}
          />
          <RangeSlider
            label="ลองเปลี่ยนค่า r เอง"
            value={model.r}
            min={-R_LIMIT}
            max={R_LIMIT}
            step={0.01}
            display={formatNumber(model.r)}
            onChange={model.setR}
            hint={`|r| ต้องถึง ${formatNumber(model.critical)} จึงมีนัยสำคัญเมื่อมี ${SAMPLE_SIZE} คน`}
          />
        </>
      }
    >
      <div className={styles.canvas}>
        <Chart width={W} height={H} label={`จุดจำลอง ${SAMPLE_SIZE} จุดที่มีสหสัมพันธ์ ${formatNumber(model.r)} ระหว่าง${xLabel}กับ${yLabel}`}>
          <rect className={styles.frame} x={M.left} y={M.top} width={W - M.left - M.right} height={H - M.top - M.bottom} />
          <line className={styles.zero} x1={x(0)} x2={x(0)} y1={M.top} y2={H - M.bottom} />
          <line className={styles.zero} x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} />
          {model.points.map((p, i) => (
            <circle
              key={i}
              className={styles.point}
              cx={x(clamp(p.x, -SPREAD, SPREAD))}
              cy={y(clamp(p.y, -SPREAD, SPREAD))}
              r={5.5}
              fill={color}
            />
          ))}
          <line
            className={styles.fit}
            x1={x(-SPREAD)}
            x2={x(SPREAD)}
            y1={y(-SPREAD * model.shownR)}
            y2={y(SPREAD * model.shownR)}
          />
          <text className={styles.axisTitle} x={W - M.right} y={H - M.bottom + 30} textAnchor="end">
            {xLabel} มากขึ้นไปทางขวา
          </text>
          <text className={styles.axisTitle} x={M.left} y={M.top - 8}>
            {yLabel} สูงขึ้นไปทางบน
          </text>
          <text className={styles.simulated} x={W - M.right - 10} y={M.top + 22} textAnchor="end">
            จุดจำลอง ไม่ใช่ผู้ตอบจริง
          </text>
        </Chart>
        <VarianceGrid share={model.explained} color={color} />
      </div>
    </Stage>
  );
}
