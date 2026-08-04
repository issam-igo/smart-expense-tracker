"use client";

import { useActionState, useId } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "@/lib/actions/auth";
import { SpinnerIcon } from "@/components/spinner-icon";

const initialState: ForgotPasswordState = undefined;

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  const emailId = useId();
  const emailError = state?.status === "error" ? state.fieldErrors?.email?.[0] : undefined;

  if (state?.status === "success") {
    return (
      <p
        role="status"
        className="mt-6 rounded-lg border border-brand/20 bg-brand/10 px-3 py-2 text-sm text-brand"
      >
        Si un compte correspond à cette adresse, un courriel de réinitialisation a été envoyé.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-foreground">
          Adresse email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${emailId}-error` : undefined}
          placeholder="vous@exemple.com"
          className="mt-1.5 block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
        />
        {emailError && (
          <p id={`${emailId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {emailError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <SpinnerIcon />}
        {pending ? "Envoi en cours…" : "Envoyer le lien de réinitialisation"}
      </button>
    </form>
  );
}
