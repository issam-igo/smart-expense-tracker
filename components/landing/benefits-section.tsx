import { ListChecks, PieChart, Target } from "lucide-react";

const benefits = [
  {
    title: "Suivez vos dépenses",
    description: "Enregistrez et retrouvez toutes vos dépenses en quelques secondes.",
    icon: ListChecks,
  },
  {
    title: "Visualisez vos finances",
    description: "Des graphiques clairs pour comprendre vos habitudes de consommation.",
    icon: PieChart,
  },
  {
    title: "Atteignez vos objectifs",
    description: "Fixez un budget mensuel et suivez votre progression en temps réel.",
    icon: Target,
  },
];

export function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="mx-auto w-fit text-xs font-semibold tracking-wide text-brand uppercase">
          Pourquoi nous choisir
        </p>
        <h2
          id="benefits-heading"
          className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Une application conçue pour vous simplifier la vie
        </h2>
        <p className="mt-2 text-sm text-foreground/60 sm:text-base">
          Des outils simples et clairs pour reprendre le contrôle de votre budget.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm transition-all motion-safe:hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <benefit.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
