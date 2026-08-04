"use client";

import { useId, type ChangeEvent } from "react";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense";
import { useUpdateSearchParam } from "@/components/dashboard/use-update-search-param";

export function CategoryFilter({ category }: { category: ExpenseCategory | "" }) {
  const updateParam = useUpdateSearchParam();
  const selectId = useId();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    updateParam("category", event.target.value);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={selectId} className="text-sm font-medium text-foreground">
        Catégorie
      </label>
      <select
        id={selectId}
        value={category}
        onChange={handleChange}
        className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
      >
        <option value="">Toutes</option>
        {EXPENSE_CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
