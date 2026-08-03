import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 px-6 py-12 text-center dark:border-white/15">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-foreground/40 dark:bg-white/10"
      >
        <InboxIcon />
      </span>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-foreground/60">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function InboxIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12h4l2 3h6l2-3h4M5 12 3 19h18l-2-7-1.5-5h-11L5 12Z"
      />
    </svg>
  );
}
