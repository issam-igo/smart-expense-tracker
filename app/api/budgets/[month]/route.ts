import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { monthKeySchema, budgetUpsertSchema } from "@/lib/validation/budget";
import { jsonError } from "@/lib/api/response";
import type { MonthlyBudget } from "@/types/budget";

interface RouteParams {
  params: Promise<{ month: string }>;
}

// Forme d'une ligne renvoyée par Supabase (colonnes snake_case).
interface BudgetRow {
  id: string;
  user_id: string;
  month: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

function toBudget(row: BudgetRow): MonthlyBudget {
  return {
    id: row.id,
    userId: row.user_id,
    month: row.month,
    amount: Number(row.amount),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  const { month } = await params;
  const monthResult = monthKeySchema.safeParse(month);
  if (!monthResult.success) {
    return jsonError(400, "Mois invalide.");
  }

  // Aucun filtre user_id ici : la policy RLS SELECT restreint déjà le résultat
  // aux budgets de l'utilisateur connecté.
  const { data, error } = await supabase
    .from("monthly_budgets")
    .select("*")
    .eq("month", monthResult.data)
    .maybeSingle();

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  if (!data) {
    return jsonError(404, "Aucun budget pour ce mois.");
  }

  return NextResponse.json(toBudget(data as BudgetRow));
}

export async function PUT(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  const { month } = await params;
  const monthResult = monthKeySchema.safeParse(month);
  if (!monthResult.success) {
    return jsonError(400, "Mois invalide.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Corps de requête JSON invalide.");
  }

  const parsed = budgetUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, "Données invalides.", parsed.error.flatten().fieldErrors);
  }

  // user_id toujours dérivé de la session serveur, jamais accepté depuis le client.
  // onConflict cible la contrainte unique (user_id, month) : crée ou met à jour en une
  // seule opération atomique.
  const { data, error } = await supabase
    .from("monthly_budgets")
    .upsert(
      {
        user_id: user.id,
        month: monthResult.data,
        amount: parsed.data.amount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,month" },
    )
    .select()
    .single();

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  return NextResponse.json(toBudget(data as BudgetRow));
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  const { month } = await params;
  const monthResult = monthKeySchema.safeParse(month);
  if (!monthResult.success) {
    return jsonError(400, "Mois invalide.");
  }

  // Aucun filtre user_id ici : la policy RLS DELETE restreint déjà la ligne supprimable
  // à celles de l'utilisateur connecté.
  const { data, error } = await supabase
    .from("monthly_budgets")
    .delete()
    .eq("month", monthResult.data)
    .select()
    .maybeSingle();

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  if (!data) {
    return jsonError(404, "Aucun budget à supprimer pour ce mois.");
  }

  return new NextResponse(null, { status: 204 });
}
