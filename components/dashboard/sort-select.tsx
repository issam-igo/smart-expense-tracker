"use client";

import { useId, type ChangeEvent } from "react";
import { SORT_OPTIONS, type SortOption } from "@/lib/expenses/filters";
import { useUpdateSearchParam } from "@/components/dashboard/use-update-search-param";

export function SortSelect({ sort }: { sort: SortOption }) {
  const updateParam = useUpdateSearchParam();
  const selectId = useId();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    updateParam("sort", event.target.value);
  }

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
      <label htmlFor={selectId} className="text-sm font-medium text-foreground">
        Trier par
      </label>
      <select
        id={selectId}
        value={sort}
        onChange={handleChange}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5 sm:w-auto"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
