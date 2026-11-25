import Link from "next/link";
import { Suspense } from "react";
import { io } from "next/cache";
import { ArrowRight, BookOpen, Clock3, MapPin, Wallet } from "lucide-react";
import { formatTuitionBudget, getTuitions } from "@/lib/tuitions";

export function FeaturedTuitions() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Featured Tuitions
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Latest Approved Tuitions
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Discover current home and online tuition opportunities approved by administrators.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="color-animated-border inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            View all tuitions
            <ArrowRight />
          </Link>
        </div>

        <Suspense fallback={<FeaturedTuitionsLoading />}>
          <FeaturedTuitionCards />
        </Suspense>
      </div>
    </section>
  );
}

async function FeaturedTuitionCards() {
  await io();

  let tuitions: Awaited<ReturnType<typeof getTuitions>>["data"] = [];
  let errorMessage = "";
  try {
    const result = await getTuitions({ limit: 3 });
    tuitions = result.data;
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load featured tuitions right now.";
  }

  if (errorMessage) {
    return (
      <p role="alert" className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-muted-foreground">
        {errorMessage}
      </p>
    );
  }

  if (tuitions.length === 0) {
    return (
      <p className="mt-8 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No approved tuitions are available yet.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {tuitions.map((tuition) => (
        <article
          key={tuition.id}
          className="color-animated-border flex flex-col rounded-2xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {tuition.subject}
            </span>
            <span className="text-xs text-muted-foreground">Recently added</span>
          </div>

          <h3 className="mt-5 text-lg font-bold">{tuition.title}</h3>

          <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {tuition.location || "Location not specified"}
            </p>
            <p className="flex items-center gap-2">
              <Wallet className="size-4 text-primary" />
              {formatTuitionBudget(tuition.budget)}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 text-primary" />
              {tuition.schedule || tuition.mode || "Schedule negotiable"}
            </p>
          </div>

          <Link
            href={`/tuitions/${tuition.id}`}
            className="color-animated-border mt-6 flex h-9 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <BookOpen className="size-4" />
            View details
          </Link>
        </article>
      ))}
    </div>
  );
}

function FeaturedTuitionsLoading() {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading tuitions">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-72 animate-pulse rounded-2xl border bg-background" />
      ))}
    </div>
  );
}
