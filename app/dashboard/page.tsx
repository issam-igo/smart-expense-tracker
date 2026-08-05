import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, RotateCcw, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeSummary } from "@/lib/expenses/summary";
import { computeBudgetStatus } from "@/lib/expenses/budget";
import { computeMonthlyComparison } from "@/lib/expenses/comparison";
import { toExpense, type ExpenseRow } from "@/lib/expenses/mappers";
import { parseMonthParam, getMonthRange, getPreviousMonthKey } from "@/lib/expenses/month";
import { parseSearch, parseSort, parseCategory, escapeIlikeSearch } from "@/lib/expenses/filters";
import { getDisplayName } from "@/lib/user-display";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { QuickOverview } from "@/components/dashboard/quick-overview";
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

  const displayName = getDisplayName(user);

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
  // pour le calcul du budget restant et la carte Aperçu rapide (qui a besoin de
  // expense_date en plus de amount, d'où le select élargi — toujours la même requête).
  // Exécutés en parallèle avec la requête filtrée ci-dessus plutôt qu'en série.
  const budgetQuery = supabase
    .from("monthly_budgets")
    .select("amount")
    .eq("month", month)
    .maybeSingle();

  const monthTotalQuery = supabase
    .from("expenses")
    .select("amount, expense_date")
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
  const monthExpensesForOverview = monthTotalError
    ? []
    : (monthExpenses ?? []).map((row) => ({
        amount: Number(row.amount),
        expenseDate: row.expense_date,
      }));

  const totalSpentThisMonth = monthExpensesForOverview.reduce((sum, row) => sum + row.amount, 0);

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Bonjour, {displayName} <span aria-hidden="true">👋</span>
        </p>
      </div>

      <SummaryCards
        summary={summary}
        monthTotal={totalSpentThisMonth}
        comparison={monthlyComparison}
        previousMonth={previousMonth}
        budgetStatus={budgetStatus}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-foreground/50" aria-hidden="true" />
          <MonthFilter month={month} />
        </div>
        <Link
          href="/dashboard/expenses/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle dépense
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-12">
        <div className="lg:col-span-8">
          <section
            aria-labelledby="chart-heading"
            className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
          >
            <h2 id="chart-heading" className="text-base font-semibold text-foreground">
              Dépenses par catégorie
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Répartition de vos dépenses du mois sélectionné.
            </p>
            <div className="mt-4">
              <ExpenseChart data={summary.byCategory} />
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <BudgetOverview month={month} status={budgetStatus} />
          <QuickOverview
            expenses={monthExpensesForOverview}
            month={month}
            budgetStatus={budgetStatus}
          />
        </div>
      </div>

      <hr className="border-black/5 dark:border-white/10" />

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="recent-heading" className="text-lg font-semibold text-foreground">
            Dernières dépenses
          </h2>
          <ExportCsvButton month={month} search={search} sort={sort} category={category} />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:gap-3 sm:p-5 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="lg:min-w-[220px] lg:flex-1">
            <SearchBar search={search} />
          </div>
          <CategoryFilter category={category} />
          <SortSelect sort={sort} />
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:hover:bg-white/10 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Réinitialiser
          </Link>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
          <ExpenseList expenses={expenses} search={search} />
        </div>
      </section>
    </div>
  );
}
