/**
 * Typed view of generated/aggregates.json, which codingpy/export_presentation.py
 * writes from the cleaned survey. It holds summary statistics only, never a row
 * per respondent. Re-run that script to refresh the numbers.
 */

import type { Dimension } from "@domain/dass";
import raw from "./generated/aggregates.json";
import type { Predictor } from "./predictors";

export type SampleKey = "passed" | "all";

export interface CorrelationRow {
  predictor: Predictor;
  dimension: Dimension;
  r: number;
  p: number;
  ciLow: number;
  ciHigh: number;
  n: number;
}

export interface CoefficientRow {
  predictor: Predictor;
  b: number;
  se: number;
  ciLow: number;
  ciHigh: number;
  p: number;
}

export interface ModelAggregate {
  intercept: number;
  r2Block1: number;
  r2: number;
  coefficients: CoefficientRow[];
  covariance: number[][];
}

export interface PredictorRange {
  predictor: Predictor;
  mean: number;
  min: number;
  max: number;
}

export interface Aggregates {
  sample: { responses: number; passed: number };
  correlations: Record<SampleKey, CorrelationRow[]>;
  regression: {
    n: number;
    predictors: PredictorRange[];
    models: Record<Dimension, ModelAggregate>;
  };
  hoursHistogram: { from: number; to: number; count: number }[];
  hoursDecimalDigit: Record<string, number>;
}

export const aggregates = raw as Aggregates;
