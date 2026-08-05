import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ShieldCheck, Zap, TrendingUp, Clock, Smartphone } from "lucide-react";
import { LogoMark } from "@/components/landing/logo-mark";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Connexion — Smart Expense Tracker",
};

const features = [
  {
    icon: BarChart3,
    title: "Vue d'ensemble",
    description: "Obtenez une vue claire de vos finances en un coup d'œil",
  },
  {
    icon: ShieldCheck,
    title: "Sécurisé",
    description: "Vos données restent privées et protégées",
  },
  {
    icon: Zap,
    title: "Rapide & Simple",
    description: "Ajoutez vos dépenses en quelques secondes",
  },
];

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      <div className="hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 px-10 py-10 text-white lg:flex lg:w-1/2 xl:px-14">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <LogoMark className="h-5 w-5 [&_path]:stroke-white" />
          </span>
          Smart Expense Tracker
        </Link>

        <div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl xl:text-4xl">
            Prenez le contrôle de vos <span className="text-emerald-300">dépenses</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Suivez, analysez et gérez vos dépenses facilement au quotidien.
          </p>

          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15"
                >
                  <feature.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-white/70">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div
            aria-hidden="true"
            className="mt-10 rounded-xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70">Dépenses du mois</p>
                <p className="text-lg font-bold">294,00 €</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-semibold text-emerald-200">
                <TrendingUp className="h-3 w-3" />
                +12%
              </span>
            </div>
            <svg viewBox="0 0 100 28" className="mt-3 h-7 w-full text-emerald-300" fill="none">
              <polyline
                points="0,22 15,18 30,20 45,10 60,14 75,6 100,2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/70">
              <div>
                <p className="font-semibold text-white">130 €</p>
                <p>Shopping</p>
              </div>
              <div>
                <p className="font-semibold text-white">80 €</p>
                <p>Transport</p>
              </div>
              <div>
                <p className="font-semibold text-white">60 €</p>
                <p>Alimentation</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Smart Expense Tracker. Tous droits réservés.
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5 ring-1 ring-black/[.02] dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-8">
            <div className="text-center">
              <Link
                href="/"
                aria-label="Retour à l'accueil"
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <LogoMark className="h-7 w-7" />
              </Link>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Bon retour <span aria-hidden="true">👋</span>
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

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-foreground/50 sm:gap-6">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              Sécurisé
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              Disponible 24/7
            </span>
            <span className="inline-flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              Multi-appareils
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
