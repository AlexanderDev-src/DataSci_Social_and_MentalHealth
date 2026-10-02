import type { Dimension } from "@domain/dass";
import { aggregates, type CorrelationRow, type SampleKey } from "./aggregates";
import type { Predictor } from "./predictors";

export type { CorrelationRow, SampleKey };

/** Pearson r of every predictor with every dimension (Fisher 95% CI). */
export function correlationsFor(sample: SampleKey = "passed"): readonly CorrelationRow[] {
  return aggregates.correlations[sample];
}

export function correlationOf(predictor: Predictor, dimension: Dimension, sample: SampleKey = "passed"): CorrelationRow {
  const row = correlationsFor(sample).find((c) => c.predictor === predictor && c.dimension === dimension);
  if (!row) throw new Error(`no correlation for ${predictor} x ${dimension}`);
  return row;
}
