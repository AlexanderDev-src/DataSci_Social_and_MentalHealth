/** Bonferroni: run k tests at alpha / k each, so the chance of any false alarm stays below alpha. */
export function bonferroniThreshold(alpha: number, tests: number): number {
  return alpha / Math.max(1, tests);
}

/** Chance of at least one false alarm across k independent tests that are each run at alpha. */
export function familywiseErrorRate(alpha: number, tests: number): number {
  return 1 - (1 - alpha) ** tests;
}
