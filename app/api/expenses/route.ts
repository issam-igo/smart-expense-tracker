import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { expenseCreateSchema } from "@/lib/validation/expense";
import { toExpense, toInsertRow, type ExpenseRow } from "@/lib/expenses/mappers";
import { jsonError } from "@/lib/api/response";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  // Aucun filtre user_id ici : la policy RLS SELECT restreint déjà le résultat
  // aux dépenses de l'utilisateur connecté.
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  return NextResponse.json((data as ExpenseRow[]).map(toExpense));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Corps de requête JSON invalide.");
  }

  const parsed = expenseCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, "Données invalides.", parsed.error.flatten().fieldErrors);
  }

  // user_id est toujours dérivé de la session serveur, jamais du payload client.
  const { data, error } = await supabase
    .from("expenses")
    .insert(toInsertRow(user.id, parsed.data))
    .select()
    .single();

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  return NextResponse.json(toExpense(data as ExpenseRow), { status: 201 });
}
