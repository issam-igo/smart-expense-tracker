import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
      >
        <div className="h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-xl text-center lg:text-left">
          <p className="mx-auto w-fit rounded-full border border-brand/20 bg-brand/10 px-4 py-1 text-xs font-medium text-brand sm:text-sm lg:mx-0">
            Simplifiez vos finances au quotidien
          </p>
          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Prenez le contrôle de vos <span className="text-brand">dépenses</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-foreground/70 sm:text-lg lg:mx-0">
            Suivez, analysez et gérez votre budget facilement. Tout ce dont vous avez
            besoin pour atteindre vos objectifs financiers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/signup"
              className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all motion-safe:hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
            >
              Créer un compte gratuitement
            </Link>
            <Link
              href="/login"
              className="w-full rounded-full border border-black/10 bg-white/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10 sm:w-auto"
            >
              Se connecter
            </Link>
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/50 lg:justify-start">
            <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
            Vos données sont sécurisées et confidentielles.
          </p>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}
