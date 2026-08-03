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

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTotal = expenses
    .filter((expense) => expense.expenseDate.startsWith(currentMonthKey))
    .reduce((sum, expense) => sum + expense.amount, 0);

  return {
    total,
    count: expenses.length,
    topCategory,
    monthTotal,
    byCategory,
  };
}
