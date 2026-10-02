import { correlationsFor } from "@data/correlations";
import { bonferroniThreshold, familywiseErrorRate } from "@domain/stats/multipleTesting";
import { useState } from "react";

export const ALPHA = 0.05;

/** All 24 correlations (8 predictors x 3 dimensions) judged against alpha / k. */
export function useMultipleTesting() {
  const tests = correlationsFor();
  const [k, setK] = useState(1);
  const threshold = bonferroniThreshold(ALPHA, k);
  const survivors = tests.filter((t) => t.p < threshold);

  return {
    tests,
    k,
    setK,
    maxTests: tests.length,
    threshold,
    survivors,
    falseAlarmChance: familywiseErrorRate(ALPHA, k),
  };
}
