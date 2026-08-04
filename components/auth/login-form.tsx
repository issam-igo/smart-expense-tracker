"use client";

import { useActionState, useId, useState } from "react";
import Link from "next/link";
import { login, type LoginState } from "@/lib/actions/auth";
import { SpinnerIcon } from "@/components/spinner-icon";

const initialState: LoginState = undefined;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const [showPassword, setShowPassword] = useState(false);

  const fieldErrors = state?.status === "error" ? state.fieldErrors : undefined;
  const emailError = fieldErrors?.email?.[0];
  const passwordError = fieldErrors?.password?.[0];
  const formError = state?.status === "error" ? state.message : undefined;

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor={emailId}
          className="block text-sm font-medium text-foreground"
        >
          Adresse email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={emailError || formError ? true : undefined}
          aria-describedby={emailError ? `${emailId}-error` : formError ? errorId : undefined}
          placeholder="vous@exemple.com"
          className="mt-1.5 block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
        />
        {emailError && (
          <p id={`${emailId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {emailError}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={passwordId}
            className="block text-sm font-medium text-foreground"
          >
            Mot de passe
          </label>
          <Link
            href="/forgot-password"
            className="rounded text-xs font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative mt-1.5">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={passwordError || formError ? true : undefined}
            aria-describedby={
              passwordError ? `${passwordId}-error` : formError ? errorId : undefined
            }
            placeholder="••••••••"
            className="block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 pr-11 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-pressed={showPassword}
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-md text-foreground/50 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {passwordError && (
          <p id={`${passwordId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {passwordError}
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
        {pending ? "Connexion en cours…" : "Se connecter"}
      </button>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
      />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 5.1A9.4 9.4 0 0 1 12 5c6 0 9.5 7 9.5 7a13.9 13.9 0 0 1-3.15 4.03M6.5 6.7C4.2 8.2 2.5 12 2.5 12s1.6 3.3 4.9 5.3"
      />
    </svg>
  );
}
