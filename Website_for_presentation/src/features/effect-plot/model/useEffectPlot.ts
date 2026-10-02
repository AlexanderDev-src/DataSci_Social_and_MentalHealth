import type { Predictor } from "@data/predictors";
import { coefficientOf, MEAN_VALUES, MODELS, PREDICTOR_RANGE } from "@data/regression";
import type { Dimension } from "@domain/dass";
import { predictWithInterval } from "@domain/regression";
import { useMemo, useState } from "react";

export const EFFECT_PREDICTORS: readonly Predictor[] = ["social_media_hours", "financial_sufficiency", "sleep_quality"];

const SAMPLES = 41;

/**
 * Question 7: one predictor moves, every other one stays at its mean, and the
 * equation draws the predicted score with its 95% confidence band.
 */
export function useEffectPlot() {
  const [predictor, setPredictorState] = useState<Predictor>("social_media_hours");
  const [dimension, setDimension] = useState<Dimension>("stress");
  const [value, setValue] = useState(MEAN_VALUES.social_media_hours);

  const range = PREDICTOR_RANGE[predictor];
  const model = MODELS[dimension];

  const curve = useMemo(
    () =>
      Array.from({ length: SAMPLES }, (_, i) => {
        const x = range.min + ((range.max - range.min) * i) / (SAMPLES - 1);
        return { x, ...predictWithInterval(model, { ...MEAN_VALUES, [predictor]: x }) };
      }),
    [model, predictor, range],
  );

  const current = predictWithInterval(model, { ...MEAN_VALUES, [predictor]: value });

  return {
    predictor,
    dimension,
    value,
    range,
    curve,
    current,
    coefficient: coefficientOf(dimension, predictor),
    setDimension,
    setValue,
    setPredictor(next: Predictor) {
      setPredictorState(next);
      setValue(PREDICTOR_RANGE[next].mean);
    },
  };
}
