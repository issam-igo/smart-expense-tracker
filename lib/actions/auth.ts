"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validation/signup";
import { loginSchema } from "@/lib/validation/login";
import { forgotPasswordSchema } from "@/lib/validation/forgot-password";
import { resetPasswordSchema } from "@/lib/validation/reset-password";

// Dérive l'origine (protocole + host) depuis les en-têtes de la requête plutôt que
// de coder une URL en dur : fonctionne en local (localhost) et en production (Vercel).
async function getOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = headersList.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
  return `${protocol}://${host}`;
}

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

export type LoginState =
  | {
      status: "error";
      fieldErrors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Message volontairement générique : ne jamais indiquer si l'email existe ou non.
    return {
      status: "error",
      message: "Email ou mot de passe incorrect.",
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type ForgotPasswordState =
  | {
      status: "success" | "error";
      fieldErrors?: Record<string, string[] | undefined>;
    }
  | undefined;

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  // Le résultat (erreur ou non) n'est jamais exposé : resetPasswordForEmail() ne doit
  // jamais permettre de savoir si l'adresse correspond à un compte existant.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  return { status: "success" };
}

export type ResetPasswordState =
  | {
      status: "success" | "error";
      fieldErrors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

export async function updatePassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Refuse la modification si aucune session de récupération valide n'est présente,
  // même si le Zod parse a réussi.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Ce lien de réinitialisation n'est plus valide. Veuillez recommencer.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return {
      status: "error",
      message: "Une erreur est survenue. Veuillez réessayer.",
    };
  }

  // Ne pas conserver la session de récupération : l'utilisateur devra se reconnecter
  // avec son nouveau mot de passe.
  await supabase.auth.signOut();

  return { status: "success" };
}
