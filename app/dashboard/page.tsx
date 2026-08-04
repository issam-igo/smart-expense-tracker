import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeSummary } from "@/lib/expenses/summary";
import { computeBudgetStatus } from "@/lib/expenses/budget";
import { computeMonthlyComparison } from "@/lib/expenses/comparison";
import { toExpense, type ExpenseRow } from "@/lib/expenses/mappers";
import { parseMonthParam, getMonthRange, getPreviousMonthKey } from "@/lib/expenses/month";
import { parseSearch, parseSort, parseCategory, escapeIlikeSearch } from "@/lib/expenses/filters";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { ExpenseList } from "@/components/dashboard/expense-list";
import { MonthFilter } from "@/components/dashboard/month-filter";
import { SearchBar } from "@/components/dashboard/search-bar";
import { SortSelect } from "@/components/dashboard/sort-select";
import { CategoryFilter } from "@/components/dashboard/category-filter";
import { ExportCsvButton } from "@/components/dashboard/export-csv-button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; search?: string; sort?: string; category?: string }>;
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

  const rawParams = await searchParams;
  const month = parseMonthParam(rawParams.month);
  const search = parseSearch(rawParams.search);
  const sort = parseSort(rawParams.sort);
  const category = parseCategory(rawParams.category);
  const { start, end } = getMonthRange(month);

  // Filtres appliqués côté Supabase (pas de chargement de toutes les dépenses à filtrer
  // en JS). Aucun filtre user_id : la policy RLS SELECT restreint déjà le résultat.
  let query = supabase
    .from("expenses")
    .select("*")
    .gte("expense_date", start)
    .lt("expense_date", end);

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const escaped = escapeIlikeSearch(search);
    query = query.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  switch (sort) {
    case "date-asc":
      query = query
        .order("expense_date", { ascending: true })
        .order("created_at", { ascending: true });
      break;
    case "amount-asc":
      query = query.order("amount", { ascending: true });
      break;
    case "amount-desc":
      query = query.order("amount", { ascending: false });
      break;
    case "title-asc":
      query = query.order("title", { ascending: true });
      break;
    case "title-desc":
      query = query.order("title", { ascending: false });
      break;
    case "date-desc":
    default:
      query = query
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false });
      break;
  }

  // Budget du mois + total réel du mois (indépendant de la recherche/tri/catégorie),
  // pour le calcul du budget restant. Exécutés en parallèle avec la requête filtrée
  // ci-dessus plutôt qu'en série.
  const budgetQuery = supabase
    .from("monthly_budgets")
    .select("amount")
    .eq("month", month)
    .maybeSingle();

  const monthTotalQuery = supabase
    .from("expenses")
    .select("amount")
    .gte("expense_date", start)
    .lt("expense_date", end);

  // Mois précédent, pour la comparaison d'évolution. getMonthRange(previousMonth).end
  // correspond exactement à getMonthRange(month).start (premier jour du mois
  // sélectionné) : la plage couvre bien tout le mois précédent, rien de plus.
  const previousMonth = getPreviousMonthKey(month);
  const previousMonthRange = getMonthRange(previousMonth);
  const previousMonthTotalQuery = supabase
    .from("expenses")
    .select("amount")
    .gte("expense_date", previousMonthRange.start)
    .lt("expense_date", previousMonthRange.end);

  const [
    { data, error },
    { data: budgetRow, error: budgetError },
    { data: monthExpenses, error: monthTotalError },
    { data: previousMonthExpenses, error: previousMonthTotalError },
  ] = await Promise.all([query, budgetQuery, monthTotalQuery, previousMonthTotalQuery]);

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

  // Section budget non critique : en cas d'erreur, le dashboard continue de fonctionner
  // normalement sans budget affiché plutôt que d'échouer entièrement.
  const totalSpentThisMonth = monthTotalError
    ? 0
    : (monthExpenses ?? []).reduce((sum, row) => sum + Number(row.amount), 0);

  const budgetStatus =
    !budgetError && budgetRow
      ? computeBudgetStatus(Number(budgetRow.amount), totalSpentThisMonth)
      : null;

  // Comparaison non critique elle aussi : une erreur ne doit pas casser le dashboard.
  const previousMonthTotal = previousMonthTotalError
    ? 0
    : (previousMonthExpenses ?? []).reduce((sum, row) => sum + Number(row.amount), 0);

  const monthlyComparison =
    monthTotalError || previousMonthTotalError
      ? null
      : computeMonthlyComparison(totalSpentThisMonth, previousMonthTotal);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/60">Aperçu de vos dépenses.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ExportCsvButton month={month} search={search} sort={sort} category={category} />
          <Link
            href="/dashboard/expenses/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <PlusIcon />
            Ajouter une dépense
          </Link>
        </div>
      </div>

      <SummaryCards
        summary={summary}
        monthTotal={totalSpentThisMonth}
        comparison={monthlyComparison}
        previousMonth={previousMonth}
      />

      <BudgetOverview month={month} status={budgetStatus} />

      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
        <div className="lg:min-w-[240px] lg:flex-1">
          <SearchBar search={search} />
        </div>
        <MonthFilter month={month} />
        <CategoryFilter category={category} />
        <SortSelect sort={sort} />
      </div>

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
        <div className="mt-4">
          <ExpenseList expenses={expenses} search={search} />
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
