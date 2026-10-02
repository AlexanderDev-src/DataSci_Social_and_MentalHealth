/** Inference for a Pearson correlation r from n pairs. */

import { normalCdf, normalQuantile } from "./normal";
import { studentTCdf, studentTQuantile } from "./studentT";

/** Two-sided p-value of H0: rho = 0, through t = r * sqrt((n - 2) / (1 - r^2)). */
export function correlationPValue(r: number, n: number): number {
  const df = n - 2;
  if (Math.abs(r) >= 1) return 0;
  const t = Math.abs(r) * Math.sqrt(df / (1 - r * r));
  return 2 * (1 - studentTCdf(t, df));
}

/** Smallest |r| that is significant at alpha (two-sided) with n pairs. */
export function criticalR(n: number, alpha = 0.05): number {
  const df = n - 2;
  const t = studentTQuantile(1 - alpha / 2, df);
  return t / Math.sqrt(t * t + df);
}

/** Confidence interval of r through the Fisher z transform. */
export function fisherInterval(r: number, n: number, level = 0.95): [number, number] {
  const z = Math.atanh(r);
  const half = normalQuantile(1 - (1 - level) / 2) / Math.sqrt(n - 3);
  return [Math.tanh(z - half), Math.tanh(z + half)];
}

/** Chance that a two-sided test at alpha detects a true correlation rho with n pairs (Fisher z). */
export function correlationPower(rho: number, n: number, alpha = 0.05): number {
  if (n <= 3) return alpha;
  const shift = Math.abs(Math.atanh(rho)) * Math.sqrt(n - 3);
  const z = normalQuantile(1 - alpha / 2);
  return normalCdf(shift - z) + normalCdf(-shift - z);
}

/** Pairs needed to reach the given power for a true correlation rho. */
export function sampleSizeForPower(rho: number, power = 0.8, alpha = 0.05): number {
  const z = normalQuantile(1 - alpha / 2) + normalQuantile(power);
  return Math.ceil((z / Math.atanh(Math.abs(rho))) ** 2 + 3);
}
