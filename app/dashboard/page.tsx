import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeSummary } from "@/lib/expenses/summary";
import { toExpense, type ExpenseRow } from "@/lib/expenses/mappers";
import { parseMonthParam, getMonthRange } from "@/lib/expenses/month";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { ExpenseList } from "@/components/dashboard/expense-list";
import { MonthFilter } from "@/components/month-filter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Défense en profondeur : proxy.ts protège déjà /dashboard, cette vérification
  // reste la source de vérité au plus près des données.
  if (!user) {
    redirect("/login");
  }

  const { month: rawMonth } = await searchParams;
  const month = parseMonthParam(rawMonth);
  const { start, end } = getMonthRange(month);

  // Filtre appliqué côté Supabase (pas de chargement de toutes les dépenses à filtrer
  // en JS). Aucun filtre user_id : la policy RLS SELECT restreint déjà le résultat.
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("expense_date", start)
    .lt("expense_date", end)
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
      >
        Impossible de charger vos dépenses pour le moment. Veuillez réessayer plus tard.
      </div>
    );
  }

  const expenses = (data as ExpenseRow[]).map(toExpense);
  const summary = computeSummary(expenses);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/60">Aperçu de vos dépenses.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <MonthFilter month={month} />
          <a
            href={`/api/expenses/export?month=${month}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:hover:bg-white/10"
          >
            <DownloadIcon />
            Exporter CSV
          </a>
          <Link
            href="/dashboard/expenses/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <PlusIcon />
            Ajouter une dépense
          </Link>
        </div>
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
          <ExpenseList expenses={expenses} />
        </div>
      </section>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      />
    </svg>
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
