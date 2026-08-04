import Link from "next/link";
import type { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { DeleteExpenseButton } from "@/components/dashboard/delete-expense-button";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Aucune dépense pour le moment"
        description="Ajoutez votre première dépense pour la voir apparaître ici."
      />
    );
  }

  return (
    <ul className="divide-y divide-black/5 dark:divide-white/10">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center gap-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{expense.title}</p>
            <p className="truncate text-xs text-foreground/50">
              {expense.category} · {formatDate(expense.expenseDate)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(expense.amount)}
            </span>
            <div className="flex items-center gap-1">
              <Link
                href={`/dashboard/expenses/${expense.id}/edit`}
                title={`Modifier ${expense.title}`}
                aria-label={`Modifier ${expense.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-md text-foreground/50 transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:hover:bg-white/10"
              >
                <EditIcon />
              </Link>
              <DeleteExpenseButton id={expense.id} title={expense.title} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"
      />
    </svg>
  );
}
