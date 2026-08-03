"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validation/signup";

export type SignupState =
  | {
      status: "error" | "check_email";
      fieldErrors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

export async function signup(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    if (
      error.code === "user_already_exists" ||
      error.message.toLowerCase().includes("already registered")
    ) {
      return {
        status: "error",
        fieldErrors: { email: ["Un compte existe déjà avec cette adresse email."] },
      };
    }

    return {
      status: "error",
      message: "Une erreur est survenue. Veuillez réessayer.",
    };
  }

  // Email déjà utilisé et confirmé : Supabase ne renvoie pas d'erreur mais un
  // utilisateur sans identité, pour ne pas révéler l'existence du compte.
  if (data.user && data.user.identities?.length === 0) {
    return {
      status: "error",
      fieldErrors: { email: ["Un compte existe déjà avec cette adresse email."] },
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    status: "check_email",
    message: "Vérifiez votre boîte mail pour confirmer votre compte avant de vous connecter.",
  };
}
