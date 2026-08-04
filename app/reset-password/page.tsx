import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/landing/logo-mark";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe — Smart Expense Tracker",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Aucune session valide (lien absent, expiré ou déjà utilisé) : refuser l'accès direct.
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <header className="px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <LogoMark className="h-7 w-7" />
          <span>Smart Expense Tracker</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5 ring-1 ring-black/[.02] dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-8">
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Choisir un nouveau mot de passe
              </h1>
              <p className="mt-1 text-sm text-foreground/60">
                Choisissez un mot de passe d&apos;au moins 8 caractères.
              </p>
            </div>

            <ResetPasswordForm />
          </div>
        </div>
      </main>
    </>
  );
}
