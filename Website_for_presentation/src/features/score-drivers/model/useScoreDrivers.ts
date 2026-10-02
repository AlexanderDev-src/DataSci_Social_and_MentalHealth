import type { Predictor } from "@data/predictors";
import { MEAN_VALUES, MODELS } from "@data/regression";
import { DIMENSIONS, type Dimension } from "@domain/dass";
import { predictWithInterval, type Prediction } from "@domain/regression";
import { useMemo, useState } from "react";

export interface DimensionPrediction extends Prediction {
  dimension: Dimension;
  /** Change from the student who sits at the mean of every predictor. */
  change: number;
}

const BASELINE = Object.fromEntries(
  DIMENSIONS.map((d) => [d, predictWithInterval(MODELS[d], MEAN_VALUES).mean]),
) as Record<Dimension, number>;

/** Eight sliders, one per predictor, feeding the three fitted regression equations. */
export function useScoreDrivers() {
  const [values, setValues] = useState<Record<Predictor, number>>(MEAN_VALUES);

  const predictions = useMemo<DimensionPrediction[]>(
    () =>
      DIMENSIONS.map((dimension) => {
        const prediction = predictWithInterval(MODELS[dimension], values);
        return { dimension, ...prediction, change: prediction.mean - BASELINE[dimension] };
      }),
    [values],
  );

  return {
    values,
    predictions,
    baseline: BASELINE,
    changed: Object.keys(values).some((key) => values[key as Predictor] !== MEAN_VALUES[key as Predictor]),
    setValue: (predictor: Predictor, value: number) => setValues((current) => ({ ...current, [predictor]: value })),
    reset: () => setValues(MEAN_VALUES),
  };
}
