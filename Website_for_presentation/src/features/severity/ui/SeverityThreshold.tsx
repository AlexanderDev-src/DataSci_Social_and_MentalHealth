import { DIMENSION_LABEL, SEVERITIES, SEVERITY_LABEL, type Severity } from "@domain/dass";
import { useTweenedValues } from "@shared/animation/useTween";
import { AxisBottom } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatPercent } from "@shared/format";
import { dimensionColor, dimensionInk } from "@shared/theme";
import { SegmentedControl } from "@shared/ui/SegmentedControl";
import { Stage } from "@shared/ui/Stage";
import { useState } from "react";
import { severityShares } from "../model/severityShares";
import styles from "./severity.module.css";

const W = 720;
const H = 280;
const M = { top: 16, right: 120, bottom: 56, left: 110 };
const ROW = 72;
const BAR = 40;

/** Pick a severity level; every segment at or above it lights up. */
export function SeverityThreshold() {
  const [threshold, setThreshold] = useState<Severity>("mild");
  const shares = severityShares(threshold);
  const from = SEVERITIES.indexOf(threshold);
  const totals = useTweenedValues(shares.map((s) => s.atOrAbove));

  const x = linearScale([0, 1], [M.left, W - M.right]);

  return (
    <Stage
      controls={
        <SegmentedControl
          label="นับตั้งแต่ระดับ"
          options={SEVERITIES.slice(1).map((level) => ({ value: level, label: `${SEVERITY_LABEL[level]}ขึ้นไป` }))}
          value={threshold}
          onChange={setThreshold}
        />
      }
      caption="ผลคัดกรองเบื้องต้นของกลุ่ม ไม่ใช่การวินิจฉัยรายบุคคล"
    >
      <Chart width={W} height={H} label={`ร้อยละของผู้ตอบที่อยู่ระดับ${SEVERITY_LABEL[threshold]}ขึ้นไป แยกตามมิติ`}>
        {shares.map((share, row) => {
          const top = M.top + row * ROW;
          let start = 0;
          return (
            <g key={share.dimension}>
              <text className={styles.label} x={M.left - 14} y={top + BAR / 2} dy="0.35em" textAnchor="end">
                {DIMENSION_LABEL[share.dimension]}
              </text>
              {share.levels.map((level, i) => {
                const left = start;
                start += level;
                const lit = i >= from;
                return (
                  <rect
                    key={SEVERITIES[i]}
                    className={styles.segment}
                    x={x(left)}
                    y={top}
                    width={Math.max(0, x(left + level) - x(left) - 2)}
                    height={BAR}
                    fill={lit ? dimensionColor(share.dimension) : "var(--rule)"}
                    fillOpacity={lit ? 0.45 + (0.55 * i) / (SEVERITIES.length - 1) : 1}
                  >
                    <title>{`${SEVERITY_LABEL[SEVERITIES[i]]} ${formatPercent(level)}`}</title>
                  </rect>
                );
              })}
              <text
                className={styles.total}
                x={W - M.right + 16}
                y={top + BAR / 2}
                dy="0.35em"
                style={{ fill: dimensionInk(share.dimension) }}
              >
                {formatPercent(totals[row], 1)}
              </text>
            </g>
          );
        })}
        <AxisBottom
          scale={x}
          at={M.top + 3 * ROW - (ROW - BAR) + 8}
          ticks={[0, 0.25, 0.5, 0.75, 1]}
          format={(v) => formatPercent(v, 0)}
          title={`ร้อยละของผู้ตอบ ${SEVERITIES.length} ระดับเรียงจากปกติไปรุนแรงมาก`}
        />
      </Chart>
    </Stage>
  );
}
