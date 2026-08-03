import type { ExpenseSummary } from "@/lib/expenses/summary";
import { formatCurrency } from "@/lib/format";

export function SummaryCards({ summary }: { summary: ExpenseSummary }) {
  const cards = [
    { label: "Total des dépenses", value: formatCurrency(summary.total) },
    { label: "Nombre de dépenses", value: summary.count.toString() },
    { label: "Catégorie principale", value: summary.topCategory ?? "—" },
    { label: "Dépenses du mois", value: formatCurrency(summary.monthTotal) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
