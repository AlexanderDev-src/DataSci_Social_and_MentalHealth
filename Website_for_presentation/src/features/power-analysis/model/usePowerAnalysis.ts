import { EFFECT_PRESETS, STUDY_N } from "@data/power";
import { correlationPower, criticalR, sampleSizeForPower } from "@domain/stats/correlation";
import { useMemo, useState } from "react";

export const N_MIN = 20;
export const N_MAX = 3000;
const CURVE_POINTS = 60;

/** The n slider moves on a log scale so 20 and 3,000 people both fit on one track. */
export const nFromPosition = (position: number) => Math.round(10 ** position);
export const positionFromN = (n: number) => Math.log10(n);

/** How likely a study of n people is to detect a true correlation of rho. */
export function usePowerAnalysis() {
  const [presetKey, setPresetKey] = useState(EFFECT_PRESETS[1].key);
  const [n, setN] = useState(STUDY_N);
  const rho = EFFECT_PRESETS.find((p) => p.key === presetKey)!.rho;

  const curve = useMemo(
    () =>
      Array.from({ length: CURVE_POINTS }, (_, i) => {
        const size = 10 ** (positionFromN(N_MIN) + ((positionFromN(N_MAX) - positionFromN(N_MIN)) * i) / (CURVE_POINTS - 1));
        return { n: size, power: correlationPower(rho, size) };
      }),
    [rho],
  );

  return {
    presetKey,
    setPresetKey,
    rho,
    n,
    setN,
    curve,
    power: correlationPower(rho, n),
    powerAtStudy: correlationPower(rho, STUDY_N),
    needed: sampleSizeForPower(rho, 0.8),
    critical: criticalR(n),
  };
}
