import { createClient } from "@/lib/supabase/server";
import { parseMonthParam, getMonthRange } from "@/lib/expenses/month";
import { toCsv, type ExportableExpense } from "@/lib/expenses/csv";
import { jsonError } from "@/lib/api/response";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(401, "Vous devez être connecté.");
  }

  const { searchParams } = new URL(request.url);
  const month = parseMonthParam(searchParams.get("month") ?? undefined);
  const { start, end } = getMonthRange(month);

  // Colonnes techniques (id, user_id, created_at) volontairement exclues de la
  // sélection : elles ne sont ni nécessaires ni exportées dans le CSV.
  // Aucun filtre user_id : la policy RLS SELECT restreint déjà le résultat.
  const { data, error } = await supabase
    .from("expenses")
    .select("title, category, amount, expense_date, description")
    .gte("expense_date", start)
    .lt("expense_date", end)
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError(500, "Une erreur est survenue.");
  }

  const csv = toCsv((data ?? []) as ExportableExpense[]);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="expenses-${month}.csv"`,
    },
  });
}
