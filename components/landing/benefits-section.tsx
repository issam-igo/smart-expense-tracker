const benefits = [
  {
    title: "Suivez vos dépenses",
    description: "Enregistrez vos transactions en quelques secondes.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        />
      </svg>
    ),
  },
  {
    title: "Visualisez vos catégories",
    description:
      "Comprenez où va votre argent grâce à des graphiques clairs.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 3.05V12h8.95A9 9 0 1 1 11 3.05Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 12a8 8 0 0 0-8-8v8h8Z"
        />
      </svg>
    ),
  },
  {
    title: "Mieux comprendre son budget",
    description:
      "Identifiez vos habitudes de consommation et prenez de meilleures décisions.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
];

export function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        <h2
          id="benefits-heading"
          className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Pourquoi choisir Smart Expense Tracker ?
        </h2>
        <p className="mt-2 text-sm text-foreground/60 sm:text-base">
          Des outils conçus pour simplifier votre vie financière.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm transition-all motion-safe:hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                {benefit.icon}
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
