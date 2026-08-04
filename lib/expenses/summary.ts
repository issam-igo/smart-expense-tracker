import type { Expense, ExpenseCategory } from "@/types/expense";

export interface CategoryTotal {
  category: ExpenseCategory;
  total: number;
}

export interface ExpenseSummary {
  total: number;
  count: number;
  topCategory: ExpenseCategory | null;
  monthTotal: number;
  byCategory: CategoryTotal[];
}

export function computeSummary(expenses: Expense[]): ExpenseSummary {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const totalsByCategory = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    totalsByCategory.set(
      expense.category,
      (totalsByCategory.get(expense.category) ?? 0) + expense.amount,
    );
  }

  const byCategory = [...totalsByCategory.entries()]
    .map(([category, categoryTotal]) => ({ category, total: categoryTotal }))
    .sort((a, b) => b.total - a.total);

  const topCategory = byCategory[0]?.category ?? null;

  // Le tableau reçu est déjà filtré sur la période affichée par l'appelant (le mois
  // sélectionné sur le dashboard) : monthTotal est donc simplement le total de ce lot.
  return {
    total,
    count: expenses.length,
    topCategory,
    monthTotal: total,
    byCategory,
  };
}
