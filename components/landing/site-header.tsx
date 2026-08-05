import Link from "next/link";
import { LogoMark } from "@/components/landing/logo-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:text-lg"
        >
          <LogoMark className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
          <span className="hidden truncate sm:inline">Smart Expense Tracker</span>
        </Link>
        <nav
          aria-label="Navigation principale"
          className="flex shrink-0 items-center gap-1 sm:gap-4"
        >
          <Link
            href="/login"
            className="whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:px-3 sm:text-sm"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="whitespace-nowrap rounded-full bg-brand px-3 py-2 text-xs font-medium text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
          >
            Créer un compte
          </Link>
        </nav>
      </div>
    </header>
  );
}
