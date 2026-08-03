import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
      >
        <div className="h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="mx-auto mb-5 w-fit rounded-full border border-brand/20 bg-brand/10 px-4 py-1 text-xs font-medium text-brand sm:text-sm">
          Suivi de dépenses simple et rapide
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Prenez le <span className="text-brand">contrôle</span>&nbsp;de vos finances en un clin d&apos;œil
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base text-foreground/70 sm:text-lg">
          L&apos;application de suivi de dépenses la plus simple et la plus
          intuitive pour gérer votre budget quotidien sans effort.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all motion-safe:hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-black/10 bg-white/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10 sm:w-auto"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </section>
  );
}
