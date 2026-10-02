import { HOURS_HISTOGRAM, SURVEY } from "@data/survey";
import { AxisBottom, AxisLeft } from "@shared/chart/Axis";
import { Chart } from "@shared/chart/Chart";
import { linearScale } from "@shared/chart/scale";
import { formatNumber } from "@shared/format";
import styles from "./usageHistogram.module.css";

const W = 720;
const H = 380;
const M = { top: 40, right: 16, bottom: 64, left: 52 };

/** Respondents per hour of daily use. Static: rendered at build time, no script. */
export function UsageHistogram() {
  const maxCount = Math.max(...HOURS_HISTOGRAM.map((b) => b.count));
  const x = linearScale([0, 16], [M.left, W - M.right]);
  const y = linearScale([0, Math.ceil(maxCount / 5) * 5], [H - M.bottom, M.top]);

  return (
    <Chart width={W} height={H} label={`จำนวนผู้ตอบตามชั่วโมงใช้โซเชียลมีเดียต่อวัน ไม่มีใครใช้น้อยกว่า ${SURVEY.minHours} ชั่วโมง`}>
      <defs>
        <pattern id="empty-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line y2="8" className={styles.hatch} />
        </pattern>
      </defs>
      <AxisLeft scale={y} at={M.left} gridTo={W - M.right} title="คน" />
      <rect
        x={x(0)}
        y={M.top}
        width={x(SURVEY.minHours) - x(0)}
        height={H - M.bottom - M.top}
        fill="url(#empty-hatch)"
      />
      <text className={styles.emptyNote} x={x(SURVEY.minHours / 2)} y={M.top + 24} textAnchor="middle">
        ไม่มีใครเลย
      </text>
      {HOURS_HISTOGRAM.map((bin) => (
        <rect
          key={bin.from}
          className={styles.bar}
          x={x(bin.from) + 1.5}
          y={y(bin.count)}
          width={x(bin.to) - x(bin.from) - 3}
          height={y(0) - y(bin.count)}
        />
      ))}
      <line className={styles.mean} x1={x(SURVEY.meanHours)} x2={x(SURVEY.meanHours)} y1={M.top - 8} y2={H - M.bottom} />
      <text className={styles.meanLabel} x={x(SURVEY.meanHours) + 8} y={M.top - 2}>
        เฉลี่ย {formatNumber(SURVEY.meanHours)} ชม.
      </text>
      <AxisBottom scale={x} at={H - M.bottom} ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16]} title="ชั่วโมงต่อวัน (จาก Screen Time)" />
    </Chart>
  );
}
