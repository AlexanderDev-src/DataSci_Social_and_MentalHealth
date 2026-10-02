/**
 * The four signs that the Kaggle datasets were synthetic (chapter 3), next to the
 * same checks on the survey this project ran itself (section 4.2).
 */

import { aggregates } from "./aggregates";

export type Source = "kaggle" | "survey";

export const SOURCE_LABEL: Record<Source, string> = {
  kaggle: "ชุดข้อมูล Kaggle",
  survey: "แบบสอบถามของเรา",
};

/** Share of hours answers by their first decimal digit (.0, .1, ... .9). */
export const DECIMAL_DIGIT_SHARE: Record<Source, readonly number[]> = {
  // a random generator spreads every digit evenly
  kaggle: Array.from({ length: 10 }, () => 0.1),
  survey: Array.from({ length: 10 }, (_, d) => aggregates.hoursDecimalDigit[String(d)] ?? 0),
};

export interface QualityCheck {
  key: string;
  label: string;
  kaggle: string;
  survey: string;
}

export const QUALITY_CHECKS: readonly QualityCheck[] = [
  {
    key: "platform",
    label: "แพลตฟอร์มกับประเทศ",
    kaggle: "ผูกกันทุกแถว LINE มีแต่ในญี่ปุ่น",
    survey: "ไม่ได้ถามประเทศ ทุกคนเป็นนักศึกษา มข.",
  },
  {
    key: "correlation",
    label: "สหสัมพันธ์สูงสุดระหว่างตัวแปรต่างเรื่อง",
    kaggle: "0.80 ถึง 0.95",
    survey: "0.45 (ชั่วโมงนอนกับคุณภาพการนอน)",
  },
  {
    key: "missing",
    label: "ช่องที่ไม่มีคำตอบ",
    kaggle: "0 ช่อง",
    survey: "4 จาก 1,284 ช่อง",
  },
];
