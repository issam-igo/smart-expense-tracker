import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { expenseIdSchema, expenseUpdateSchema } from "@/lib/validation/expense";
import { toExpense, toUpdateRow, type ExpenseRow } from "@/lib/expenses/mappers";
import { jsonError } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  const { id } = await params;
  const idResult = expenseIdSchema.safeParse(id);
  if (!idResult.success) {
    return jsonError(400, "Identifiant invalide.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Corps de requête JSON invalide.");
  }

  const parsed = expenseUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, "Données invalides.", parsed.error.flatten().fieldErrors);
  }

  // Aucun filtre user_id ici : la policy RLS UPDATE restreint déjà la ligne modifiable
  // à celles de l'utilisateur connecté ; 0 ligne affectée peut donc signifier "n'existe
  // pas" ou "appartient à quelqu'un d'autre" — volontairement indiscernable (404 les deux).
  const { data, error } = await supabase
    .from("expenses")
    .update(toUpdateRow(parsed.data))
    .eq("id", idResult.data)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[PATCH /api/expenses/:id] erreur Supabase :", error.message); // TODO: log temporaire de diagnostic, à retirer
    return jsonError(500, "Une erreur est survenue.");
  }

  if (!data) {
    return jsonError(404, "Dépense introuvable.");
  }

  return NextResponse.json(toExpense(data as ExpenseRow));
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  const { id } = await params;
  const idResult = expenseIdSchema.safeParse(id);
  if (!idResult.success) {
    return jsonError(400, "Identifiant invalide.");
  }

  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", idResult.data)
    .select()
    .maybeSingle();

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  if (!data) {
    return jsonError(404, "Dépense introuvable.");
  }

  return new NextResponse(null, { status: 204 });
}
