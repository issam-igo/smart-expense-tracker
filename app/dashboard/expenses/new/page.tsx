import type { Metadata } from "next";
import { ExpenseFormPage } from "@/components/dashboard/expense-form-page";
import { ExpenseForm } from "@/components/dashboard/expense-form";

export const metadata: Metadata = {
  title: "Ajouter une dépense — Smart Expense Tracker",
};

export default function NewExpensePage() {
  return (
    <ExpenseFormPage
      title="Ajouter une dépense"
      description="Renseignez les détails de votre dépense."
    >
      <ExpenseForm />
    </ExpenseFormPage>
  );
}
