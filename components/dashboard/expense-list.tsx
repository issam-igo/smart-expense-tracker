import type { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";

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
        <li key={expense.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{expense.title}</p>
            <p className="truncate text-xs text-foreground/50">
              {expense.category} · {formatDate(expense.expenseDate)}
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-foreground">
            {formatCurrency(expense.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
