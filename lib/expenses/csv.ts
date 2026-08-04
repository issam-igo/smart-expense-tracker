export interface ExportableExpense {
  title: string;
  category: string;
  amount: number;
  expense_date: string;
  description: string | null;
}

const CSV_HEADERS = ["Title", "Category", "Amount", "Expense Date", "Description"];

// Évite qu'Excel mal-interprète les caractères accentués (é, à…) à l'ouverture du CSV.
const UTF8_BOM = String.fromCharCode(0xfeff);

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvRow(fields: string[]): string {
  return fields.map(escapeCsvField).join(",");
}

export function toCsv(expenses: ExportableExpense[]): string {
  const lines = [
    toCsvRow(CSV_HEADERS),
    ...expenses.map((expense) =>
      toCsvRow([
        expense.title,
        expense.category,
        expense.amount.toFixed(2),
        expense.expense_date,
        expense.description ?? "",
      ]),
    ),
  ];

  return `${UTF8_BOM}${lines.join("\r\n")}\r\n`;
}
