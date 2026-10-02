/**
 * Simulated point clouds for teaching what a correlation looks like.
 * These are never respondents; the slides label them as simulated.
 */

/** Seeded uniform generator (mulberry32), so the same seed draws the same cloud. */
function uniform(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormals(count: number, next: () => number): number[] {
  const out: number[] = [];
  while (out.length < count) {
    // Box-Muller; 1 - u keeps log away from 0
    const u = 1 - next();
    const v = next();
    const radius = Math.sqrt(-2 * Math.log(u));
    out.push(radius * Math.cos(2 * Math.PI * v), radius * Math.sin(2 * Math.PI * v));
  }
  return out.slice(0, count);
}

const mean = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

function standardize(xs: readonly number[]): number[] {
  const m = mean(xs);
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
  return xs.map((x) => (x - m) / sd);
}

export interface Basis {
  x: readonly number[];
  noise: readonly number[];
}

/** Two standardized vectors with sample correlation exactly 0. */
export function orthogonalBasis(n: number, seed = 42): Basis {
  const next = uniform(seed);
  const x = standardize(standardNormals(n, next));
  const raw = standardNormals(n, next);
  // remove the part of the noise that leans on x, so blending hits r exactly
  const slope = raw.reduce((a, e, i) => a + e * x[i], 0) / x.reduce((a, v) => a + v * v, 0);
  const noise = standardize(raw.map((e, i) => e - slope * x[i]));
  return { x, noise };
}

/** y = r x + sqrt(1 - r^2) noise, which has sample correlation r with x. */
export function blendWithCorrelation(basis: Basis, r: number): number[] {
  const rest = Math.sqrt(1 - r * r);
  return basis.x.map((x, i) => r * x + rest * basis.noise[i]);
}

/** Sample Pearson correlation. */
export function pearson(xs: readonly number[], ys: readonly number[]): number {
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}
