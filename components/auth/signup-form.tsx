"use client";

import { useActionState, useId, useMemo, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Circle } from "lucide-react";
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

const STRENGTH_LEVELS = {
  weak: { label: "Faible", barColor: "bg-red-500", textColor: "text-red-500", width: "w-1/3" },
  medium: {
    label: "Moyen",
    barColor: "bg-amber-500",
    textColor: "text-amber-500",
    width: "w-2/3",
  },
  strong: {
    label: "Fort",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-500",
    width: "w-full",
  },
} as const;

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
    "block w-full rounded-xl border border-black/10 bg-white py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/5";

  const requirementResults = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        label: requirement.label,
        met: requirement.test(password),
      })),
    [password],
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
          Nom complet
        </label>
        <div className="relative mt-1.5">
          <User
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-foreground/40"
          />
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? `${nameId}-error` : undefined}
            placeholder="Jean Dupont"
            className={`${inputClassName} pr-3.5 pl-10`}
          />
        </div>
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
        <div className="relative mt-1.5">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-foreground/40"
          />
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? `${emailId}-error` : undefined}
            placeholder="vous@exemple.com"
            className={`${inputClassName} pr-3.5 pl-10`}
          />
        </div>
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
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-foreground/40"
          />
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
            className={`${inputClassName} pr-11 pl-10`}
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
        <PasswordStrengthMeter password={password} results={requirementResults} />
        <PasswordRequirements id={requirementsId} results={requirementResults} />
      </div>

      <div>
        <label
          htmlFor={confirmPasswordId}
          className="block text-sm font-medium text-foreground"
        >
          Confirmer le mot de passe
        </label>
        <div className="relative mt-1.5">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-foreground/40"
          />
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
            className={`${inputClassName} pr-11 pl-10`}
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
        {pending ? <SpinnerIcon /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Création du compte…" : "Créer mon compte"}
      </button>
    </form>
  );
}

interface PasswordRequirementResult {
  label: string;
  met: boolean;
}

function PasswordStrengthMeter({
  password,
  results,
}: {
  password: string;
  results: PasswordRequirementResult[];
}) {
  if (password.length === 0) {
    return null;
  }

  const metCount = results.filter((requirement) => requirement.met).length;
  const strength =
    metCount >= 3 ? STRENGTH_LEVELS.strong : metCount === 2 ? STRENGTH_LEVELS.medium : STRENGTH_LEVELS.weak;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground/50">Sécurité du mot de passe :</span>
        <span className={`font-medium ${strength.textColor}`}>{strength.label}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className={`h-full rounded-full transition-all ${strength.barColor} ${strength.width}`} />
      </div>
    </div>
  );
}

function PasswordRequirements({
  id,
  results,
}: {
  id: string;
  results: PasswordRequirementResult[];
}) {
  return (
    <ul id={id} className="mt-2 space-y-1">
      {results.map((requirement) => (
        <li
          key={requirement.label}
          className={`flex items-center gap-1.5 text-xs ${
            requirement.met ? "text-brand" : "text-foreground/50"
          }`}
        >
          {requirement.met ? (
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <Circle className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true" />
          )}
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
      {pressed ? (
        <EyeOff className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Eye className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
