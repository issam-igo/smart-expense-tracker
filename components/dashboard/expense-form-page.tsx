import type { ReactNode } from "react";

export function ExpenseFormPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-foreground/60">{description}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        {children}
      </div>
    </div>
  );
}
