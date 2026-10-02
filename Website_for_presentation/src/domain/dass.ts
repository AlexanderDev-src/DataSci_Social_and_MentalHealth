/**
 * DASS-21: 21 items, three dimensions of 7 items each. Item answers run 0-3,
 * and the dimension sum is doubled so scores sit on the DASS-42 scale (0-42).
 */

export type Dimension = "depression" | "anxiety" | "stress";

export const DIMENSIONS: readonly Dimension[] = ["depression", "anxiety", "stress"];

export const DIMENSION_LABEL: Record<Dimension, string> = {
  depression: "ซึมเศร้า",
  anxiety: "วิตกกังวล",
  stress: "เครียด",
};

export const DASS_MAX_SCORE = 42;

export type Severity = "normal" | "mild" | "moderate" | "severe" | "extreme";

export const SEVERITIES: readonly Severity[] = ["normal", "mild", "moderate", "severe", "extreme"];

export const SEVERITY_LABEL: Record<Severity, string> = {
  normal: "ปกติ",
  mild: "เล็กน้อย",
  moderate: "ปานกลาง",
  severe: "รุนแรง",
  extreme: "รุนแรงมาก",
};

/** Lowest doubled score of each level (Lovibond & Lovibond, 1995). */
export const SEVERITY_FLOOR: Record<Dimension, Record<Severity, number>> = {
  depression: { normal: 0, mild: 10, moderate: 14, severe: 21, extreme: 28 },
  anxiety: { normal: 0, mild: 8, moderate: 10, severe: 15, extreme: 20 },
  stress: { normal: 0, mild: 15, moderate: 19, severe: 26, extreme: 34 },
};

export function severityOf(dimension: Dimension, score: number): Severity {
  const floors = SEVERITY_FLOOR[dimension];
  return [...SEVERITIES].reverse().find((level) => score >= floors[level]) ?? "normal";
}
