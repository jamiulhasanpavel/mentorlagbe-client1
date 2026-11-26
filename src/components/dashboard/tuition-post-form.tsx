"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Tuition } from "@/lib/tuitions";

const MAX_BANNER_SIZE = 5 * 1024 * 1024;
const ALLOWED_BANNER_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function TuitionPostForm({ initialTuition }: { initialTuition?: Tuition }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const budgetText = String(formData.get("budget") || "").trim();
    const budget = budgetText ? Number(budgetText) : null;
    if (budgetText && (budget === null || !Number.isFinite(budget) || budget < 0)) {
      setErrorMessage("Enter a valid monthly budget.");
      setIsSubmitting(false);
      return;
    }

    try {
      let bannerImage = initialTuition?.bannerImage;
      if (bannerFile) {
        const uploadData = new FormData();
        uploadData.set("image", bannerFile);
        const uploadResponse = await fetch("/api/profile/avatar", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult: unknown = await uploadResponse.json();
        if (
          !uploadResponse.ok ||
          !uploadResult ||
          typeof uploadResult !== "object" ||
          !("url" in uploadResult) ||
          typeof uploadResult.url !== "string"
        ) {
          throw new Error(
            uploadResult &&
              typeof uploadResult === "object" &&
              "error" in uploadResult &&
              typeof uploadResult.error === "string"
              ? uploadResult.error
              : "Unable to upload the tuition banner.",
          );
        }
        bannerImage = uploadResult.url;
      }

      const tuition = {
        title: String(formData.get("title") || ""),
        subject: String(formData.get("subject") || ""),
        className: String(formData.get("className") || ""),
        description: String(formData.get("description") || ""),
        location: String(formData.get("location") || ""),
        schedule: String(formData.get("schedule") || ""),
        daysPerWeek: Number(formData.get("daysPerWeek")),
        mode: String(formData.get("mode") || ""),
        gender: String(formData.get("gender") || ""),
        budget,
        ...(bannerImage ? { bannerImage } : {}),
      };
      const isEditing = Boolean(initialTuition?.id);
      const response = await fetch(
        isEditing ? `/api/tuition/${initialTuition?.id}` : "/api/tuition",
        {
          method: isEditing ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tuition),
        },
      );
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

      router.push("/dashboard/tutor/my-tuitions");
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
          <input name="title" required minLength={3} maxLength={150} defaultValue={initialTuition?.title} className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Subject
          <input name="subject" required minLength={2} maxLength={100} defaultValue={initialTuition?.subject} className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Class or level
          <input name="className" maxLength={80} defaultValue={initialTuition?.className} placeholder="e.g. HSC, Class 8" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Location
          <input name="location" maxLength={200} defaultValue={initialTuition?.location} placeholder="Area, city" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Monthly budget (BDT)
          <input name="budget" type="number" min="0" step="1" inputMode="numeric" defaultValue={initialTuition?.budget ?? ""} className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Tuition mode
          <select name="mode" defaultValue={initialTuition?.mode || "At student home"} className="h-11 rounded-lg border bg-background px-3">
            <option>At student home</option>
            <option>At tutor home</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Schedule
          <input name="schedule" maxLength={100} defaultValue={initialTuition?.schedule} placeholder="e.g. Sunday, Tuesday and Thursday after 5 PM" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Days per week
          <input
            name="daysPerWeek"
            type="number"
            min="1"
            max="7"
            step="1"
            required
            defaultValue={initialTuition?.daysPerWeek ?? 3}
            className="h-11 rounded-lg border bg-background px-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Preferred tutor
          <input name="gender" maxLength={80} defaultValue={initialTuition?.gender} placeholder="Any" className="h-11 rounded-lg border bg-background px-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Description
          <textarea name="description" maxLength={5000} rows={5} defaultValue={initialTuition?.description} className="resize-y rounded-lg border bg-background px-3 py-2" />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Tuition banner image
          <input
            type="file"
            accept={ALLOWED_BANNER_TYPES.join(",")}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] || null;
              if (!file) {
                setBannerFile(null);
                return;
              }
              if (!ALLOWED_BANNER_TYPES.includes(file.type) || file.size > MAX_BANNER_SIZE) {
                setErrorMessage("Choose a JPEG, PNG, or WebP banner no larger than 5 MB.");
                event.currentTarget.value = "";
                setBannerFile(null);
                return;
              }
              setErrorMessage("");
              setBannerFile(file);
            }}
            className="min-h-11 rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <span className="text-xs font-normal text-muted-foreground">
            {bannerFile?.name || (initialTuition?.bannerImage ? "Current banner will be kept unless replaced." : "Optional; JPEG, PNG, or WebP, max 5 MB.")}
          </span>
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? initialTuition ? "Saving changes..." : "Submitting for review..."
            : initialTuition ? "Save changes" : "Submit tuition"}
        </Button>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        New tuition posts are reviewed by an administrator before they appear publicly.
      </p>
    </form>
  );
}
