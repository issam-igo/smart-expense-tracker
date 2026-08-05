import { describe, expect, it } from "vitest";
import { toCsv, type ExportableExpense } from "@/lib/expenses/csv";

function makeExpense(overrides: Partial<ExportableExpense>): ExportableExpense {
  return {
    title: "Courses",
    category: "Food",
    amount: 12.5,
    expense_date: "2026-08-01",
    description: null,
    ...overrides,
  };
}

const UTF8_BOM = String.fromCharCode(0xfeff);

describe("toCsv", () => {
  it("inclut une ligne d'en-tête correcte", () => {
    const csv = toCsv([]);
    const firstLine = csv.replace(UTF8_BOM, "").split("\r\n")[0];

    expect(firstLine).toBe("Title,Category,Amount,Expense Date,Description");
  });

  it("formate une ligne avec des valeurs normales", () => {
    const csv = toCsv([makeExpense({ description: "Marché" })]);
    const lines = csv.replace(UTF8_BOM, "").split("\r\n");

    expect(lines[1]).toBe("Courses,Food,12.50,2026-08-01,Marché");
  });

  it("entoure de guillemets un champ contenant une virgule", () => {
    const csv = toCsv([makeExpense({ title: "Café, thé et biscuits" })]);
    const lines = csv.replace(UTF8_BOM, "").split("\r\n");

    expect(lines[1]).toContain('"Café, thé et biscuits"');
  });

  it("échappe les guillemets en les doublant", () => {
    const csv = toCsv([makeExpense({ title: 'Resto "Le Gourmet"' })]);
    const lines = csv.replace(UTF8_BOM, "").split("\r\n");

    expect(lines[1]).toContain('"Resto ""Le Gourmet"""');
  });

  it("entoure de guillemets un champ contenant un saut de ligne", () => {
    const csv = toCsv([makeExpense({ description: "Ligne 1\nLigne 2" })]);

    expect(csv).toContain('"Ligne 1\nLigne 2"');
  });

  it("laisse un champ vide quand la description est null", () => {
    const csv = toCsv([makeExpense({ description: null })]);
    const lines = csv.replace(UTF8_BOM, "").split("\r\n");

    expect(lines[1]).toBe("Courses,Food,12.50,2026-08-01,");
  });

  it("préserve les caractères accentués et ajoute le BOM UTF-8", () => {
    const csv = toCsv([makeExpense({ title: "Déjeuner à la crêperie" })]);

    expect(csv.startsWith(UTF8_BOM)).toBe(true);
    expect(csv).toContain("Déjeuner à la crêperie");
  });
});
