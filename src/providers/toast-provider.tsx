"use client";

import { CheckCircle2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const googleLoginToastKey = "mentorlagbe:google-login-success";
const ToastContext = createContext<((message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage(nextMessage);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(googleLoginToastKey) !== "true") {
      return;
    }

    window.sessionStorage.removeItem(googleLoginToastKey);
    const timeout = window.setTimeout(() => {
      showToast("Login successful. Welcome back!");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [showToast]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-20 z-[100] flex max-w-sm items-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm shadow-lg"
        >
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <span className="flex-1">{message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setMessage(null);
            }}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return showToast;
}
