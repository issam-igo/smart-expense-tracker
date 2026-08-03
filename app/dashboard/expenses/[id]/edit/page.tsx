import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockExpenses } from "@/lib/expenses/mock-data";
import { ExpenseFormPage } from "@/components/dashboard/expense-form-page";
import { ExpenseForm } from "@/components/dashboard/expense-form";

export const metadata: Metadata = {
  title: "Modifier la dépense — Smart Expense Tracker",
};

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expense = mockExpenses.find((item) => item.id === id);

  if (!expense) {
    notFound();
  }

  return (
    <ExpenseFormPage
      title="Modifier la dépense"
      description="Mettez à jour les détails de cette dépense."
    >
      <ExpenseForm
        mode="edit"
        initialValues={{
          title: expense.title,
          amount: expense.amount.toString(),
          category: expense.category,
          expenseDate: expense.expenseDate,
          description: expense.description ?? "",
        }}
      />
    </ExpenseFormPage>
  );
}
