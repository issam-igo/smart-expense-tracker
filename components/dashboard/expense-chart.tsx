"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryTotal } from "@/lib/expenses/summary";
import { formatCurrency } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";

export function ExpenseChart({ data }: { data: CategoryTotal[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Aucune dépense pour ce mois"
        description="Le graphique apparaîtra dès que vous aurez ajouté une dépense pour ce mois."
      />
    );
  }

  const chartLabel = data
    .map((item) => `${item.category} : ${formatCurrency(item.total)}`)
    .join(", ");

  return (
    <div
      role="img"
      aria-label={`Répartition des dépenses par catégorie : ${chartLabel}`}
      className="h-72 w-full sm:h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            cursor={{ fill: "rgba(22,163,74,0.08)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 13,
            }}
          />
          <Bar dataKey="total" fill="var(--brand)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
