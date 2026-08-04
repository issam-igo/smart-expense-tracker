-- Smart Expense Tracker — schéma de la table des dépenses.
--
-- Ce fichier est une référence, pas exécuté automatiquement. À appliquer manuellement
-- via le SQL Editor de Supabase (ou `supabase db push` / une migration CLI).
--
-- Idempotence : les instructions create index/policy et alter table sont rejouables
-- sans erreur. `create table if not exists` ne modifie pas les contraintes d'une table
-- déjà existante avec un schéma différent — sur un projet où la table existe déjà avec
-- une définition différente, une migration ALTER TABLE dédiée serait nécessaire.
--
-- Catégories : alignées sur celles déjà utilisées dans le code (types/expense.ts,
-- le formulaire d'ajout de dépense, le graphique du dashboard, CLAUDE.md).

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  amount numeric(10, 2) not null,
  category text not null,
  expense_date date not null default current_date,
  description text,
  created_at timestamptz not null default now(),
  constraint expenses_title_length check (char_length(title) between 1 and 120),
  constraint expenses_amount_positive check (amount > 0),
  constraint expenses_category_allowed check (
    category in (
      'Food',
      'Transport',
      'Housing',
      'Shopping',
      'Entertainment',
      'Health',
      'Education',
      'Other'
    )
  ),
  constraint expenses_description_length check (
    description is null or char_length(description) <= 500
  )
);

create index if not exists expenses_user_id_idx on public.expenses (user_id);

alter table public.expenses enable row level security;

drop policy if exists expenses_select_own on public.expenses;
create policy expenses_select_own
  on public.expenses
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists expenses_insert_own on public.expenses;
create policy expenses_insert_own
  on public.expenses
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists expenses_update_own on public.expenses;
create policy expenses_update_own
  on public.expenses
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists expenses_delete_own on public.expenses;
create policy expenses_delete_own
  on public.expenses
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Budget mensuel — un seul budget par utilisateur et par mois.
--
-- month reste au format texte 'YYYY-MM' (même convention que côté application :
-- lib/expenses/month.ts, paramètre d'URL ?month=) plutôt qu'un type date, pour éviter
-- toute conversion : les recherches se font toujours par égalité exacte sur le mois.

create table if not exists public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month text not null,
  amount numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monthly_budgets_month_format check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  constraint monthly_budgets_amount_positive check (amount > 0),
  constraint monthly_budgets_user_month_unique unique (user_id, month)
);

-- Aucun index séparé sur user_id : l'index unique (user_id, month) créé automatiquement
-- par la contrainte ci-dessus couvre déjà le seul pattern d'accès (recherche exacte par
-- utilisateur + mois) — contrairement à expenses, où les requêtes portent sur une plage.

alter table public.monthly_budgets enable row level security;

drop policy if exists monthly_budgets_select_own on public.monthly_budgets;
create policy monthly_budgets_select_own
  on public.monthly_budgets
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists monthly_budgets_insert_own on public.monthly_budgets;
create policy monthly_budgets_insert_own
  on public.monthly_budgets
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists monthly_budgets_update_own on public.monthly_budgets;
create policy monthly_budgets_update_own
  on public.monthly_budgets
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists monthly_budgets_delete_own on public.monthly_budgets;
create policy monthly_budgets_delete_own
  on public.monthly_budgets
  for delete
  to authenticated
  using (auth.uid() = user_id);
