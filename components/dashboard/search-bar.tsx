"use client";

import { useEffect, useId, useState, type ChangeEvent } from "react";
import { useUpdateSearchParam } from "@/components/dashboard/use-update-search-param";

const DEBOUNCE_MS = 350;

export function SearchBar({ search }: { search: string }) {
  const updateParam = useUpdateSearchParam();
  const inputId = useId();
  const [value, setValue] = useState(search);

  // Reste synchronisé si la recherche change depuis l'extérieur (navigation, retour
  // arrière) : ajustement pendant le rendu plutôt que dans un effet, pour éviter un
  // rendu supplémentaire (cf. la doc React sur l'ajustement d'état depuis les props).
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setValue(search);
  }

  useEffect(() => {
    if (value === search) return;

    const timer = window.setTimeout(() => {
      updateParam("search", value.trim());
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne doit se redéclencher que sur `value`, pas sur `search`/`updateParam`
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        Rechercher une dépense
      </label>
      <SearchIcon />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Rechercher par titre ou description…"
        className="w-full rounded-xl border border-black/10 bg-white py-2.5 pr-3 pl-10 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
      />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/40"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}
