"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { DashboardApplication } from "@/lib/dashboard-data";
import { formatTuitionBudget } from "@/lib/format-tuition-budget";

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

  async function cancelApplication(application: DashboardApplication) {
    if (!window.confirm(`Cancel your application for "${application.tuitionTitle}"?`)) {
      return;
    }

    setBusyId(application.id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
        credentials: "include",
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
            : "Unable to cancel this application.",
        );
        return;
      }

      setItems((current) => current.filter((item) => item.id !== application.id));
      setSuccessMessage("Application canceled.");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to cancel this application.",
      );
    } finally {
      setBusyId("");
    }
  }

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
        <h2 className="text-lg font-bold">
          {canManage ? "No applicants yet" : "No applications yet"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {canManage
            ? "Student applications will appear here when someone applies to your tuition."
            : "Your tuition applications will appear here."}
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
                Applied {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
              {application.status}
            </span>
          </div>
          {canManage ? (
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>Student: {application.studentName || "Student"}</p>
              {application.studentEmail && <p>Email: {application.studentEmail}</p>}
              {application.studentPhone && <p>Phone: {application.studentPhone}</p>}
              {application.preferredSchedule && (
                <p>Preferred schedule: {application.preferredSchedule}</p>
              )}
            </div>
          ) : (
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>Tutor: {application.tutorName || "Tutor"}</p>
              {application.tutorEmail && <p>Email: {application.tutorEmail}</p>}
              {typeof application.monthlyFee === "number" && (
                <p>Monthly fee: {formatTuitionBudget(application.monthlyFee)}</p>
              )}
            </div>
          )}
          {application.message && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {canManage && <span className="font-semibold text-foreground">Note: </span>}
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
          {!canManage && application.status === "pending" && (
            <div className="mt-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === application.id}
                onClick={() => void cancelApplication(application)}
              >
                {busyId === application.id ? "Canceling..." : "Cancel application"}
              </Button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
