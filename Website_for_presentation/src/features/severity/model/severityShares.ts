import { DIMENSIONS, SEVERITIES, type Dimension, type Severity } from "@domain/dass";
import { SEVERITY_COUNTS, SURVEY } from "@data/survey";

export interface DimensionShare {
  dimension: Dimension;
  /** Share of respondents in each level, in SEVERITIES order. */
  levels: number[];
  /** Share at or above the chosen level. */
  atOrAbove: number;
  count: number;
}

/** How many respondents sit at or above a severity level, per dimension. */
export function severityShares(threshold: Severity): DimensionShare[] {
  const from = SEVERITIES.indexOf(threshold);
  return DIMENSIONS.map((dimension) => {
    const counts = SEVERITIES.map((level) => SEVERITY_COUNTS[dimension][level]);
    const count = counts.slice(from).reduce((a, b) => a + b, 0);
    return {
      dimension,
      levels: counts.map((c) => c / SURVEY.analysed),
      atOrAbove: count / SURVEY.analysed,
      count,
    };
  });
}
