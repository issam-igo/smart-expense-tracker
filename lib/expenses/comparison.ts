export interface MonthlyComparison {
  currentTotal: number;
  previousTotal: number;
  difference: number;
  percentageChange: number | null;
  trend: "up" | "down" | "stable" | "new";
}

// Fonction pure, sans logique d'affichage. `currentTotal`/`previousTotal` doivent déjà
// représenter le total réel de chaque mois (indépendant de toute recherche/tri/catégorie).
export function computeMonthlyComparison(
  currentTotal: number,
  previousTotal: number,
): MonthlyComparison {
  const difference = currentTotal - previousTotal;

  // Rien à comparer : aucune dépense ni ce mois-ci ni le mois précédent.
  if (previousTotal === 0 && currentTotal === 0) {
    return { currentTotal, previousTotal, difference: 0, percentageChange: null, trend: "stable" };
  }

  // Le mois précédent n'avait aucune dépense : un pourcentage n'aurait pas de sens
  // (division par zéro / Infinity), même si currentTotal > 0.
  if (previousTotal === 0) {
    return { currentTotal, previousTotal, difference, percentageChange: null, trend: "new" };
  }

  const percentageChange = (difference / previousTotal) * 100;
  const trend = percentageChange === 0 ? "stable" : percentageChange > 0 ? "up" : "down";

  return { currentTotal, previousTotal, difference, percentageChange, trend };
}
