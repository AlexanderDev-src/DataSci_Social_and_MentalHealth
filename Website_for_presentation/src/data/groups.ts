/** Group comparisons from chapter 4: content type (question 4) and money (extra analysis). */

import type { Dimension } from "@domain/dass";

export interface Group {
  key: string;
  label: string;
  n: number;
}

export const CONTENT_GROUPS: readonly (Group & { anxietyMean: number })[] = [
  { key: "news", label: "ข่าว", n: 8, anxietyMean: 13.0 },
  { key: "entertainment", label: "บันเทิง", n: 58, anxietyMean: 11.59 },
  { key: "other", label: "อื่น ๆ", n: 28, anxietyMean: 11.0 },
  { key: "others-life", label: "ชีวิตคนอื่น", n: 13, anxietyMean: 10.46 },
];

export const CONTENT_ANOVA = { f: 0.225, dfBetween: 3, dfWithin: 103, p: 0.879, etaSquared: 0.007 };

export const FINANCE_GROUPS: readonly (Group & { range: string })[] = [
  { key: "short", label: "เงินไม่พอใช้", range: "1–4", n: 18 },
  { key: "enough", label: "พอใช้", range: "5–7", n: 54 },
  { key: "comfortable", label: "สบาย", range: "8–10", n: 35 },
];

export interface FinanceResult {
  means: Record<string, number>;
  f: number;
  p: number;
  etaSquared: number;
}

/** Table 4.7: F(2, 104). */
export const FINANCE_RESULTS: Record<Dimension, FinanceResult> = {
  depression: { means: { short: 16.6, enough: 8.9, comfortable: 6.6 }, f: 10.91, p: 0.0001, etaSquared: 0.173 },
  anxiety: { means: { short: 14.3, enough: 11.2, comfortable: 10.2 }, f: 1.91, p: 0.153, etaSquared: 0.035 },
  stress: { means: { short: 16.9, enough: 11.3, comfortable: 10.2 }, f: 5.02, p: 0.008, etaSquared: 0.088 },
};
