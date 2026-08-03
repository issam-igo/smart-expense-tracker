const stats = [
  { label: "Total des dépenses", value: "2 450,00 €" },
  { label: "Dépenses du mois", value: "480,00 €" },
  { label: "Catégorie principale", value: "Alimentation" },
];

const recentExpenses = [
  {
    title: "Courses",
    category: "Alimentation",
    date: "Aujourd'hui",
    amount: "85,60 €",
    badge: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
  {
    title: "Abonnement streaming",
    category: "Loisirs",
    date: "Hier",
    amount: "12,99 €",
    badge:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    title: "Café",
    category: "Alimentation",
    date: "30 oct.",
    amount: "4,20 €",
    badge: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
];

export function DashboardPreview() {
  return (
    <section
      aria-labelledby="dashboard-preview-heading"
      className="px-4 pb-16 sm:px-6 lg:px-8"
    >
      <h2 id="dashboard-preview-heading" className="sr-only">
        Aperçu illustratif du tableau de bord
      </h2>
      <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl border border-black/5 bg-white p-4 shadow-xl shadow-black/5 ring-1 ring-black/[.02] dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-6 md:grid-cols-5">
        <div className="grid grid-rows-3 gap-4 md:col-span-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-black/[.03] p-4 dark:bg-white/5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-foreground">
            Dépenses récentes
          </h3>
          <ul className="mt-3 divide-y divide-black/5 dark:divide-white/10">
            {recentExpenses.map((expense) => (
              <li
                key={expense.title}
                className="flex items-center gap-3 py-3"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${expense.badge}`}
                >
                  {expense.category.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {expense.title}
                  </p>
                  <p className="truncate text-xs text-foreground/50">
                    {expense.category} · {expense.date}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-foreground">
                  {expense.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-5xl text-center text-xs text-foreground/40">
        Exemple illustratif — aucune donnée réelle.
      </p>
    </section>
  );
}
