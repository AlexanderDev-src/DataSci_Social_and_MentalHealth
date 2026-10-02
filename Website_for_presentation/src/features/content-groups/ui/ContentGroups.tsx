import { CONTENT_ANOVA, CONTENT_GROUPS } from "@data/groups";
import { SURVEY } from "@data/survey";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatPValue } from "@shared/format";
import { dimensionColor } from "@shared/theme";
import { Readouts } from "@shared/ui/Readouts";
import { SegmentedControl, type Option } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import styles from "./contentGroups.module.css";

const W = 720;
const H = 360;
const M = { top: 36, right: 96, bottom: 64, left: 52 };
const OVERALL_ANXIETY = 11.4;

type Width = "equal" | "size";

const WIDTH_OPTIONS: readonly Option<Width>[] = [
  { value: "equal", label: "เท่ากันทุกกลุ่ม" },
  { value: "size", label: "ตามจำนวนคนในกลุ่ม" },
];

/** Anxiety by content group; widen each bar by its head count to see how thin "news" is. */
export function ContentGroups() {
  const [width, setWidth] = useState<Width>("equal");
  const total = CONTENT_GROUPS.reduce((a, g) => a + g.n, 0);
  const inner = W - M.left - M.right;
  const gap = 16;
  const usable = inner - gap * (CONTENT_GROUPS.length - 1);
  const widths = useTweenedValues(
    CONTENT_GROUPS.map((g) => (width === "equal" ? usable / CONTENT_GROUPS.length : (usable * g.n) / total)),
  );

  const y = linearScale([0, 15], [H - M.bottom, M.top]);
  const color = dimensionColor("anxiety");
  let left = M.left;

  return (
    <Stage
      readouts={
        <Readouts
          items={[
            { label: "F(3, 103)", value: formatNumber(CONTENT_ANOVA.f, 3) },
            { label: "ค่า p", value: formatPValue(CONTENT_ANOVA.p) },
            { label: "η² อธิบายได้", value: `${formatNumber(CONTENT_ANOVA.etaSquared * 100, 1)}%` },
          ]}
        />
      }
      controls={
        <SegmentedControl
          label="ความกว้างของแท่ง"
          options={WIDTH_OPTIONS}
          value={width}
          onChange={setWidth}
        />
      }
    >
      <Chart width={W} height={H} label="คะแนนความวิตกกังวลเฉลี่ยของ 4 กลุ่มเนื้อหา">
        <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 5, 10, 15]} title="คะแนนวิตกกังวลเฉลี่ย (เต็ม 42)" />
        {CONTENT_GROUPS.map((group, i) => {
          const x = left;
          left += widths[i] + gap;
          return (
            <g key={group.key}>
              <rect x={x} y={y(group.anxietyMean)} width={widths[i]} height={y(0) - y(group.anxietyMean)} fill={color} />
              <text className={styles.mean} x={x + widths[i] / 2} y={y(group.anxietyMean) + 26} textAnchor="middle">
                {formatNumber(group.anxietyMean)}
              </text>
              <text className={styles.group} x={x + widths[i] / 2} y={H - M.bottom + 24} textAnchor="middle">
                {group.label}
              </text>
              <text className={styles.count} x={x + widths[i] / 2} y={H - M.bottom + 46} textAnchor="middle">
                {group.n} คน
              </text>
            </g>
          );
        })}
        <line className={styles.overall} x1={M.left} x2={W - M.right} y1={y(OVERALL_ANXIETY)} y2={y(OVERALL_ANXIETY)} />
        <text className={styles.overallLabel} x={W - M.right + 10} y={y(OVERALL_ANXIETY)} dy="-0.2em">
          ทั้ง {SURVEY.analysed} คน
        </text>
        <text className={styles.overallLabel} x={W - M.right + 10} y={y(OVERALL_ANXIETY)} dy="1.1em">
          {formatNumber(OVERALL_ANXIETY)}
        </text>
      </Chart>
    </Stage>
  );
}
