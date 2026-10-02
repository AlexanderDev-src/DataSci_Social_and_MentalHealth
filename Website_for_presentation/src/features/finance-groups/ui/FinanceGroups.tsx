import { FINANCE_GROUPS, FINANCE_RESULTS } from "@data/groups";
import { DIMENSION_LABEL, type Dimension } from "@domain/dass";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber, formatPValue } from "@shared/format";
import { dimensionColor, dimensionInk } from "@shared/theme";
import { DIMENSION_OPTIONS } from "@shared/ui/dimensionOptions";
import { Readouts } from "@shared/ui/Readouts";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import styles from "./financeGroups.module.css";

const W = 720;
const H = 380;
const M = { top: 40, right: 16, bottom: 72, left: 52 };

/** Mean scores of the short-of-money, enough and comfortable groups, one dimension at a time. */
export function FinanceGroups() {
  const [dimension, setDimension] = useState<Dimension>("depression");
  const result = FINANCE_RESULTS[dimension];
  const means = useTweenedValues(FINANCE_GROUPS.map((g) => result.means[g.key]));

  const y = linearScale([0, 20], [H - M.bottom, M.top]);
  const slot = (W - M.left - M.right) / FINANCE_GROUPS.length;
  const barWidth = slot * 0.56;
  const color = dimensionColor(dimension);
  const gap = result.means.short - result.means.comfortable;

  return (
    <Stage
      readouts={
        <Readouts
          items={[
            { label: "ไม่พอใช้ ลบ สบาย", value: `${formatNumber(gap, 1)} คะแนน`, color: dimensionInk(dimension) },
            { label: "F(2, 104)", value: formatNumber(result.f) },
            { label: "ค่า p", value: formatPValue(result.p) },
            { label: "η² อธิบายได้", value: `${formatNumber(result.etaSquared * 100, 1)}%` },
          ]}
        />
      }
      controls={<SegmentedControl label="ดูมิติ" options={DIMENSION_OPTIONS} value={dimension} onChange={setDimension} />}
    >
      <Chart width={W} height={H} label={`คะแนน${DIMENSION_LABEL[dimension]}เฉลี่ยตามสภาพการเงินสามกลุ่ม`}>
        <AxisLeft scale={y} at={M.left} gridTo={W - M.right} ticks={[0, 5, 10, 15, 20]} title={`คะแนน${DIMENSION_LABEL[dimension]}เฉลี่ย`} />
        {FINANCE_GROUPS.map((group, i) => {
          const x = M.left + slot * i + (slot - barWidth) / 2;
          return (
            <g key={group.key}>
              <rect x={x} y={y(means[i])} width={barWidth} height={y(0) - y(means[i])} fill={color} />
              <text className={styles.mean} x={x + barWidth / 2} y={y(means[i]) - 12} textAnchor="middle">
                {formatNumber(means[i], 1)}
              </text>
              <text className={styles.group} x={x + barWidth / 2} y={H - M.bottom + 26} textAnchor="middle">
                {group.label}
              </text>
              <text className={styles.detail} x={x + barWidth / 2} y={H - M.bottom + 50} textAnchor="middle">
                ให้คะแนน {group.range} ({group.n} คน)
              </text>
            </g>
          );
        })}
      </Chart>
    </Stage>
  );
}
