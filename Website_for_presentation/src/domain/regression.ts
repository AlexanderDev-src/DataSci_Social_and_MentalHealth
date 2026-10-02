/** Predictions from a fitted linear model: y = intercept + sum(slope * x). */

export interface LinearModel<K extends string> {
  predictors: readonly K[];
  intercept: number;
  slopes: Record<K, number>;
  /** Covariance of [intercept, ...predictors] in the same order as `predictors`. */
  covariance: readonly (readonly number[])[];
}

export interface Prediction {
  mean: number;
  low: number;
  high: number;
}

export function predict<K extends string>(model: LinearModel<K>, values: Record<K, number>): number {
  return model.predictors.reduce((sum, key) => sum + model.slopes[key] * values[key], model.intercept);
}

/**
 * Predicted mean with its confidence interval: the band where the average score of
 * students with these exact values lies, not the range of single students.
 * se = sqrt(x' V x) with x = [1, ...values].
 */
export function predictWithInterval<K extends string>(
  model: LinearModel<K>,
  values: Record<K, number>,
  z = 1.96,
): Prediction {
  const x = [1, ...model.predictors.map((key) => values[key])];
  let variance = 0;
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < x.length; j++) {
      variance += x[i] * model.covariance[i][j] * x[j];
    }
  }
  const mean = predict(model, values);
  const half = z * Math.sqrt(Math.max(0, variance));
  return { mean, low: mean - half, high: mean + half };
}
