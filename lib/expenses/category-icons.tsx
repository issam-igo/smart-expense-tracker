import {
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Popcorn,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { ExpenseCategory } from "@/types/expense";

export const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  Food: Utensils,
  Transport: Car,
  Housing: Home,
  Shopping: ShoppingBag,
  Entertainment: Popcorn,
  Health: HeartPulse,
  Education: GraduationCap,
  Other: MoreHorizontal,
};

// Couleurs distinctes par catégorie, dans la palette déjà utilisée ailleurs dans l'app
// (rose/violet pour les badges de dépenses récentes de la landing, etc.).
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  Transport: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Housing: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  Shopping: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  Entertainment: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Health: "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  Education: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  Other: "bg-black/5 text-foreground/60 dark:bg-white/10 dark:text-foreground/60",
};
