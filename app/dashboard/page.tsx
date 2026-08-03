import Link from "next/link";
import { mockExpenses } from "@/lib/expenses/mock-data";
import { computeSummary } from "@/lib/expenses/summary";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { ExpenseList } from "@/components/dashboard/expense-list";

const RECENT_EXPENSES_LIMIT = 5;

export default function DashboardPage() {
  const summary = computeSummary(mockExpenses);
  const recentExpenses = [...mockExpenses]
    .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate))
    .slice(0, RECENT_EXPENSES_LIMIT);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Aperçu de vos dépenses — données fictives.
          </p>
        </div>
        <Link
          href="/dashboard/expenses/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <PlusIcon />
          Ajouter une dépense
        </Link>
      </div>

      <SummaryCards summary={summary} />

      <section
        aria-labelledby="chart-heading"
        className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
      >
        <h2 id="chart-heading" className="text-base font-semibold text-foreground">
          Dépenses par catégorie
        </h2>
        <div className="mt-4">
          <ExpenseChart data={summary.byCategory} />
        </div>
      </section>

      <section
        aria-labelledby="recent-heading"
        className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
      >
        <h2 id="recent-heading" className="text-base font-semibold text-foreground">
          Dernières dépenses
        </h2>
        <div className="mt-2">
          <ExpenseList expenses={recentExpenses} />
        </div>
      </section>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}
