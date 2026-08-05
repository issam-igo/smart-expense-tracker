import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { DeleteExpenseButton } from "@/components/dashboard/delete-expense-button";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/expenses/category-icons";

export function ExpenseList({ expenses, search = "" }: { expenses: Expense[]; search?: string }) {
  if (expenses.length === 0) {
    return search ? (
      <EmptyState
        title="Aucune dépense ne correspond à votre recherche."
        description="Essayez un autre mot-clé ou modifiez vos filtres."
      />
    ) : (
      <EmptyState
        title="Aucune dépense pour ce mois"
        description="Ajoutez une dépense ou sélectionnez un autre mois."
      />
    );
  }

  return (
    <ul className="divide-y divide-black/5 dark:divide-white/10">
      {expenses.map((expense) => {
        const CategoryIcon = CATEGORY_ICONS[expense.category];

        return (
          <li key={expense.id} className="flex items-center gap-3 py-3.5">
            <span
              aria-hidden="true"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${CATEGORY_COLORS[expense.category]}`}
            >
              <CategoryIcon className="h-5 w-5" />
            </span>

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
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Link>
                <DeleteExpenseButton id={expense.id} title={expense.title} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
