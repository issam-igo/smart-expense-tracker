"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/toast-provider";
import { SpinnerIcon } from "@/components/spinner-icon";
import type { SortOption } from "@/lib/expenses/filters";
import type { ExpenseCategory } from "@/types/expense";

export function ExportCsvButton({
  month,
  search,
  sort,
  category,
}: {
  month: string;
  search: string;
  sort: SortOption;
  category: ExpenseCategory | "";
}) {
  const router = useRouter();
  const showToast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    if (isExporting) return; // empêche les doubles clics

    setIsExporting(true);

    try {
      const params = new URLSearchParams({ month, sort });
      if (search) params.set("search", search);
      if (category) params.set("category", category);

      const response = await fetch(`/api/expenses/export?${params.toString()}`);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        showToast("error", "Une erreur est survenue.");
        return;
      }

      // Téléchargement déclenché côté client (plutôt qu'une navigation directe) pour
      // pouvoir afficher un toast de confirmation une fois le fichier récupéré.
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `expenses-${month}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      showToast("success", "Export CSV terminé");
    } catch {
      showToast("error", "Une erreur est survenue.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:hover:bg-white/10 sm:w-auto"
    >
      {isExporting ? <SpinnerIcon /> : <DownloadIcon />}
      Exporter CSV
    </button>
  );
}

function DownloadIcon() {
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
        d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      />
    </svg>
  );
}
