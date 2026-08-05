import { ChevronDown } from "lucide-react";

export interface UserProfileInfo {
  displayName: string;
  initials: string;
}

export function UserProfile({ user }: { user: UserProfileInfo }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-full border border-black/5 py-1 pr-3 pl-1 dark:border-white/10">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
      >
        {user.initials}
      </span>
      <p className="min-w-0 truncate text-sm font-medium text-foreground">{user.displayName}</p>
      <ChevronDown className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden="true" />
    </div>
  );
}
