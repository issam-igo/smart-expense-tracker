export interface UserProfileInfo {
  displayName: string;
  initials: string;
}

export function UserProfile({ user }: { user: UserProfileInfo }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand"
      >
        {user.initials}
      </span>
      <p className="min-w-0 truncate text-sm font-medium text-foreground">
        Bonjour, {user.displayName}
      </p>
    </div>
  );
}
