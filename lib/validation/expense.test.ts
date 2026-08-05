import { describe, expect, it } from "vitest";
import { expenseCreateSchema, expenseUpdateSchema } from "@/lib/validation/expense";

const validExpense = {
  title: "Courses",
  amount: 42.5,
  category: "Food" as const,
  expenseDate: "2026-08-01",
  description: "Marché du dimanche",
};

describe("expenseCreateSchema", () => {
  it("accepte une création valide", () => {
    const result = expenseCreateSchema.safeParse(validExpense);

    expect(result.success).toBe(true);
  });

  it("refuse un titre vide", () => {
    const result = expenseCreateSchema.safeParse({ ...validExpense, title: "" });

    expect(result.success).toBe(false);
  });

  it("refuse un montant nul", () => {
    const result = expenseCreateSchema.safeParse({ ...validExpense, amount: 0 });

    expect(result.success).toBe(false);
  });

  it("refuse un montant négatif", () => {
    const result = expenseCreateSchema.safeParse({ ...validExpense, amount: -10 });

    expect(result.success).toBe(false);
  });

  it("refuse une catégorie invalide", () => {
    const result = expenseCreateSchema.safeParse({ ...validExpense, category: "Invalide" });

    expect(result.success).toBe(false);
  });

  it("refuse une date invalide", () => {
    const result = expenseCreateSchema.safeParse({ ...validExpense, expenseDate: "not-a-date" });

    expect(result.success).toBe(false);
  });

  it("refuse une description trop longue", () => {
    const result = expenseCreateSchema.safeParse({
      ...validExpense,
      description: "a".repeat(501),
    });

    expect(result.success).toBe(false);
  });
});

describe("expenseUpdateSchema", () => {
  it("accepte une mise à jour partielle valide", () => {
    const result = expenseUpdateSchema.safeParse({ amount: 55 });

    expect(result.success).toBe(true);
  });

  it("refuse une mise à jour vide", () => {
    const result = expenseUpdateSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("refuse les clés inconnues", () => {
    const result = expenseUpdateSchema.safeParse({ amount: 10, foo: "bar" });

    expect(result.success).toBe(false);
  });

  it("accepte description: null pour vider une description existante", () => {
    const result = expenseUpdateSchema.safeParse({ description: null });

    expect(result.success).toBe(true);
  });
});
