import { PREDICTOR_INFO } from "@data/predictors";
import { DIMENSION_LABEL } from "@domain/dass";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisBottom, AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { bandPath, linePath } from "@shared/chart/paths";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatPValue, formatSigned } from "@shared/format";
import { dimensionColor } from "@shared/theme";
import { DIMENSION_OPTIONS } from "@shared/ui/dimensionOptions";
import { RangeSlider } from "@shared/ui/RangeSlider";
import { Readouts } from "@shared/ui/Readouts";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { EFFECT_PREDICTORS, useEffectPlot } from "../model/useEffectPlot";
import styles from "./effectPlot.module.css";

const W = 720;
const H = 310;
const M = { top: 36, right: 20, bottom: 60, left: 52 };

function verdict(low: number, high: number): string {
  if (low < 0 && high > 0) return "แยกจากศูนย์ไม่ได้";
  return high < 0 ? "คะแนนลดลงจริง" : "คะแนนเพิ่มขึ้นจริง";
}

export function EffectPlot() {
  const model = useEffectPlot();
  const info = PREDICTOR_INFO[model.predictor];
  const color = dimensionColor(model.dimension);
  const { b, ciLow, ciHigh, p } = model.coefficient;

  const x = linearScale([model.range.min, model.range.max], [M.left, W - M.right]);
  const y = linearScale([0, 30], [H - M.bottom, M.top]);

  // the band reshapes when the predictor or dimension changes
  const shown = useTweenedValues(model.curve.flatMap((c) => [c.mean, c.low, c.high]));
  const xs = model.curve.map((c) => x(c.x));
  const column = (offset: number) => xs.map((_, i) => y(shown[i * 3 + offset]));
  const [means, lows, highs] = [column(0), column(1), column(2)];

  return (
    <Stage
      readouts={
        <Readouts
          items={[
            { label: "b คะแนนต่อ 1 หน่วย", value: formatSigned(b, 3), color },
            { label: "95% CI ของ b", value: `${formatSigned(ciLow, 2)} ถึง ${formatSigned(ciHigh, 2)}` },
            { label: "ค่า p", value: formatPValue(p) },
          ]}
        />
      }
      controls={
        <>
          <SegmentedControl
            label="ตัวแปรที่ขยับ"
            options={EFFECT_PREDICTORS.map((p) => ({ value: p, label: PREDICTOR_INFO[p].label }))}
            value={model.predictor}
            onChange={model.setPredictor}
          />
          <SegmentedControl label="มิติ" options={DIMENSION_OPTIONS} value={model.dimension} onChange={model.setDimension} />
          <RangeSlider
            label={info.label}
            value={model.value}
            min={model.range.min}
            max={model.range.max}
            step={info.step}
            display={`${formatNumber(model.value, info.digits)} ${info.unit}`}
            mark={{ value: model.range.mean, label: "ค่าเฉลี่ย" }}
            onChange={model.setValue}
          />
        </>
      }
    >
      <Chart width={W} height={H} label={`คะแนน${DIMENSION_LABEL[model.dimension]}ที่ทำนายเมื่อ${info.label}เปลี่ยน และตัวแปรอื่นอยู่ที่ค่าเฉลี่ย`}>
        <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 10, 20, 30]} title={`คะแนน${DIMENSION_LABEL[model.dimension]}ที่ทำนาย`} />
        <text className={styles.verdict} x={M.left + 14} y={M.top + 22}>
          ความชัน{verdict(ciLow, ciHigh)}
        </text>
        <path d={bandPath(xs, lows, highs)} fill={color} fillOpacity={0.22} />
        <path d={linePath(xs, means)} fill="none" stroke={color} strokeWidth={3.5} />
        <line className={styles.guide} x1={x(model.value)} x2={x(model.value)} y1={M.top} y2={H - M.bottom} />
        <line className={styles.interval} x1={x(model.value)} x2={x(model.value)} y1={y(model.current.low)} y2={y(model.current.high)} />
        <circle cx={x(model.value)} cy={y(model.current.mean)} r={8} fill={color} stroke="var(--paper)" strokeWidth={3} />
        <text
          className={styles.pointLabel}
          x={x(model.value) + (model.value > (model.range.min + model.range.max) / 2 ? -14 : 14)}
          y={y(model.current.high) - 12}
          textAnchor={model.value > (model.range.min + model.range.max) / 2 ? "end" : "start"}
        >
          ทำนาย {formatNumber(model.current.mean, 1)} (95% CI {formatNumber(model.current.low, 1)}–{formatNumber(model.current.high, 1)})
        </text>
        <AxisBottom scale={x} at={H - M.bottom} title={`${info.label} (${info.unit})`} />
      </Chart>
    </Stage>
  );
}
