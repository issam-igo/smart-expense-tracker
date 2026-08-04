import type { ExpenseSummary } from "@/lib/expenses/summary";
import type { MonthlyComparison } from "@/lib/expenses/comparison";
import { formatCurrency, formatMonthName } from "@/lib/format";

export function SummaryCards({
  summary,
  monthTotal,
  comparison,
  previousMonth,
}: {
  summary: ExpenseSummary;
  monthTotal: number;
  comparison: MonthlyComparison | null;
  previousMonth: string;
}) {
  const cards = [
    { key: "total", label: "Total des dépenses", value: formatCurrency(summary.total) },
    { key: "count", label: "Nombre de dépenses", value: summary.count.toString() },
    { key: "topCategory", label: "Catégorie principale", value: summary.topCategory ?? "—" },
    // Toujours le total réel du mois sélectionné, jamais affecté par la
    // recherche/catégorie/tri — même source que la comparaison ci-dessous.
    { key: "month", label: "Dépenses du mois", value: formatCurrency(monthTotal) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{card.value}</p>
          {card.key === "month" && comparison && (
            <ComparisonIndicator comparison={comparison} previousMonth={previousMonth} />
          )}
        </div>
      ))}
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
    return <p className="mt-1.5 text-xs font-medium text-foreground/50">Nouveau niveau de dépenses</p>;
  }

  if (comparison.trend === "stable" && comparison.currentTotal === 0 && comparison.previousTotal === 0) {
    return <p className="mt-1.5 text-xs font-medium text-foreground/50">Aucune variation</p>;
  }

  if (comparison.trend === "stable") {
    return (
      <p className="mt-1.5 text-xs font-medium text-foreground/50">
        Stable par rapport au mois précédent ({previousMonthName})
      </p>
    );
  }

  // trend "up" ou "down" : percentageChange est garanti non nul ici.
  const roundedPercentage = Math.round(Math.abs(comparison.percentageChange ?? 0));
  const isIncrease = comparison.trend === "up";
  const sign = isIncrease ? "+" : "-";

  return (
    <p
      className={`mt-1.5 text-xs font-medium ${
        isIncrease ? "text-amber-600 dark:text-amber-400" : "text-brand"
      }`}
    >
      {sign}
      {roundedPercentage} % par rapport au mois précédent ({previousMonthName})
    </p>
  );
}
