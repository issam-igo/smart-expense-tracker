"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { SpinnerIcon } from "@/components/spinner-icon";

const initialValues = {
  title: "",
  amount: "",
  category: "",
  expenseDate: "",
  description: "",
};

type FormValues = typeof initialValues;
type ValidatedField = "title" | "amount" | "category" | "expenseDate";
type FormErrors = Partial<Record<ValidatedField, string>>;

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

export function ExpenseForm() {
  const router = useRouter();

  const titleId = useId();
  const amountId = useId();
  const categoryId = useId();
  const dateId = useId();
  const descriptionId = useId();

  const titleRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const fieldRefs = {
    title: titleRef,
    amount: amountRef,
    category: categoryRef,
    expenseDate: dateRef,
  };

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Renseigné après le montage (plutôt qu'à l'initialisation) pour éviter un écart
  // entre la date figée au build et la date réelle du client au moment du rendu.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur uniquement disponible côté client (Date), pas de source externe à synchroniser
    setValues((current) => (current.expenseDate ? current : { ...current, expenseDate: todayIso() }));
  }, []);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (hasAttemptedSubmit) {
      setErrors(validate(nextValues));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstErrorField = fieldOrder.find((field) => nextErrors[field]);
    if (firstErrorField) {
      fieldRefs[firstErrorField].current?.focus();
      return;
    }

    setIsSubmitting(true);
    // Simulation locale uniquement : aucune API ni persistance à ce stade.
    window.setTimeout(() => {
      router.push("/dashboard");
    }, 900);
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
          id={descriptionId}
          name="description"
          rows={3}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Détails supplémentaires…"
          className={`mt-1.5 resize-none ${getInputClassName(false)}`}
        />
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
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
