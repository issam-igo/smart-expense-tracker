import type { Metadata } from "next";
import Link from "next/link";
import { UserRound, ShieldCheck, Zap, Smartphone } from "lucide-react";
import { LogoMark } from "@/components/landing/logo-mark";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Créer un compte — Smart Expense Tracker",
};

const features = [
  {
    icon: ShieldCheck,
    title: "Sécurisé",
    description: "Vos données sont protégées avec un cryptage de niveau bancaire.",
  },
  {
    icon: Zap,
    title: "Rapide & Simple",
    description: "Créez votre compte en moins d'une minute et commencez immédiatement.",
  },
  {
    icon: Smartphone,
    title: "Toujours avec vous",
    description: "Accédez à vos finances depuis tous vos appareils, à tout moment.",
  },
];

export default function SignupPage() {
  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      <div className="hidden flex-col overflow-hidden bg-gradient-to-br from-emerald-50 to-white px-10 py-10 dark:from-brand/10 dark:to-transparent lg:flex lg:w-1/2 xl:px-14">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <LogoMark className="h-8 w-8" />
          <span>Smart Expense Tracker</span>
        </Link>

        <div className="mt-16">
          <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            Rejoignez des milliers d&apos;utilisateurs
          </span>

          <h2 className="mt-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl xl:text-4xl">
            Créez votre compte et prenez le contrôle de{" "}
            <span className="text-brand">vos finances</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-foreground/60">
            Suivez, analysez et gérez vos dépenses en toute simplicité, où que vous soyez.
          </p>

          <div
            aria-hidden="true"
            className="mt-8 max-w-xs rounded-xl border border-black/5 bg-white p-4 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs text-foreground/50">Dépenses du mois</p>
            <p className="text-lg font-bold text-foreground">2 450,00 €</p>
            <svg viewBox="0 0 100 28" className="mt-2 h-7 w-full text-brand" fill="none">
              <polyline
                points="0,22 15,18 30,20 45,10 60,14 75,6 100,2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-foreground/60 dark:border-white/10">
              <span>Répartition</span>
              <span className="font-semibold text-foreground">540 € Alimentation</span>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand"
                >
                  <feature.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                  <p className="text-xs text-foreground/60">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5 ring-1 ring-black/[.02] dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-8">
            <div className="text-center">
              <span
                aria-hidden="true"
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10"
              >
                <UserRound className="h-7 w-7 text-brand" />
              </span>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Créer votre compte
              </h1>
              <p className="mt-1 text-sm text-foreground/60">C&apos;est rapide et gratuit.</p>
            </div>

            <SignupForm />
          </div>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="rounded font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
