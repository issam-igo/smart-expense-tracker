import type { BudgetStatus } from "@/lib/expenses/budget";
import { formatCurrency } from "@/lib/format";
import { BudgetFormDialog } from "@/components/dashboard/budget-form-dialog";

export function BudgetOverview({
  month,
  status,
}: {
  month: string;
  status: BudgetStatus | null;
}) {
  return (
    <section
      aria-labelledby="budget-heading"
      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="budget-heading" className="text-base font-semibold text-foreground">
          Budget mensuel
        </h2>
        <BudgetFormDialog month={month} currentAmount={status?.budgetAmount ?? null} />
      </div>

      {status === null ? (
        <p className="mt-4 text-sm text-foreground/60">Aucun budget défini pour ce mois.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                Budget
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCurrency(status.budgetAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                Dépensé
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCurrency(status.spent)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                {status.remaining < 0 ? "Dépassement" : "Restant"}
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  status.remaining < 0 ? "text-red-600 dark:text-red-400" : "text-foreground"
                }`}
              >
                {formatCurrency(Math.abs(status.remaining))}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                Utilisé
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {Math.round(status.percentageUsed)} %
              </p>
            </div>
          </div>

          <BudgetProgressBar percentageUsed={status.percentageUsed} />
        </div>
      )}
    </section>
  );
}

function BudgetProgressBar({ percentageUsed }: { percentageUsed: number }) {
  const clampedWidth = Math.min(Math.max(percentageUsed, 0), 100);
  const isOver = percentageUsed > 100;
  const isNearLimit = !isOver && percentageUsed >= 80;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentageUsed)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Pourcentage du budget utilisé"
      className="h-2.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10"
    >
      <div
        className={`h-full rounded-full transition-all ${
          isOver ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-brand"
        }`}
        style={{ width: `${clampedWidth}%` }}
      />
    </div>
  );
}
