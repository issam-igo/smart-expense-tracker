import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/types/expense";

export const expenseCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Le titre est requis.")
    .max(120, "Le titre ne peut pas dépasser 120 caractères."),
  amount: z.number().positive("Le montant doit être un nombre positif."),
  category: z.enum(EXPENSE_CATEGORIES, "Catégorie invalide."),
  expenseDate: z.iso.date("Date invalide."),
  description: z
    .string()
    .trim()
    .max(500, "La description ne peut pas dépasser 500 caractères.")
    .optional(),
});

export const expenseUpdateSchema = expenseCreateSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Aucune donnée à mettre à jour.",
  });

export const expenseIdSchema = z.uuid("Identifiant invalide.");

export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>;
export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>;
