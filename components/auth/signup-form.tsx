"use client";

import { useActionState, useId, useMemo, useState } from "react";
import { signup, type SignupState } from "@/lib/actions/auth";
import { SpinnerIcon } from "@/components/spinner-icon";

const passwordRequirements = [
  {
    label: "Au moins 8 caractères",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Au moins une majuscule",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Au moins un chiffre",
    test: (value: string) => /[0-9]/.test(value),
  },
];

const initialState: SignupState = undefined;

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const messageId = useId();
  const requirementsId = useId();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  const fieldErrors = state?.status === "error" ? state.fieldErrors : undefined;
  const nameError = fieldErrors?.name?.[0];
  const emailError = fieldErrors?.email?.[0];
  const passwordError = fieldErrors?.password?.[0];
  const confirmPasswordError = passwordsMismatch
    ? "Les mots de passe ne correspondent pas."
    : fieldErrors?.confirmPassword?.[0];

  const inputClassName =
    "block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5";

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
          Nom
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? `${nameId}-error` : undefined}
          placeholder="Jean Dupont"
          className={`mt-1.5 ${inputClassName}`}
        />
        {nameError && (
          <p id={`${nameId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {nameError}
          </p>
        )}
      </div>

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
          className={`mt-1.5 ${inputClassName}`}
        />
        {emailError && (
          <p id={`${emailId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {emailError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-foreground">
          Mot de passe
        </label>
        <div className="relative mt-1.5">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={
              passwordError ? `${passwordId}-error ${requirementsId}` : requirementsId
            }
            className={`${inputClassName} pr-11`}
          />
          <PasswordToggle
            pressed={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </div>
        {passwordError && (
          <p id={`${passwordId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {passwordError}
          </p>
        )}
        <PasswordRequirements id={requirementsId} password={password} />
      </div>

      <div>
        <label
          htmlFor={confirmPasswordId}
          className="block text-sm font-medium text-foreground"
        >
          Confirmer le mot de passe
        </label>
        <div className="relative mt-1.5">
          <input
            id={confirmPasswordId}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={confirmPasswordError ? true : undefined}
            aria-describedby={confirmPasswordError ? `${confirmPasswordId}-error` : undefined}
            className={`${inputClassName} pr-11`}
          />
          <PasswordToggle
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
        {state?.status === "error" && state.message && (
          <p
            id={messageId}
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            {state.message}
          </p>
        )}
        {state?.status === "check_email" && state.message && (
          <p
            id={messageId}
            role="status"
            className="rounded-lg border border-brand/20 bg-brand/10 px-3 py-2 text-sm text-brand"
          >
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <SpinnerIcon />}
        {pending ? "Création du compte…" : "Créer mon compte"}
      </button>
    </form>
  );
}

function PasswordRequirements({ id, password }: { id: string; password: string }) {
  const results = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        label: requirement.label,
        met: requirement.test(password),
      })),
    [password],
  );

  return (
    <ul id={id} className="mt-2 space-y-1">
      {results.map((requirement) => (
        <li
          key={requirement.label}
          className={`flex items-center gap-1.5 text-xs ${
            requirement.met ? "text-brand" : "text-foreground/50"
          }`}
        >
          {requirement.met ? <CheckIcon /> : <DotIcon />}
          <span>{requirement.label}</span>
          {requirement.met && <span className="sr-only"> (validé)</span>}
        </li>
      ))}
    </ul>
  );
}

function PasswordToggle({
  pressed,
  onToggle,
}: {
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={pressed}
      aria-label={pressed ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-md text-foreground/50 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {pressed ? <EyeOffIcon /> : <EyeIcon />}
    </button>
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4 10-10" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
