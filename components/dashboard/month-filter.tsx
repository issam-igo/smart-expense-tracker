"use client";

import { useId, type ChangeEvent } from "react";
import { useUpdateSearchParam } from "@/components/dashboard/use-update-search-param";

export function MonthFilter({ month }: { month: string }) {
  const updateParam = useUpdateSearchParam();
  const inputId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (!value) return;
    updateParam("month", value);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        Mois
      </label>
      <input
        id={inputId}
        type="month"
        value={month}
        onChange={handleChange}
        className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
      />
    </div>
  );
}
