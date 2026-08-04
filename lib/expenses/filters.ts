import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense";

export const SORT_OPTIONS = [
  { value: "date-desc", label: "Date (plus récente)" },
  { value: "date-asc", label: "Date (plus ancienne)" },
  { value: "amount-desc", label: "Montant (décroissant)" },
  { value: "amount-asc", label: "Montant (croissant)" },
  { value: "title-asc", label: "Titre (A → Z)" },
  { value: "title-desc", label: "Titre (Z → A)" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_SORT: SortOption = "date-desc";

export function parseSort(value: string | undefined): SortOption {
  const match = SORT_OPTIONS.find((option) => option.value === value);
  return match ? match.value : DEFAULT_SORT;
}

// "" représente "Toutes" (aucun filtre de catégorie).
export function parseCategory(value: string | undefined): ExpenseCategory | "" {
  if (value && (EXPENSE_CATEGORIES as readonly string[]).includes(value)) {
    return value as ExpenseCategory;
  }
  return "";
}

export function parseSearch(value: string | undefined): string {
  return value?.trim() ?? "";
}

// Échappe les caractères spéciaux ILIKE (%, _) pour qu'une recherche contenant
// ces caractères soit traitée littéralement plutôt que comme un joker SQL.
export function escapeIlikeSearch(search: string): string {
  return search.replace(/[%_]/g, "\\$&");
}
