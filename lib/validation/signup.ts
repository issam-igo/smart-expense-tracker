import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Le nom est requis."),
    email: z
      .string()
      .trim()
      .min(1, "L'adresse email est requise.")
      .email("Adresse email invalide."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
