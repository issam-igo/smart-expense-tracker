export interface BudgetStatus {
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

// Fonction pure, sans logique d'affichage : uniquement les nombres. `spent` doit déjà
// représenter le total réel du mois (indépendant de toute recherche/tri/filtre catégorie).
export function computeBudgetStatus(budgetAmount: number, spent: number): BudgetStatus {
  const remaining = budgetAmount - spent;

  // budgetAmount ne devrait jamais être <= 0 (contrainte SQL `amount > 0`), mais la
  // fonction reste défensive pour rester correcte et testable indépendamment de la DB.
  const percentageUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

  return {
    budgetAmount,
    spent,
    // Pas de plafond à 100 : une valeur supérieure signale volontairement un dépassement.
    remaining,
    percentageUsed,
  };
}
