/** A linear map from data values to SVG coordinates. */

export interface LinearScale {
  (value: number): number;
  domain: readonly [number, number];
  range: readonly [number, number];
  ticks: (count?: number) => number[];
}

export function linearScale(domain: readonly [number, number], range: readonly [number, number]): LinearScale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const scale = ((value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)) as LinearScale;
  scale.domain = domain;
  scale.range = range;
  scale.ticks = (count = 5) => niceTicks(d0, d1, count);
  return scale;
}

/** Round tick values (1, 2 or 5 times a power of ten) that fall inside [low, high]. */
export function niceTicks(low: number, high: number, count = 5): number[] {
  const [lo, hi] = low < high ? [low, high] : [high, low];
  const raw = (hi - lo) / Math.max(1, count);
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) {
    ticks.push(Number(v.toFixed(10)));
  }
  return ticks;
}

export const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
