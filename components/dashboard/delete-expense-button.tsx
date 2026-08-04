"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpinnerIcon } from "@/components/spinner-icon";
import { useToast } from "@/components/toast/toast-provider";

export function DeleteExpenseButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const showToast = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTitleId = useId();

  const [isDeleting, setIsDeleting] = useState(false);

  function openConfirm() {
    dialogRef.current?.showModal();
  }

  function closeConfirm() {
    if (isDeleting) return;
    dialogRef.current?.close();
  }

  async function handleConfirmDelete() {
    if (isDeleting) return; // empêche les doubles clics

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });

      if (response.status === 204) {
        dialogRef.current?.close();
        showToast("success", "Dépense supprimée");
        router.refresh();
        return;
      }

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 404) {
        dialogRef.current?.close();
        showToast("error", "Cette dépense n'existe plus.");
        setIsDeleting(false);
        return;
      }

      // 500 ou tout autre statut inattendu.
      dialogRef.current?.close();
      showToast("error", "Une erreur est survenue.");
      setIsDeleting(false);
    } catch {
      dialogRef.current?.close();
      showToast("error", "Une erreur est survenue.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openConfirm}
        title={`Supprimer ${title}`}
        aria-label={`Supprimer ${title}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground/50 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <TrashIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/10 backdrop:bg-black/40 dark:border-white/10 dark:bg-[#0a0a0a]"
      >
        <h2 id={dialogTitleId} className="text-base font-semibold text-foreground">
          Supprimer cette dépense ?
        </h2>
        <p className="mt-1.5 text-sm text-foreground/60">
          « {title} » sera définitivement supprimée. Cette action est irréversible.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:hover:bg-white/10"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting && <SpinnerIcon />}
            {isDeleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </dialog>
    </>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m1 0v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7h10ZM10 11v6M14 11v6"
      />
    </svg>
  );
}
