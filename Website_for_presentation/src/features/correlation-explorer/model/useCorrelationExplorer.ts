import { correlationOf } from "@data/correlations";
import type { Predictor } from "@data/predictors";
import type { Dimension } from "@domain/dass";
import { blendWithCorrelation, orthogonalBasis } from "@domain/simulate";
import { correlationPValue, criticalR } from "@domain/stats/correlation";
import { useTweenedValue } from "@shared/animation/useTween";
import { useMemo, useState } from "react";

export interface Preset {
  key: string;
  label: string;
  predictor: Predictor;
  dimension: Dimension;
  r: number;
}

const preset = (key: string, label: string, predictor: Predictor, dimension: Dimension): Preset => ({
  key,
  label,
  predictor,
  dimension,
  r: correlationOf(predictor, dimension).r,
});

export const PRESETS: readonly Preset[] = [
  preset("hours-depression", "ชั่วโมง กับ ซึมเศร้า", "social_media_hours", "depression"),
  preset("hours-anxiety", "ชั่วโมง กับ วิตกกังวล", "social_media_hours", "anxiety"),
  preset("hours-stress", "ชั่วโมง กับ เครียด", "social_media_hours", "stress"),
  preset("sleep-stress", "คุณภาพการนอน กับ เครียด", "sleep_quality", "stress"),
  preset("money-depression", "การเงิน กับ ซึมเศร้า", "financial_sufficiency", "depression"),
];

export const SAMPLE_SIZE = 107;
export const R_LIMIT = 0.6;

/** The r slider, the simulated cloud it bends, and what that r would mean with 107 people. */
export function useCorrelationExplorer() {
  const [r, setR] = useState(PRESETS[1].r);
  const [presetKey, setPresetKey] = useState<string | null>(PRESETS[1].key);
  const [variables, setVariables] = useState<Preset>(PRESETS[1]);

  const basis = useMemo(() => orthogonalBasis(SAMPLE_SIZE, 42), []);
  const shownR = useTweenedValue(r);
  const points = useMemo(() => {
    const ys = blendWithCorrelation(basis, shownR);
    return basis.x.map((x, i) => ({ x, y: ys[i] }));
  }, [basis, shownR]);

  const critical = useMemo(() => criticalR(SAMPLE_SIZE), []);

  return {
    r,
    shownR,
    points,
    variables,
    presetKey,
    critical,
    explained: r * r,
    p: correlationPValue(r, SAMPLE_SIZE),
    significant: Math.abs(r) >= critical,
    choosePreset(key: string) {
      const chosen = PRESETS.find((p) => p.key === key);
      if (!chosen) return;
      setPresetKey(chosen.key);
      setVariables(chosen);
      setR(chosen.r);
    },
    setR(value: number) {
      setPresetKey(null);
      setR(value);
    },
  };
}
