export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  description?: string;
  createdAt: string;
}
