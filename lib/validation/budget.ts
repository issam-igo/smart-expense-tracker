import { z } from "zod";
import { MONTH_KEY_PATTERN } from "@/lib/expenses/month";

export const monthKeySchema = z
  .string()
  .regex(MONTH_KEY_PATTERN, "Mois invalide, format attendu : YYYY-MM.");

export const budgetUpsertSchema = z
  .object({
    amount: z.number().positive("Le budget doit être un nombre positif."),
  })
  .strict();

export type BudgetUpsertInput = z.infer<typeof budgetUpsertSchema>;
