"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Tuition } from "@/lib/tuitions";

export function ModerationQueue({
  tuitions,
  total,
}: {
  tuitions: Tuition[];
  total: number;
}) {
  const router = useRouter();
  const [items, setItems] = useState(tuitions);
  const [busyId, setBusyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function reviewTuition(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`/api/tuition/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body: unknown = await response.json();
      const result =
        typeof body === "object" && body !== null
          ? (body as Record<string, unknown>)
          : null;

      if (!response.ok || result?.success !== true) {
        setErrorMessage(
          typeof result?.message === "string"
            ? result.message
            : "Unable to update tuition moderation status.",
        );
        return;
      }

      setItems((current) => current.filter((tuition) => tuition.id !== id));
      setSuccessMessage(`Tuition ${status}.`);
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update moderation status.",
      );
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {items.length} of {total} pending listing{total === 1 ? "" : "s"}.
      </p>
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
      {items.length > 0 ? (
        items.map((tuition) => (
          <article key={tuition.id} className="rounded-2xl border bg-background p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">{tuition.subject}</p>
                <h3 className="mt-1 text-lg font-bold">{tuition.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {[tuition.className, tuition.location].filter(Boolean).join(" · ") || "Details not provided"}
                </p>
              </div>
              <span className="w-fit rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>
            </div>
            {tuition.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {tuition.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              <Button
                type="button"
                size="sm"
                disabled={busyId === tuition.id}
                onClick={() => reviewTuition(tuition.id, "approved")}
              >
                {busyId === tuition.id ? "Updating..." : "Approve"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === tuition.id}
                onClick={() => reviewTuition(tuition.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed px-5 py-14 text-center">
          <h3 className="font-semibold">No pending listings</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Newly submitted tuition posts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
