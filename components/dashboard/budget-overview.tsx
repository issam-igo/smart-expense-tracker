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
      className="flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="budget-heading" className="text-base font-semibold text-foreground">
          Résumé du budget
        </h2>
        <BudgetFormDialog month={month} currentAmount={status?.budgetAmount ?? null} />
      </div>

      {status === null ? (
        <p className="mt-4 flex-1 text-sm text-foreground/60">Aucun budget défini pour ce mois.</p>
      ) : (
        <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-4 py-4">
          <CircularBudgetGauge percentageUsed={status.percentageUsed} />

          <div className="text-center">
            <p className="text-sm text-foreground/60">
              {formatCurrency(status.spent)}{" "}
              <span className="text-foreground/40">/ {formatCurrency(status.budgetAmount)}</span>
            </p>
            <p
              className={`mt-1 text-sm font-medium ${
                status.remaining < 0 ? "text-red-600 dark:text-red-400" : "text-foreground"
              }`}
            >
              {status.remaining < 0
                ? `Dépassement de ${formatCurrency(Math.abs(status.remaining))}`
                : `Il vous reste ${formatCurrency(status.remaining)} à dépenser ce mois-ci`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function CircularBudgetGauge({ percentageUsed }: { percentageUsed: number }) {
  const size = 128;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percentageUsed, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  const isOver = percentageUsed > 100;
  const isNearLimit = !isOver && percentageUsed >= 80;
  const strokeClassName = isOver ? "stroke-red-500" : isNearLimit ? "stroke-amber-500" : "stroke-brand";

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentageUsed)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Pourcentage du budget utilisé"
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-black/5 dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ${strokeClassName}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-2xl font-bold ${
            isOver ? "text-red-600 dark:text-red-400" : "text-foreground"
          }`}
        >
          {Math.round(percentageUsed)}%
        </span>
      </div>
    </div>
  );
}
