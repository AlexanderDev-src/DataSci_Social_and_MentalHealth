import { describe, expect, it } from "vitest";
import { severityOf } from "./dass";
import { predict, predictWithInterval, type LinearModel } from "./regression";
import { blendWithCorrelation, orthogonalBasis, pearson } from "./simulate";

describe("severityOf", () => {
  it("uses the doubled-score cutoffs", () => {
    expect(severityOf("depression", 9)).toBe("normal");
    expect(severityOf("depression", 10)).toBe("mild");
    expect(severityOf("anxiety", 20)).toBe("extreme");
    expect(severityOf("stress", 33)).toBe("severe");
  });
});

describe("regression", () => {
  const model: LinearModel<"a" | "b"> = {
    predictors: ["a", "b"],
    intercept: 1,
    slopes: { a: 2, b: -1 },
    covariance: [
      [0.25, 0, 0],
      [0, 0.04, 0],
      [0, 0, 0],
    ],
  };

  it("adds the slopes to the intercept", () => {
    expect(predict(model, { a: 3, b: 4 })).toBe(3);
  });

  it("widens the interval as x moves away from zero", () => {
    const near = predictWithInterval(model, { a: 0, b: 0 });
    const far = predictWithInterval(model, { a: 10, b: 0 });
    expect(near.high - near.low).toBeCloseTo(2 * 1.96 * 0.5, 6);
    expect(far.high - far.low).toBeGreaterThan(near.high - near.low);
  });
});

describe("simulated cloud", () => {
  it("has exactly the requested correlation", () => {
    const basis = orthogonalBasis(107);
    for (const r of [-0.6, -0.148, 0, 0.3, 0.9]) {
      expect(pearson(basis.x, blendWithCorrelation(basis, r))).toBeCloseTo(r, 10);
    }
  });
});
