import { logout } from "@/lib/actions/auth";

export function LogoutButton({ className = "" }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:hover:bg-white/10 ${className}`}
      >
        <LogoutIcon />
        Déconnexion
      </button>
    </form>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
      />
    </svg>
  );
}
