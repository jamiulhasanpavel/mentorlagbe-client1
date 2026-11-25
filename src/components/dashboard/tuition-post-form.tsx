"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TuitionPostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const budgetText = String(formData.get("budget") || "").trim();
    const budget = budgetText ? Number(budgetText) : undefined;
    if (budgetText && (budget === undefined || !Number.isFinite(budget) || budget < 0)) {
      setErrorMessage("Enter a valid monthly budget.");
      setIsSubmitting(false);
      return;
    }

    const tuition = {
      title: String(formData.get("title") || ""),
      subject: String(formData.get("subject") || ""),
      className: String(formData.get("className") || ""),
      description: String(formData.get("description") || ""),
      location: String(formData.get("location") || ""),
      schedule: String(formData.get("schedule") || ""),
      mode: String(formData.get("mode") || ""),
      gender: String(formData.get("gender") || ""),
      ...(budget === undefined ? {} : { budget }),
    };

    try {
      const response = await fetch("/api/tuition", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tuition),
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
            : "Unable to submit the tuition. Please try again.",
        );
        return;
      }

      router.push("/dashboard/tutor/tuitions");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to submit the tuition.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-background p-5 sm:p-7">
      {errorMessage && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Tuition title
          <input name="title" required minLength={3} maxLength={150} className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Subject
          <input name="subject" required minLength={2} maxLength={100} className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Class or level
          <input name="className" maxLength={80} placeholder="e.g. HSC, Class 8" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Location
          <input name="location" maxLength={200} placeholder="Area, city" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Monthly budget (BDT)
          <input name="budget" type="number" min="0" step="1" inputMode="numeric" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Tuition mode
          <select name="mode" defaultValue="At student home" className="h-11 rounded-lg border bg-background px-3">
            <option>At student home</option>
            <option>At tutor home</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Schedule
          <input name="schedule" maxLength={100} placeholder="e.g. 3 days per week" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Preferred tutor
          <input name="gender" maxLength={80} placeholder="Any" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Description
          <textarea name="description" maxLength={5000} rows={5} className="resize-y rounded-lg border bg-background px-3 py-2" />
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting for review..." : "Submit tuition"}
        </Button>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        New tuition posts are reviewed by an administrator before they appear publicly.
      </p>
    </form>
  );
}
