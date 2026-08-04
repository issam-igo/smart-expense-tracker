import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName, getInitials } from "@/lib/user-display";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ToastProvider } from "@/components/toast/toast-provider";

export const metadata: Metadata = {
  title: "Dashboard — Smart Expense Tracker",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? { displayName: getDisplayName(user), initials: getInitials(getDisplayName(user)) }
    : null;

  return (
    <ToastProvider>
      <DashboardNav user={profile} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </ToastProvider>
  );
}
