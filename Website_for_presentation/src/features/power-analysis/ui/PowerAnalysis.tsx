import { EFFECT_PRESETS, STUDY_N } from "@data/power";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisBottom, AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linePath } from "@shared/chart/paths";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatPercent } from "@shared/format";
import { RangeSlider } from "@shared/ui/RangeSlider";
import { Readouts } from "@shared/ui/Readouts";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { N_MAX, N_MIN, nFromPosition, positionFromN, usePowerAnalysis } from "../model/usePowerAnalysis";
import styles from "./powerAnalysis.module.css";

const W = 720;
const H = 380;
const M = { top: 30, right: 24, bottom: 60, left: 56 };
const TARGET_POWER = 0.8;
const N_TICKS = [20, 50, 100, 200, 500, 1000, 2000];

export function PowerAnalysis() {
  const model = usePowerAnalysis();
  const powers = useTweenedValues(model.curve.map((c) => c.power));

  const x = linearScale([positionFromN(N_MIN), positionFromN(N_MAX)], [M.left, W - M.right]);
  const y = linearScale([0, 1], [H - M.bottom, M.top]);
  const xAt = (n: number) => x(positionFromN(n));

  return (
    <Stage
      readouts={
        <Readouts
          items={[
            { label: `โอกาสตรวจพบเมื่อมี ${model.n.toLocaleString("en-US")} คน`, value: formatPercent(model.power, 0) },
            { label: "ต้องใช้กี่คนจึงได้ 80%", value: `${model.needed.toLocaleString("en-US")} คน` },
            { label: "|r| ขั้นต่ำที่จะมีนัยสำคัญ", value: formatNumber(model.critical) },
          ]}
        />
      }
      controls={
        <>
          <SegmentedControl
            label="สมมติว่าความสัมพันธ์จริงมีขนาด"
            options={EFFECT_PRESETS.map((p) => ({ value: p.key, label: p.label }))}
            value={model.presetKey}
            onChange={model.setPresetKey}
          />
          <RangeSlider
            label="จำนวนผู้ตอบ"
            value={positionFromN(model.n)}
            min={positionFromN(N_MIN)}
            max={positionFromN(N_MAX)}
            step={0.005}
            display={`${model.n.toLocaleString("en-US")} คน`}
            mark={{ value: positionFromN(STUDY_N), label: `โครงงานนี้ ${STUDY_N} คน` }}
            onChange={(position) => model.setN(nFromPosition(position))}
          />
        </>
      }
    >
      <Chart width={W} height={H} label={`โอกาสตรวจพบความสัมพันธ์ r = ${formatNumber(model.rho, 3)} ตามจำนวนผู้ตอบ`}>
        <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} format={(v) => formatPercent(v, 0)} title="โอกาสตรวจพบ (power)" />
        <line className={styles.target} x1={M.left} x2={W - M.right} y1={y(TARGET_POWER)} y2={y(TARGET_POWER)} />
        <text className={styles.targetLabel} x={W - M.right} y={y(TARGET_POWER) - 8} textAnchor="end">
          เกณฑ์ที่นิยม 80%
        </text>
        <path
          d={linePath(
            model.curve.map((c) => xAt(c.n)),
            powers.map((p) => y(p)),
          )}
          className={styles.curve}
        />
        <line className={styles.study} x1={xAt(STUDY_N)} x2={xAt(STUDY_N)} y1={M.top} y2={H - M.bottom} />
        <text className={styles.studyLabel} x={xAt(STUDY_N) + 8} y={M.top + 14}>
          โครงงานนี้ {STUDY_N} คน
        </text>
        <line className={styles.guide} x1={xAt(model.n)} x2={xAt(model.n)} y1={y(model.power)} y2={H - M.bottom} />
        <circle cx={xAt(model.n)} cy={y(model.power)} r={9} className={styles.point} />
        <AxisBottom
          scale={x}
          at={H - M.bottom}
          ticks={N_TICKS.map(positionFromN)}
          format={(v) => Math.round(10 ** v).toLocaleString("en-US")}
          title="จำนวนผู้ตอบ (สเกลลอการิทึม)"
        />
      </Chart>
    </Stage>
  );
}
