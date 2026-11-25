"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { DashboardApplication } from "@/lib/dashboard-data";

export function ApplicationList({
  applications,
  canManage = false,
}: {
  applications: DashboardApplication[];
  canManage?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(applications);
  const [busyId, setBusyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function updateStatus(id: string, status: "accepted" | "rejected") {
    setBusyId(id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
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
            : "Unable to update application status.",
        );
        return;
      }

      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      setSuccessMessage(`Application ${status}.`);
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update application status.",
      );
    } finally {
      setBusyId("");
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed px-5 py-14 text-center">
        <h2 className="text-lg font-bold">No applications yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Applications will appear here as soon as a student applies to a tuition.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      {items.map((application) => (
        <article key={application.id} className="rounded-2xl border bg-background p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{application.tuitionTitle}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Submitted {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
              {application.status}
            </span>
          </div>
          {application.message && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {application.message}
            </p>
          )}
          {canManage && application.status === "pending" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={busyId === application.id}
                onClick={() => updateStatus(application.id, "accepted")}
              >
                {busyId === application.id ? "Updating..." : "Accept"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === application.id}
                onClick={() => updateStatus(application.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
