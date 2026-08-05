const stats = [
  { label: "Total des dépenses", value: "2 450,00 €" },
  { label: "Nombre de dépenses", value: "24" },
  { label: "Catégorie principale", value: "Alimentation" },
  { label: "Budget mensuel", value: "520,00 €" },
];

const categoryBars = [
  { label: "Alim.", amount: 480, color: "bg-brand" },
  { label: "Transp.", amount: 320, color: "bg-blue-400" },
  { label: "Logement", amount: 610, color: "bg-violet-400" },
  { label: "Loisirs", amount: 150, color: "bg-amber-400" },
  { label: "Autre", amount: 90, color: "bg-foreground/15" },
];
const maxCategoryAmount = Math.max(...categoryBars.map((category) => category.amount));

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
    badge: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
];

export function DashboardPreview() {
  return (
    <div className="w-full max-w-lg">
      <div
        aria-hidden="true"
        className="rounded-3xl border border-black/5 bg-white p-5 shadow-xl shadow-black/5 ring-1 ring-black/[.02] dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-6"
      >
        <p className="text-sm font-semibold text-foreground">Dashboard</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-black/[.03] p-3 dark:bg-white/5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-foreground/50">
                {stat.label}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-foreground/50">Dépenses par catégorie</p>
          <div className="mt-3 flex h-20 items-end gap-2">
            {categoryBars.map((category) => (
              <div key={category.label} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-t-md ${category.color}`}
                  style={{ height: `${(category.amount / maxCategoryAmount) * 100}%` }}
                />
                <span className="text-[10px] text-foreground/40">{category.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/10">
          <p className="text-xs font-medium text-foreground/50">Dépenses récentes</p>
          <ul className="mt-2 divide-y divide-black/5 dark:divide-white/10">
            {recentExpenses.map((expense) => (
              <li key={expense.title} className="flex items-center gap-3 py-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${expense.badge}`}
                >
                  {expense.category.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{expense.title}</p>
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
      <p className="mt-3 text-center text-xs text-foreground/40">
        Exemple illustratif — aucune donnée réelle.
      </p>
    </div>
  );
}
