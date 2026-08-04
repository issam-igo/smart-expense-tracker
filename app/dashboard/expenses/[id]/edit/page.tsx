import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { expenseIdSchema } from "@/lib/validation/expense";
import { toExpense, type ExpenseRow } from "@/lib/expenses/mappers";
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

  const idResult = expenseIdSchema.safeParse(id);
  if (!idResult.success) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Aucun filtre user_id ici : la policy RLS SELECT restreint déjà la ligne
  // accessible à celles de l'utilisateur connecté.
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", idResult.data)
    .maybeSingle();

  if (error) {
    notFound();
  }

  if (!data) {
    notFound();
  }

  const expense = toExpense(data as ExpenseRow);

  return (
    <ExpenseFormPage
      title="Modifier la dépense"
      description="Mettez à jour les détails de cette dépense."
    >
      <ExpenseForm
        mode="edit"
        id={expense.id}
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
