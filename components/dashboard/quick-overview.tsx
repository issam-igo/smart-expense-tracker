import { TrendingUp, Wallet, PiggyBank, type LucideIcon } from "lucide-react";
import type { BudgetStatus } from "@/lib/expenses/budget";
import { getCurrentMonthKey } from "@/lib/expenses/month";
import { formatCurrency } from "@/lib/format";

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Lundi de la semaine contenant `date`.
function getStartOfWeekIso(date: Date): string {
  const day = date.getDay(); // 0 (dimanche) .. 6 (samedi)
  const diffToMonday = day === 0 ? 6 : day - 1;
  const start = new Date(date);
  start.setDate(date.getDate() - diffToMonday);
  return toIsoDate(start);
}

type Tone = "brand" | "blue" | "amber";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand/10 text-brand",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

interface OverviewItem {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: Tone;
}

// Forme minimale nécessaire ici (pas le type Expense complet : cette carte reçoit les
// dépenses du mois non filtrées par recherche/catégorie, voir app/dashboard/page.tsx).
export interface MonthExpenseAmount {
  amount: number;
  expenseDate: string;
}

export function QuickOverview({
  expenses,
  month,
  budgetStatus,
}: {
  expenses: MonthExpenseAmount[];
  month: string;
  budgetStatus: BudgetStatus | null;
}) {
  // "Aujourd'hui"/"cette semaine" n'ont de sens que pour le mois réel en cours — sur un
  // mois passé ou futur sélectionné dans le filtre, ces notions ne signifient rien.
  const isCurrentMonth = month === getCurrentMonthKey();

  const now = new Date();
  const todayIso = toIsoDate(now);
  const startOfWeekIso = getStartOfWeekIso(now);

  const todayTotal = expenses
    .filter((expense) => expense.expenseDate === todayIso)
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Limite connue : ne porte que sur les dépenses du mois sélectionné déjà chargées par
  // la page (aucune nouvelle requête Supabase pour cette carte). Si la semaine en cours
  // chevauche le mois précédent, ces jours-là ne sont pas comptabilisés ici.
  const weekTotal = expenses
    .filter((expense) => expense.expenseDate >= startOfWeekIso)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const items: OverviewItem[] = [
    ...(isCurrentMonth
      ? [
          {
            icon: TrendingUp,
            label: "Dépenses aujourd'hui",
            value: formatCurrency(todayTotal),
            tone: "brand" as const,
          },
          {
            icon: Wallet,
            label: "Dépenses cette semaine",
            value: formatCurrency(weekTotal),
            tone: "blue" as const,
          },
        ]
      : []),
    ...(budgetStatus
      ? [
          {
            icon: PiggyBank,
            label: "Économies restantes",
            value: formatCurrency(Math.max(budgetStatus.remaining, 0)),
            tone: "amber" as const,
          },
        ]
      : []),
  ];

  return (
    <section
      aria-labelledby="quick-overview-heading"
      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
    >
      <h2 id="quick-overview-heading" className="text-base font-semibold text-foreground">
        Aperçu rapide
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/60">Rien à signaler pour ce mois.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[item.tone]}`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-foreground/50">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
