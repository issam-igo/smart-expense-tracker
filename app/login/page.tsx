import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/landing/logo-mark";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Connexion — Smart Expense Tracker",
};

export default function LoginPage() {
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
                Content de vous revoir
              </h1>
              <p className="mt-1 text-sm text-foreground/60">
                Connectez-vous pour accéder à votre tableau de bord.
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="rounded font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
