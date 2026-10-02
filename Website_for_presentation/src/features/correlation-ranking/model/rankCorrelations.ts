import { correlationsFor, type CorrelationRow } from "@data/correlations";
import { PREDICTORS } from "@data/predictors";
import type { Dimension } from "@domain/dass";

export interface RankedRow extends CorrelationRow {
  /** 0 for the strongest |r|. */
  rank: number;
  significant: boolean;
}

/** Correlations with one dimension, in fixed predictor order, each tagged with its rank by |r|. */
export function rankCorrelations(dimension: Dimension, alpha = 0.05): RankedRow[] {
  const rows = correlationsFor().filter((c) => c.dimension === dimension);
  const order = [...rows].sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
  return PREDICTORS.map((predictor) => {
    const row = rows.find((c) => c.predictor === predictor)!;
    return { ...row, rank: order.indexOf(row), significant: row.p < alpha };
  });
}
