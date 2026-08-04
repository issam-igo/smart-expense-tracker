"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { SpinnerIcon } from "@/components/spinner-icon";

const emptyValues = {
  title: "",
  amount: "",
  category: "",
  expenseDate: "",
  description: "",
};

type FormValues = typeof emptyValues;
type ValidatedField = "title" | "amount" | "category" | "expenseDate";
type FormErrors = Partial<Record<ValidatedField | "description", string>>;

interface ExpenseFormProps {
  mode?: "create" | "edit";
  initialValues?: Partial<FormValues>;
}

const fieldOrder: ValidatedField[] = ["title", "amount", "category", "expenseDate"];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Le titre est requis.";
  }

  const amount = Number(values.amount);
  if (!values.amount.trim()) {
    errors.amount = "Le montant est requis.";
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = "Le montant doit être un nombre positif.";
  }

  if (!values.category) {
    errors.category = "La catégorie est requise.";
  }

  if (!values.expenseDate) {
    errors.expenseDate = "La date est requise.";
  }

  return errors;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function getInputClassName(hasError: boolean) {
  return `block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-foreground/40 focus:ring-2 dark:bg-white/5 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500/40"
      : "border-black/10 focus:border-brand focus:ring-brand/30 dark:border-white/15"
  }`;
}

export function ExpenseForm({ mode = "create", initialValues }: ExpenseFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const titleId = useId();
  const amountId = useId();
  const categoryId = useId();
  const dateId = useId();
  const descriptionId = useId();

  const titleRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fieldRefs = {
    title: titleRef,
    amount: amountRef,
    category: categoryRef,
    expenseDate: dateRef,
    description: descriptionRef,
  };

  const [values, setValues] = useState<FormValues>(() => ({
    ...emptyValues,
    ...initialValues,
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // En création uniquement : renseigné après le montage (plutôt qu'à l'initialisation)
  // pour éviter un écart entre la date figée au build et la date réelle du client.
  // En édition, la date vient déjà de initialValues et ne doit pas être écrasée.
  useEffect(() => {
    if (isEditMode) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur uniquement disponible côté client (Date), pas de source externe à synchroniser
    setValues((current) => (current.expenseDate ? current : { ...current, expenseDate: todayIso() }));
  }, [isEditMode]);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (hasAttemptedSubmit) {
      setErrors(validate(nextValues));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return; // empêche les doubles soumissions

    setHasAttemptedSubmit(true);
    setFormError(null);

    // Validation côté client : améliore l'UX (retour immédiat), mais l'API reste la
    // source de vérité finale — ses erreurs 422 sont fusionnées dans le même état.
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstErrorField = fieldOrder.find((field) => nextErrors[field]);
    if (firstErrorField) {
      fieldRefs[firstErrorField].current?.focus();
      return;
    }

    setIsSubmitting(true);

    if (isEditMode) {
      // Simulation locale uniquement : la modification n'est pas encore connectée à l'API.
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 900);
      return;
    }

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          amount: Number(values.amount),
          category: values.category,
          expenseDate: values.expenseDate,
          ...(values.description.trim() ? { description: values.description.trim() } : {}),
        }),
      });

      if (response.status === 201) {
        router.push("/dashboard");
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
        const details = body?.error?.details;

        if (details) {
          const mappedErrors = Object.fromEntries(
            Object.entries(details).map(([field, messages]) => [field, messages[0]]),
          ) as FormErrors;
          setErrors((current) => ({ ...current, ...mappedErrors }));

          const firstServerErrorField = [...fieldOrder, "description" as const].find(
            (field) => mappedErrors[field],
          );
          if (firstServerErrorField) {
            fieldRefs[firstServerErrorField].current?.focus();
          }
        } else {
          setFormError("Une erreur est survenue. Veuillez réessayer.");
        }

        setIsSubmitting(false);
        return;
      }

      // 400 (requête invalide), 500, ou tout autre statut inattendu.
      setFormError("Une erreur est survenue. Veuillez réessayer.");
      setIsSubmitting(false);
    } catch {
      // Échec réseau.
      setFormError("Une erreur est survenue. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor={titleId} className="block text-sm font-medium text-foreground">
          Titre
        </label>
        <input
          ref={titleRef}
          id={titleId}
          name="title"
          type="text"
          required
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          placeholder="Courses, loyer, essence…"
          className={`mt-1.5 ${getInputClassName(Boolean(errors.title))}`}
        />
        {errors.title && (
          <p id={`${titleId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={amountId} className="block text-sm font-medium text-foreground">
            Montant
          </label>
          <div className="relative mt-1.5">
            <input
              ref={amountRef}
              id={amountId}
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              required
              value={values.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              aria-invalid={errors.amount ? true : undefined}
              aria-describedby={errors.amount ? `${amountId}-error` : undefined}
              placeholder="0,00"
              className={`${getInputClassName(Boolean(errors.amount))} pr-9`}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-foreground/40"
            >
              €
            </span>
          </div>
          {errors.amount && (
            <p id={`${amountId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={dateId} className="block text-sm font-medium text-foreground">
            Date
          </label>
          <input
            ref={dateRef}
            id={dateId}
            name="expenseDate"
            type="date"
            required
            value={values.expenseDate}
            onChange={(event) => updateField("expenseDate", event.target.value)}
            aria-invalid={errors.expenseDate ? true : undefined}
            aria-describedby={errors.expenseDate ? `${dateId}-error` : undefined}
            className={`mt-1.5 ${getInputClassName(Boolean(errors.expenseDate))}`}
          />
          {errors.expenseDate && (
            <p id={`${dateId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.expenseDate}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={categoryId} className="block text-sm font-medium text-foreground">
          Catégorie
        </label>
        <select
          ref={categoryRef}
          id={categoryId}
          name="category"
          required
          value={values.category}
          onChange={(event) => updateField("category", event.target.value)}
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={errors.category ? `${categoryId}-error` : undefined}
          className={`mt-1.5 ${getInputClassName(Boolean(errors.category))}`}
        >
          <option value="" disabled>
            Sélectionner une catégorie
          </option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id={`${categoryId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={descriptionId} className="block text-sm font-medium text-foreground">
          Description <span className="font-normal text-foreground/50">(optionnelle)</span>
        </label>
        <textarea
          ref={descriptionRef}
          id={descriptionId}
          name="description"
          rows={3}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? `${descriptionId}-error` : undefined}
          placeholder="Détails supplémentaires…"
          className={`mt-1.5 resize-none ${getInputClassName(Boolean(errors.description))}`}
        />
        {errors.description && (
          <p
            id={`${descriptionId}-error`}
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.description}
          </p>
        )}
      </div>

      <div aria-live="polite">
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            {formError}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-white/15 dark:hover:bg-white/10"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting && <SpinnerIcon />}
          {isSubmitting
            ? isEditMode
              ? "Modification…"
              : "Enregistrement…"
            : isEditMode
              ? "Enregistrer les modifications"
              : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
