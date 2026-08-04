import { NextResponse } from "next/server";

// Format d'erreur JSON cohérent pour toute l'API /api/expenses.
export function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}
