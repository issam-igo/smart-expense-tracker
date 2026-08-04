"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SpinnerIcon } from "@/components/spinner-icon";
import { useToast } from "@/components/toast/toast-provider";

export function BudgetFormDialog({
  month,
  currentAmount,
}: {
  month: string;
  currentAmount: number | null;
}) {
  const router = useRouter();
  const showToast = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTitleId = useId();
  const amountId = useId();

  const isEditMode = currentAmount !== null;

  const [amount, setAmount] = useState(currentAmount !== null ? String(currentAmount) : "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openDialog() {
    setAmount(currentAmount !== null ? String(currentAmount) : "");
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (isSubmitting) return;
    dialogRef.current?.close();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return; // empêche les doubles soumissions

    const numericAmount = Number(amount);
    if (!amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Le budget doit être un nombre positif.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/budgets/${month}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });

      if (response.status === 200) {
        dialogRef.current?.close();
        showToast("success", isEditMode ? "Budget modifié" : "Budget défini");
        router.refresh();
        return;
      }

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 422) {
        const body = (await response.json().catch(() => null)) as {
          error?: { details?: Record<string, string[]> };
        } | null;
        const message =
          body?.error?.details?.amount?.[0] ?? "Le budget doit être un nombre positif.";
        setError(message);
        setIsSubmitting(false);
        return;
      }

      // 400, 500, ou tout autre statut inattendu.
      dialogRef.current?.close();
      showToast("error", "Une erreur est survenue.");
      setIsSubmitting(false);
    } catch {
      dialogRef.current?.close();
      showToast("error", "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center justify-center rounded-full border border-black/10 px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:hover:bg-white/10"
      >
        {isEditMode ? "Modifier le budget" : "Définir un budget"}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/10 backdrop:bg-black/40 dark:border-white/10 dark:bg-[#0a0a0a]"
      >
        <h2 id={dialogTitleId} className="text-base font-semibold text-foreground">
          {isEditMode ? "Modifier le budget" : "Définir un budget"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div>
            <label htmlFor={amountId} className="block text-sm font-medium text-foreground">
              Montant
            </label>
            <div className="relative mt-1.5">
              <input
                id={amountId}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${amountId}-error` : undefined}
                placeholder="0,00"
                className="block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 pr-9 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-foreground/40"
              >
                €
              </span>
            </div>
            {error && (
              <p id={`${amountId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDialog}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:hover:bg-white/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <SpinnerIcon />}
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
