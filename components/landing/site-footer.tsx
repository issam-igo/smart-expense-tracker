import { LogoMark } from "@/components/landing/logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-foreground/50 sm:flex-row sm:px-6 lg:px-8">
        <span className="flex items-center gap-2 font-medium text-foreground/70">
          <LogoMark className="h-5 w-5" />
          Smart Expense Tracker
        </span>
        <p>© {new Date().getFullYear()} Smart Expense Tracker. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
