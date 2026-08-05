import { describe, expect, it } from "vitest";
import { computeSummary } from "@/lib/expenses/summary";
import type { Expense } from "@/types/expense";

function makeExpense(overrides: Partial<Expense>): Expense {
  return {
    id: "1",
    userId: "user-1",
    title: "Dépense",
    amount: 10,
    category: "Other",
    expenseDate: "2026-08-01",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computeSummary", () => {
  it("retourne des valeurs vides pour une liste vide", () => {
    const summary = computeSummary([]);

    expect(summary.total).toBe(0);
    expect(summary.count).toBe(0);
    expect(summary.topCategory).toBeNull();
    expect(summary.byCategory).toEqual([]);
  });

  it("calcule le total en additionnant tous les montants", () => {
    const summary = computeSummary([
      makeExpense({ amount: 10.5, category: "Food" }),
      makeExpense({ amount: 5.25, category: "Transport" }),
    ]);

    expect(summary.total).toBe(15.75);
  });

  it("calcule le nombre de dépenses", () => {
    const summary = computeSummary([
      makeExpense({ amount: 1 }),
      makeExpense({ amount: 2 }),
      makeExpense({ amount: 3 }),
    ]);

    expect(summary.count).toBe(3);
  });

  it("choisit la catégorie principale selon le montant cumulé, pas le nombre d'occurrences", () => {
    // Food : 2 dépenses = 20€ cumulés ; Transport : 1 dépense = 25€.
    // Transport doit gagner malgré moins d'occurrences.
    const summary = computeSummary([
      makeExpense({ amount: 10, category: "Food" }),
      makeExpense({ amount: 10, category: "Food" }),
      makeExpense({ amount: 25, category: "Transport" }),
    ]);

    expect(summary.topCategory).toBe("Transport");
  });

  it("regroupe les montants par catégorie", () => {
    const summary = computeSummary([
      makeExpense({ amount: 10, category: "Food" }),
      makeExpense({ amount: 20, category: "Housing" }),
    ]);

    expect(summary.byCategory).toEqual(
      expect.arrayContaining([
        { category: "Food", total: 10 },
        { category: "Housing", total: 20 },
      ]),
    );
  });

  it("additionne plusieurs dépenses dans la même catégorie en une seule entrée", () => {
    const summary = computeSummary([
      makeExpense({ amount: 10, category: "Food" }),
      makeExpense({ amount: 5, category: "Food" }),
      makeExpense({ amount: 2.5, category: "Food" }),
    ]);

    expect(summary.byCategory).toHaveLength(1);
    expect(summary.byCategory[0]).toEqual({ category: "Food", total: 17.5 });
  });

  it("trie byCategory par montant décroissant", () => {
    const summary = computeSummary([
      makeExpense({ amount: 5, category: "Food" }),
      makeExpense({ amount: 50, category: "Housing" }),
      makeExpense({ amount: 20, category: "Transport" }),
    ]);

    expect(summary.byCategory.map((entry) => entry.category)).toEqual([
      "Housing",
      "Transport",
      "Food",
    ]);
  });
});
