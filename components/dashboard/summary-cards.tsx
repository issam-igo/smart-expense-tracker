import { Wallet, Receipt, Tag, CalendarDays, type LucideIcon } from "lucide-react";
import type { ExpenseSummary } from "@/lib/expenses/summary";
import type { MonthlyComparison } from "@/lib/expenses/comparison";
import type { BudgetStatus } from "@/lib/expenses/budget";
import { formatCurrency, formatMonthName } from "@/lib/format";

export function SummaryCards({
  summary,
  monthTotal,
  comparison,
  previousMonth,
  budgetStatus,
}: {
  summary: ExpenseSummary;
  monthTotal: number;
  comparison: MonthlyComparison | null;
  previousMonth: string;
  budgetStatus: BudgetStatus | null;
}) {
  const topCategoryTotal = summary.byCategory.find(
    (entry) => entry.category === summary.topCategory,
  )?.total;
  const topCategoryPercentage =
    summary.topCategory && summary.total > 0 && topCategoryTotal !== undefined
      ? (topCategoryTotal / summary.total) * 100
      : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        icon={Wallet}
        iconClassName="bg-brand/10 text-brand"
        label="Total des dépenses"
        value={formatCurrency(summary.total)}
      />

      <SummaryCard
        icon={Receipt}
        iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        label="Nombre de dépenses"
        value={summary.count.toString()}
      />

      <SummaryCard
        icon={Tag}
        iconClassName="bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
        label="Catégorie principale"
        value={summary.topCategory ?? "—"}
      >
        {topCategoryPercentage !== null && (
          <div className="mt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{ width: `${Math.min(topCategoryPercentage, 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-foreground/50">
              {Math.round(topCategoryPercentage)} % du total
            </p>
          </div>
        )}
      </SummaryCard>

      <SummaryCard
        icon={CalendarDays}
        iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        label="Dépenses du mois"
        value={formatCurrency(monthTotal)}
      >
        {comparison && <ComparisonIndicator comparison={comparison} previousMonth={previousMonth} />}
        {budgetStatus && (
          <p className="mt-1.5 text-xs font-medium text-foreground/50">
            Budget : {formatCurrency(budgetStatus.budgetAmount)} ·{" "}
            {Math.round(budgetStatus.percentageUsed)} %
          </p>
        )}
      </SummaryCard>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  iconClassName,
  label,
  value,
  children,
}: {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">{label}</p>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      {children}
    </div>
  );
}

function ComparisonIndicator({
  comparison,
  previousMonth,
}: {
  comparison: MonthlyComparison;
  previousMonth: string;
}) {
  const previousMonthName = formatMonthName(previousMonth);

  if (comparison.trend === "new") {
    return (
      <p className="mt-1.5 text-xs font-medium text-foreground/50">Nouveau niveau de dépenses</p>
    );
  }

  if (
    comparison.trend === "stable" &&
    comparison.currentTotal === 0 &&
    comparison.previousTotal === 0
  ) {
    return <p className="mt-1.5 text-xs font-medium text-foreground/50">Aucune variation</p>;
  }

  if (comparison.trend === "stable") {
    return (
      <p className="mt-1.5 text-xs font-medium text-foreground/50">
        Stable vs {previousMonthName}
      </p>
    );
  }

  // trend "up" ou "down" : percentageChange est garanti non nul ici.
  const roundedPercentage = Math.round(Math.abs(comparison.percentageChange ?? 0));
  const isIncrease = comparison.trend === "up";
  const sign = isIncrease ? "+" : "-";

  return (
    <p
      className={`mt-1.5 text-xs font-semibold ${
        isIncrease ? "text-amber-600 dark:text-amber-400" : "text-brand"
      }`}
    >
      {sign}
      {roundedPercentage} % vs {previousMonthName}
    </p>
  );
}
