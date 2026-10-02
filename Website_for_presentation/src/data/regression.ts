/** The hierarchical regression of chapter 4 (n = 103 complete cases, HC3 errors). */

import { DIMENSIONS, type Dimension } from "@domain/dass";
import type { LinearModel } from "@domain/regression";
import { aggregates, type CoefficientRow, type PredictorRange } from "./aggregates";
import { PREDICTORS, type Predictor } from "./predictors";

export const REGRESSION_N = aggregates.regression.n;

const toModel = (dimension: Dimension): LinearModel<Predictor> => {
  const fit = aggregates.regression.models[dimension];
  const slopes = Object.fromEntries(fit.coefficients.map((c) => [c.predictor, c.b])) as Record<Predictor, number>;
  return { predictors: PREDICTORS, intercept: fit.intercept, slopes, covariance: fit.covariance };
};

export const MODELS: Record<Dimension, LinearModel<Predictor>> = {
  depression: toModel("depression"),
  anxiety: toModel("anxiety"),
  stress: toModel("stress"),
};

export const PREDICTOR_RANGE: Record<Predictor, PredictorRange> = Object.fromEntries(
  aggregates.regression.predictors.map((p) => [p.predictor, p]),
) as Record<Predictor, PredictorRange>;

export const MEAN_VALUES = Object.fromEntries(
  PREDICTORS.map((p) => [p, PREDICTOR_RANGE[p].mean]),
) as Record<Predictor, number>;

export function coefficientOf(dimension: Dimension, predictor: Predictor): CoefficientRow {
  const row = aggregates.regression.models[dimension].coefficients.find((c) => c.predictor === predictor);
  if (!row) throw new Error(`no coefficient for ${predictor} in ${dimension}`);
  return row;
}

export interface HierarchicalStep {
  dimension: Dimension;
  /** Block 1: the six controls only. */
  r2Controls: number;
  /** Block 2: controls plus hours of use and news-following. */
  r2Full: number;
  /** F-change test of block 2 over block 1 (table 4.6 of the report). */
  fChange: number;
  p: number;
}

const F_CHANGE: Record<Dimension, { f: number; p: number }> = {
  depression: { f: 0.489, p: 0.615 },
  anxiety: { f: 2.355, p: 0.1 },
  stress: { f: 0.796, p: 0.454 },
};

export const HIERARCHICAL: readonly HierarchicalStep[] = DIMENSIONS.map((dimension) => ({
  dimension,
  r2Controls: aggregates.regression.models[dimension].r2Block1,
  r2Full: aggregates.regression.models[dimension].r2,
  fChange: F_CHANGE[dimension].f,
  p: F_CHANGE[dimension].p,
}));
