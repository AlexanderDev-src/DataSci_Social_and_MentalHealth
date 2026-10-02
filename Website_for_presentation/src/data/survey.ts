/** Who answered, and how the DASS-21 came out (chapter 4, n = 107 unless noted). */

import type { Dimension, Severity } from "@domain/dass";
import { aggregates } from "./aggregates";

export const SURVEY = {
  responses: aggregates.sample.responses,
  analysed: aggregates.sample.passed,
  failedAttentionCheck: aggregates.sample.responses - aggregates.sample.passed,
  female: 59,
  male: 48,
  collected: "23 ส.ค. – 3 ก.ย. 2569",
  meanHours: 7.83,
  minHours: 4,
  maxHours: 15.5,
  meanSleepHours: 6.21,
} as const;

export const HOURS_HISTOGRAM = aggregates.hoursHistogram;

/** Respondents in each DASS-21 severity level (table 4.3). */
export const SEVERITY_COUNTS: Record<Dimension, Record<Severity, number>> = {
  depression: { normal: 63, mild: 15, moderate: 16, severe: 10, extreme: 3 },
  anxiety: { normal: 34, mild: 16, moderate: 28, severe: 13, extreme: 16 },
  stress: { normal: 72, mild: 19, moderate: 9, severe: 6, extreme: 1 },
};

/** Cronbach's alpha with a bootstrap 95% CI (table 4.4). */
export const RELIABILITY: Record<Dimension, { alpha: number; low: number; high: number }> = {
  depression: { alpha: 0.844, low: 0.79, high: 0.88 },
  anxiety: { alpha: 0.737, low: 0.627, high: 0.81 },
  stress: { alpha: 0.771, low: 0.69, high: 0.824 },
};
