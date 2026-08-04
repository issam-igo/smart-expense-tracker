import type { Expense } from "@/types/expense";
import type { ExpenseCreateInput, ExpenseUpdateInput } from "@/lib/validation/expense";

// Forme d'une ligne renvoyée par Supabase (colonnes snake_case).
export interface ExpenseRow {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
  description: string | null;
  created_at: string;
}

// L'API expose le modèle camelCase déjà utilisé par le reste de l'application
// (types/expense.ts) ; ce fichier fait le pont avec les colonnes snake_case de Postgres.
export function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    amount: Number(row.amount),
    category: row.category as Expense["category"],
    expenseDate: row.expense_date,
    description: row.description ?? undefined,
    createdAt: row.created_at,
  };
}

export function toInsertRow(userId: string, input: ExpenseCreateInput) {
  return {
    user_id: userId,
    title: input.title,
    amount: input.amount,
    category: input.category,
    expense_date: input.expenseDate,
    description: input.description ?? null,
  };
}

export function toUpdateRow(input: ExpenseUpdateInput) {
  const row: Record<string, unknown> = {};

  if (input.title !== undefined) row.title = input.title;
  if (input.amount !== undefined) row.amount = input.amount;
  if (input.category !== undefined) row.category = input.category;
  if (input.expenseDate !== undefined) row.expense_date = input.expenseDate;
  if (input.description !== undefined) row.description = input.description;

  return row;
}
