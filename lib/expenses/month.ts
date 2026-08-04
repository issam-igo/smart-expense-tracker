const MONTH_KEY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Retombe sur le mois courant si le paramètre est absent ou ne respecte pas YYYY-MM.
export function parseMonthParam(value: string | undefined): string {
  if (value && MONTH_KEY_PATTERN.test(value)) {
    return value;
  }
  return getCurrentMonthKey();
}

export interface MonthRange {
  start: string; // inclusif, YYYY-MM-DD
  end: string; // exclusif, YYYY-MM-DD (premier jour du mois suivant)
}

// Calcul en arithmétique entière (pas d'objet Date) pour éviter tout décalage de
// fuseau horaire : expense_date est une colonne SQL `date` sans composante horaire.
export function getMonthRange(monthKey: string): MonthRange {
  const [year, month] = monthKey.split("-").map(Number);
  const start = `${monthKey}-01`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  return { start, end };
}
