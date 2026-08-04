"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

type ShowToast = (type: ToastType, message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback<ShowToast>(
    (type, message) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => removeToast(id), TOAST_DURATION_MS);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-foreground shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <span aria-hidden="true">{toast.type === "success" ? "✅" : "❌"}</span>
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer la notification"
              className="shrink-0 text-foreground/40 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé à l'intérieur d'un ToastProvider.");
  }
  return context;
}
