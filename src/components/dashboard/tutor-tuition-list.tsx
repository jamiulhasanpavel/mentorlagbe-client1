"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Tuition } from "@/lib/tuitions";
import { formatTuitionBudget } from "@/lib/format-tuition-budget";

function getStatusLabel(status?: string, isActive?: boolean) {
  if (status === "pending") return "Pending admin approval";
  if (status === "rejected") return "Rejected by admin";
  if (status === "approved" && isActive === false) return "Closed";
  if (status === "approved") return "Approved · Active";
  return "Unknown status";
}

export function TutorTuitionList({ tuitions }: { tuitions: Tuition[] }) {
  const router = useRouter();
  const [items, setItems] = useState(tuitions);
  const [busyId, setBusyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function updateActiveStatus(tuition: Tuition) {
    const isActive = tuition.isActive === false;
    setBusyId(tuition.id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`/api/tuition/${tuition.id}/active`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
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
            : "Unable to update tuition availability.",
        );
        return;
      }

      setItems((current) =>
        current.map((item) => (item.id === tuition.id ? { ...item, isActive } : item)),
      );
      setSuccessMessage(isActive ? "Tuition reopened." : "Tuition closed.");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update tuition availability.",
      );
    } finally {
      setBusyId("");
    }
  }

  async function deleteTuition(tuition: Tuition) {
    if (!window.confirm(`Delete "${tuition.title}"? This cannot be undone.`)) return;

    setBusyId(tuition.id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`/api/tuition/${tuition.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result: unknown = await response.json();
      const body =
        typeof result === "object" && result !== null
          ? (result as Record<string, unknown>)
          : null;
      if (!response.ok || body?.success !== true) {
        setErrorMessage(
          typeof body?.message === "string" ? body.message : "Unable to delete tuition.",
        );
        return;
      }

      setItems((current) => current.filter((item) => item.id !== tuition.id));
      setSuccessMessage("Tuition post deleted.");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete tuition.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mt-6 space-y-4">
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
      {items.map((tuition) => (
        <article key={tuition.id} className="rounded-2xl border bg-background p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{tuition.subject}</p>
              <h2 className="mt-1 text-lg font-bold">{tuition.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {[tuition.className, tuition.location].filter(Boolean).join(" · ") || "Details not specified"}
              </p>
            </div>
            <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold">
              {getStatusLabel(tuition.status, tuition.isActive)}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
            <span>{formatTuitionBudget(tuition.budget)}</span>
            <span>
              {tuition.daysPerWeek
                ? `${tuition.daysPerWeek} days/week`
                : tuition.schedule || tuition.mode || "Schedule negotiable"}
            </span>
            {tuition.bannerImage && (
              <a
                href={tuition.bannerImage}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                View banner
              </a>
            )}
            {tuition.status === "approved" && (
              <Link href={`/tuitions/${tuition.id}`} className="font-semibold text-primary hover:underline">
                View public listing
              </Link>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/dashboard/tutor/tuitions/${tuition.id}/edit`}>
              <Button type="button" size="sm" variant="outline">
                Edit
              </Button>
            </Link>
            {tuition.status === "approved" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === tuition.id}
                onClick={() => void updateActiveStatus(tuition)}
              >
                {busyId === tuition.id
                  ? "Updating..."
                  : tuition.isActive === false ? "Reopen" : "Close"}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busyId === tuition.id}
              onClick={() => void deleteTuition(tuition)}
            >
              Delete
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
