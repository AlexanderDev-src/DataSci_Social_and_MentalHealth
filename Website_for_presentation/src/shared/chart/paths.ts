/** SVG path strings for lines and filled bands, from coordinates already in SVG units. */

export function linePath(xs: readonly number[], ys: readonly number[]): string {
  return xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join("");
}

/** Closed band between two curves that share their x positions. */
export function bandPath(xs: readonly number[], lows: readonly number[], highs: readonly number[]): string {
  const top = xs.map((x, i) => `${i ? "L" : "M"}${x},${highs[i]}`).join("");
  const bottom = xs
    .map((x, i) => `L${x},${lows[i]}`)
    .reverse()
    .join("");
  return `${top}${bottom}Z`;
}
