import { describe, expect, it } from "vitest";
import { correlationPValue, correlationPower, criticalR, fisherInterval, sampleSizeForPower } from "./correlation";
import { normalCdf, normalQuantile } from "./normal";
import { studentTQuantile } from "./studentT";

// expected values are the ones chapters 4 and 5 of the report print

describe("normal", () => {
  it("matches the textbook quantiles", () => {
    expect(normalQuantile(0.975)).toBeCloseTo(1.959964, 5);
    expect(normalCdf(1.959964)).toBeCloseTo(0.975, 6);
  });
});

describe("student t", () => {
  it("matches the critical value for df = 105", () => {
    expect(studentTQuantile(0.975, 105)).toBeCloseTo(1.98282, 4);
  });
});

describe("correlation", () => {
  it("gives the report's p-values for n = 107", () => {
    expect(correlationPValue(-0.1363, 107)).toBeCloseTo(0.1615, 3);
    expect(correlationPValue(0.1457, 107)).toBeCloseTo(0.1344, 3);
    expect(correlationPValue(-0.3195, 107)).toBeCloseTo(0.0008, 3);
  });

  it("gives the Fisher interval the export script writes", () => {
    const [low, high] = fisherInterval(-0.1363, 107);
    expect(low).toBeCloseTo(-0.318, 3);
    expect(high).toBeCloseTo(0.055, 3);
  });

  it("needs |r| of about 0.19 to be significant with 107 respondents", () => {
    expect(criticalR(107)).toBeCloseTo(0.19, 2);
  });

  it("reproduces the power figures in section 5.2", () => {
    const orben = Math.sqrt(0.004);
    expect(correlationPower(orben, 107)).toBeCloseTo(0.1, 2);
    expect(sampleSizeForPower(orben)).toBeCloseTo(1963, -1);
    expect(correlationPower(0.146, 107)).toBeCloseTo(0.32, 2);
    expect(sampleSizeForPower(0.146)).toBe(366);
  });
});
