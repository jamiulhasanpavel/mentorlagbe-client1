"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function ApplyForTuition({ tuitionId }: { tuitionId: string }) {
  const { data: session, isPending } = authClient.useSession();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tuitionId, message }),
      });
      const result: unknown = await response.json();
      const body =
        typeof result === "object" && result !== null
          ? (result as Record<string, unknown>)
          : null;

      if (!response.ok || body?.success !== true) {
        setErrorMessage(
          typeof body?.message === "string"
            ? body.message
            : "Unable to submit your application. Please try again.",
        );
        return;
      }

      setSuccessMessage("Your application has been submitted.");
      setMessage("");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to submit your application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending) {
    return <Button className="mt-6 w-full" size="lg" disabled>Checking account…</Button>;
  }

  if (!session) {
    return (
      <>
        <Link href="/sign-in" className="mt-6 block">
          <Button className="w-full" size="lg">Sign in to apply</Button>
        </Link>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Sign in with a student account to submit an application.
        </p>
      </>
    );
  }

  if (session.user.role !== "student") {
    return (
      <p className="mt-6 rounded-lg border bg-background p-3 text-sm text-muted-foreground">
        Applications can only be submitted from a student account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <label className="grid gap-2 text-sm font-medium">
        Message to the tutor
        <textarea
          required
          minLength={10}
          maxLength={3000}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          placeholder="Introduce yourself and share your learning goals."
          className="min-h-28 resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30"
        />
      </label>
      {errorMessage && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Apply for this tuition"}
      </Button>
    </form>
  );
}
