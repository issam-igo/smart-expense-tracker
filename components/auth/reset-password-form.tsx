"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePassword, type ResetPasswordState } from "@/lib/actions/auth";
import { SpinnerIcon } from "@/components/spinner-icon";
import { PasswordToggleButton } from "@/components/password-toggle-button";

const initialState: ResetPasswordState = undefined;
const REDIRECT_DELAY_MS = 1800;

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  const passwordId = useId();
  const confirmPasswordId = useId();
  const errorId = useId();
  const [showPassword, setShowPassword] = useState(false);

  const fieldErrors = state?.status === "error" ? state.fieldErrors : undefined;
  const passwordError = fieldErrors?.password?.[0];
  const confirmPasswordError = fieldErrors?.confirmPassword?.[0];
  const formError = state?.status === "error" ? state.message : undefined;

  useEffect(() => {
    if (state?.status !== "success") return;
    const timer = window.setTimeout(() => {
      router.push("/login");
    }, REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state?.status, router]);

  if (state?.status === "success") {
    return (
      <p
        role="status"
        className="mt-6 rounded-lg border border-brand/20 bg-brand/10 px-3 py-2 text-sm text-brand"
      >
        Mot de passe mis à jour. Redirection vers la connexion…
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-foreground">
          Nouveau mot de passe
        </label>
        <div className="relative mt-1.5">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? `${passwordId}-error` : undefined}
            className="block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 pr-11 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
          />
          <PasswordToggleButton
            pressed={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </div>
        {passwordError && (
          <p id={`${passwordId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {passwordError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={confirmPasswordId}
          className="block text-sm font-medium text-foreground"
        >
          Confirmer le nouveau mot de passe
        </label>
        <div className="relative mt-1.5">
          <input
            id={confirmPasswordId}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            aria-invalid={confirmPasswordError ? true : undefined}
            aria-describedby={confirmPasswordError ? `${confirmPasswordId}-error` : undefined}
            className="block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 pr-11 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
          />
          <PasswordToggleButton
            pressed={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </div>
        {confirmPasswordError && (
          <p
            id={`${confirmPasswordId}-error`}
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {confirmPasswordError}
          </p>
        )}
      </div>

      <div aria-live="polite">
        {formError && (
          <p
            id={errorId}
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            {formError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <SpinnerIcon />}
        {pending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
