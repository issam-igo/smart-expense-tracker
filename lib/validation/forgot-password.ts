import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L'adresse email est requise.")
    .email("Adresse email invalide."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
