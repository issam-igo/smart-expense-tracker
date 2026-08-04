import { createClient } from "@/lib/supabase/server";
import { parseMonthParam, getMonthRange } from "@/lib/expenses/month";
import { parseSearch, parseSort, parseCategory, escapeIlikeSearch } from "@/lib/expenses/filters";
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
  const search = parseSearch(searchParams.get("search") ?? undefined);
  const sort = parseSort(searchParams.get("sort") ?? undefined);
  const category = parseCategory(searchParams.get("category") ?? undefined);
  const { start, end } = getMonthRange(month);

  // Mêmes filtres que le dashboard (mois, recherche, catégorie, tri), pour exporter
  // exactement les dépenses actuellement affichées. Colonnes techniques (id, user_id,
  // created_at) exclues dès la sélection. Aucun filtre user_id : la policy RLS SELECT
  // restreint déjà le résultat.
  let query = supabase
    .from("expenses")
    .select("title, category, amount, expense_date, description")
    .gte("expense_date", start)
    .lt("expense_date", end);

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const escaped = escapeIlikeSearch(search);
    query = query.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  switch (sort) {
    case "date-asc":
      query = query
        .order("expense_date", { ascending: true })
        .order("created_at", { ascending: true });
      break;
    case "amount-asc":
      query = query.order("amount", { ascending: true });
      break;
    case "amount-desc":
      query = query.order("amount", { ascending: false });
      break;
    case "title-asc":
      query = query.order("title", { ascending: true });
      break;
    case "title-desc":
      query = query.order("title", { ascending: false });
      break;
    case "date-desc":
    default:
      query = query
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

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
