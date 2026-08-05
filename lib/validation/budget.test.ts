import { describe, expect, it } from "vitest";
import { budgetUpsertSchema, monthKeySchema } from "@/lib/validation/budget";

describe("monthKeySchema", () => {
  it("accepte un mois valide au format YYYY-MM", () => {
    expect(monthKeySchema.safeParse("2026-08").success).toBe(true);
  });

  it("refuse un mois invalide", () => {
    expect(monthKeySchema.safeParse("2026-13").success).toBe(false);
    expect(monthKeySchema.safeParse("2026/08").success).toBe(false);
    expect(monthKeySchema.safeParse("not-a-month").success).toBe(false);
  });
});

describe("budgetUpsertSchema", () => {
  it("accepte un montant positif", () => {
    expect(budgetUpsertSchema.safeParse({ amount: 500 }).success).toBe(true);
  });

  it("refuse un montant nul", () => {
    expect(budgetUpsertSchema.safeParse({ amount: 0 }).success).toBe(false);
  });

  it("refuse un montant négatif", () => {
    expect(budgetUpsertSchema.safeParse({ amount: -100 }).success).toBe(false);
  });

  it("refuse les clés inconnues", () => {
    expect(budgetUpsertSchema.safeParse({ amount: 500, month: "2026-08" }).success).toBe(false);
  });
});
