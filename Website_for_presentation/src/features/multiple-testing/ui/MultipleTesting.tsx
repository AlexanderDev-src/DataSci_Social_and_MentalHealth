import { PREDICTOR_INFO, PREDICTORS } from "@data/predictors";
import { DIMENSION_LABEL, DIMENSIONS } from "@domain/dass";
import { useTweenedValue } from "@shared/animation/useTween";
import { AxisBottom } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatPercent } from "@shared/format";
import { dimensionColor, dimensionInk } from "@shared/theme";
import { RangeSlider } from "@shared/ui/RangeSlider";
import { Readouts } from "@shared/ui/Readouts";
import { Stage } from "@shared/ui/Stage";
import { useMultipleTesting } from "../model/useMultipleTesting";
import styles from "./multipleTesting.module.css";

const W = 720;
const ROW = 72;
const M = { top: 28, right: 20, bottom: 56, left: 110 };
const H = M.top + ROW * DIMENSIONS.length + M.bottom;
const LOG_MIN = -4.2;

const log = (p: number) => Math.max(LOG_MIN, Math.log10(p));

export function MultipleTesting() {
  const model = useMultipleTesting();
  const line = useTweenedValue(log(model.threshold));
  const x = linearScale([LOG_MIN, 0], [M.left, W - M.right]);
  const bottom = M.top + ROW * DIMENSIONS.length;

  return (
    <Stage
      readouts={
        <Readouts
          items={[
            { label: "เกณฑ์ต่อการทดสอบ", value: model.threshold < 0.001 ? formatNumber(model.threshold, 4) : formatNumber(model.threshold, 3) },
            { label: "ผ่านเกณฑ์", value: `${model.survivors.length} จาก ${model.maxTests}` },
            { label: `ถ้าไม่ปรับ โอกาสเจอผลบังเอิญใน ${model.k} ครั้ง`, value: formatPercent(model.falseAlarmChance, 0) },
          ]}
        />
      }
      controls={
        <RangeSlider
          label="นับว่าทดสอบไปกี่ครั้ง (Bonferroni หาร 0.05 ด้วยจำนวนนี้)"
          value={model.k}
          min={1}
          max={model.maxTests}
          step={1}
          display={`${model.k} ครั้ง`}
          onChange={model.setK}
        />
      }
      caption={
        <>
          ผ่านเกณฑ์:{" "}
          {model.survivors.length === 0
            ? "ไม่มี"
            : model.survivors.map((s) => `${PREDICTOR_INFO[s.predictor].label} กับ${DIMENSION_LABEL[s.dimension]}`).join(", ")}
        </>
      }
    >
      <Chart width={W} height={H} label="ค่า p ของสหสัมพันธ์ 24 คู่ เทียบกับเกณฑ์ Bonferroni">
        <rect className={styles.pass} x={M.left} y={M.top - 8} width={Math.max(0, x(line) - M.left)} height={bottom - M.top + 8} />
        {DIMENSIONS.map((dimension, row) => (
          <g key={dimension}>
            <text
              className={styles.dimension}
              x={M.left - 16}
              y={M.top + row * ROW + ROW / 2}
              dy="0.35em"
              textAnchor="end"
              style={{ fill: dimensionInk(dimension) }}
            >
              {DIMENSION_LABEL[dimension]}
            </text>
            <line className={styles.rowLine} x1={M.left} x2={W - M.right} y1={M.top + row * ROW + ROW / 2} y2={M.top + row * ROW + ROW / 2} />
          </g>
        ))}
        {model.tests.map((t) => {
          const row = DIMENSIONS.indexOf(t.dimension);
          // spread the eight predictors a little so equal p-values do not hide each other
          const offset = (PREDICTORS.indexOf(t.predictor) - 3.5) * 5;
          const passes = t.p < model.threshold;
          const color = dimensionColor(t.dimension);
          return (
            <circle
              key={`${t.predictor}-${t.dimension}`}
              cx={x(log(t.p))}
              cy={M.top + row * ROW + ROW / 2 + offset}
              r={7.5}
              fill={passes ? color : "var(--paper)"}
              stroke={color}
              strokeWidth={2.5}
            >
              <title>{`${PREDICTOR_INFO[t.predictor].label} กับ${DIMENSION_LABEL[t.dimension]} p = ${formatNumber(t.p, 4)}`}</title>
            </circle>
          );
        })}
        <line className={styles.threshold} x1={x(line)} x2={x(line)} y1={M.top - 12} y2={bottom} />
        <AxisBottom
          scale={x}
          at={bottom + 6}
          ticks={[-4, -3, -2, -1, 0]}
          format={(v) => formatNumber(10 ** v, Math.max(0, -v))}
          title="ค่า p (สเกลลอการิทึม) ซ้ายของเส้นคือผ่านเกณฑ์"
        />
      </Chart>
    </Stage>
  );
}
