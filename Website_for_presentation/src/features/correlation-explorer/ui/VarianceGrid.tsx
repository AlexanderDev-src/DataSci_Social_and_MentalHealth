import { formatPercent } from "@shared/format";
import styles from "./correlationExplorer.module.css";

const CELLS = Array.from({ length: 100 }, (_, i) => i);
const SIZE = 22;
const GAP = 4;

/** r squared as 100 squares: how much of the score spread the variable accounts for. */
export function VarianceGrid({ share, color }: { share: number; color: string }) {
  const filled = Math.round(share * 100);
  const side = 10 * SIZE + 9 * GAP;
  return (
    <div className={styles.grid}>
      <svg viewBox={`0 0 ${side} ${side}`} role="img" aria-label={`อธิบายได้ ${formatPercent(share)} จาก 100%`}>
        {CELLS.map((i) => (
          <rect
            key={i}
            x={(i % 10) * (SIZE + GAP)}
            y={Math.floor(i / 10) * (SIZE + GAP)}
            width={SIZE}
            height={SIZE}
            fill={i < filled ? color : "var(--rule)"}
            className={styles.cell}
          />
        ))}
      </svg>
      <p className={styles.gridNote}>
        ทุกช่องคือความต่างของคะแนนทั้งหมด ช่องสีคือส่วนที่ตัวแปรนี้อธิบายได้ (r²)
      </p>
    </div>
  );
}
