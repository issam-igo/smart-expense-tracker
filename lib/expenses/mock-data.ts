import type { Expense } from "@/types/expense";

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

const MOCK_USER_ID = "mock-user";

export const mockExpenses: Expense[] = [
  {
    id: "1",
    userId: MOCK_USER_ID,
    title: "Loyer",
    amount: 950,
    category: "Housing",
    expenseDate: daysAgo(2),
    createdAt: daysAgo(2),
  },
  {
    id: "2",
    userId: MOCK_USER_ID,
    title: "Courses",
    amount: 85.6,
    category: "Food",
    expenseDate: daysAgo(1),
    createdAt: daysAgo(1),
  },
  {
    id: "3",
    userId: MOCK_USER_ID,
    title: "Café",
    amount: 4.2,
    category: "Food",
    expenseDate: daysAgo(0),
    createdAt: daysAgo(0),
  },
  {
    id: "4",
    userId: MOCK_USER_ID,
    title: "Essence",
    amount: 62,
    category: "Transport",
    expenseDate: daysAgo(2),
    createdAt: daysAgo(2),
  },
  {
    id: "5",
    userId: MOCK_USER_ID,
    title: "Abonnement streaming",
    amount: 12.99,
    category: "Entertainment",
    expenseDate: daysAgo(6),
    createdAt: daysAgo(6),
  },
  {
    id: "6",
    userId: MOCK_USER_ID,
    title: "Pharmacie",
    amount: 18.5,
    category: "Health",
    expenseDate: daysAgo(9),
    createdAt: daysAgo(9),
  },
  {
    id: "7",
    userId: MOCK_USER_ID,
    title: "Vêtements",
    amount: 74.9,
    category: "Shopping",
    expenseDate: daysAgo(12),
    createdAt: daysAgo(12),
  },
  {
    id: "8",
    userId: MOCK_USER_ID,
    title: "Livre",
    amount: 22,
    category: "Education",
    expenseDate: daysAgo(15),
    createdAt: daysAgo(15),
  },
  {
    id: "9",
    userId: MOCK_USER_ID,
    title: "Restaurant",
    amount: 45.3,
    category: "Food",
    expenseDate: daysAgo(18),
    createdAt: daysAgo(18),
    description: "Dîner entre amis",
  },
  {
    id: "10",
    userId: MOCK_USER_ID,
    title: "Transport en commun",
    amount: 38,
    category: "Transport",
    expenseDate: daysAgo(20),
    createdAt: daysAgo(20),
  },
  {
    id: "11",
    userId: MOCK_USER_ID,
    title: "Assurance habitation",
    amount: 120,
    category: "Housing",
    expenseDate: daysAgo(22),
    createdAt: daysAgo(22),
  },
  {
    id: "12",
    userId: MOCK_USER_ID,
    title: "Cinéma",
    amount: 15,
    category: "Entertainment",
    expenseDate: daysAgo(45),
    createdAt: daysAgo(45),
  },
];
