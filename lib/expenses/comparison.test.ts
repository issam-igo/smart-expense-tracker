import { describe, expect, it } from "vitest";
import { computeMonthlyComparison } from "@/lib/expenses/comparison";

describe("computeMonthlyComparison", () => {
  it("détecte une hausse", () => {
    const comparison = computeMonthlyComparison(150, 100);

    expect(comparison.trend).toBe("up");
    expect(comparison.difference).toBe(50);
    expect(comparison.percentageChange).toBe(50);
  });

  it("détecte une baisse", () => {
    const comparison = computeMonthlyComparison(80, 100);

    expect(comparison.trend).toBe("down");
    expect(comparison.difference).toBe(-20);
    expect(comparison.percentageChange).toBe(-20);
  });

  it("détecte une stabilité quand les deux mois sont égaux et positifs", () => {
    const comparison = computeMonthlyComparison(100, 100);

    expect(comparison.trend).toBe("stable");
    expect(comparison.percentageChange).toBe(0);
  });

  it("retourne 'new' sans division par zéro quand le mois précédent est à zéro", () => {
    const comparison = computeMonthlyComparison(120, 0);

    expect(comparison.trend).toBe("new");
    expect(comparison.percentageChange).toBeNull();
    expect(comparison.difference).toBe(120);
  });

  it("retourne 'stable' quand les deux mois sont à zéro", () => {
    const comparison = computeMonthlyComparison(0, 0);

    expect(comparison.trend).toBe("stable");
    expect(comparison.difference).toBe(0);
    expect(comparison.percentageChange).toBeNull();
  });

  it("calcule difference de façon exacte", () => {
    const comparison = computeMonthlyComparison(275.5, 200.25);

    expect(comparison.difference).toBe(75.25);
  });

  it("ne retourne jamais Infinity ou NaN", () => {
    const cases: Array<[number, number]> = [
      [0, 0],
      [100, 0],
      [0, 100],
      [100, 100],
      [1000000, 1],
    ];

    for (const [current, previous] of cases) {
      const comparison = computeMonthlyComparison(current, previous);

      expect(Number.isFinite(comparison.difference)).toBe(true);
      if (comparison.percentageChange !== null) {
        expect(Number.isFinite(comparison.percentageChange)).toBe(true);
      }
    }
  });
});
