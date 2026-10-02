/** Number formatting for the slides. A real minus sign (−) instead of the hyphen. */

const MINUS = "−";

export function formatNumber(value: number, digits = 2): string {
  const text = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return value < 0 && Number(text.replace(/,/g, "")) !== 0 ? MINUS + text : text;
}

export function formatSigned(value: number, digits = 2): string {
  const text = formatNumber(value, digits);
  return value > 0 && !text.startsWith(MINUS) ? `+${text}` : text;
}

/** "0.134", or "< 0.001" when it is that small. */
export function formatPValue(p: number): string {
  return p < 0.001 ? "< 0.001" : formatNumber(p, 3);
}

/** "p = 0.134", or "p < 0.001". */
export function formatP(p: number): string {
  return p < 0.001 ? "p < 0.001" : `p = ${formatPValue(p)}`;
}

export function formatPercent(share: number, digits = 1): string {
  return `${formatNumber(share * 100, digits)}%`;
}
