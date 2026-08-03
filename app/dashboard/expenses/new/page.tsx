import type { Metadata } from "next";
import { ExpenseForm } from "@/components/dashboard/expense-form";

export const metadata: Metadata = {
  title: "Ajouter une dépense — Smart Expense Tracker",
};

export default function NewExpensePage() {
  return (
    <div className="mx-auto max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ajouter une dépense
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Renseignez les détails de votre dépense.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <ExpenseForm />
      </div>
    </div>
  );
}
