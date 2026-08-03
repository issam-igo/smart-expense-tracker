"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/landing/logo-mark";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/expenses/new", label: "Ajouter une dépense" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2 rounded-md text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:text-base"
        >
          <LogoMark className="h-7 w-7 shrink-0" />
          <span className="min-w-0 truncate">Smart Expense Tracker</span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} isActive={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <UserZone />
          <LogoutButton />
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="dashboard-mobile-menu"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:hidden"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="dashboard-mobile-menu"
          className="border-t border-black/5 px-4 pb-4 pt-2 dark:border-white/10 md:hidden"
        >
          <nav aria-label="Navigation principale" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                isActive={pathname === link.href}
                block
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
            <UserZone />
          </div>

          <LogoutButton className="mt-3 w-full" />
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  isActive,
  block = false,
  onClick,
  children,
}: {
  href: string;
  isActive: boolean;
  block?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      className={`px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        block ? "block rounded-lg" : "rounded-full"
      } ${
        isActive
          ? "bg-brand/10 text-brand"
          : "text-foreground/70 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

function UserZone() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand"
      >
        CM
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-medium text-foreground">Camille Martin</p>
        <p className="truncate text-xs text-foreground/50">camille.martin@example.com</p>
      </div>
    </div>
  );
}

function LogoutButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:hover:bg-white/10 ${className}`}
    >
      <LogoutIcon />
      Déconnexion
    </button>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
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
