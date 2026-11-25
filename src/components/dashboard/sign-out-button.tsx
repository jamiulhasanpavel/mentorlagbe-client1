"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setErrorMessage("");
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setErrorMessage(error.message || "Unable to sign out. Please try again.");
        return;
      }

      router.replace("/sign-in");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign out. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon" : "default"}
        className={compact ? "size-10" : "w-full justify-start"}
        aria-label={compact ? "Sign out" : undefined}
        title={compact ? "Sign out" : undefined}
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        <LogOut />
        <span className={compact ? "sr-only" : ""}>
          {isSigningOut ? "Signing out..." : "Sign out"}
        </span>
      </Button>
      {errorMessage && (
        <p role="alert" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-destructive/30 bg-background p-3 text-xs text-destructive shadow-lg">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
