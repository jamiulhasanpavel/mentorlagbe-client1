import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  MapPin,
  UserRound,
  Wallet,
} from "lucide-react";
import { ApplyForTuition } from "@/components/tuitions/apply-for-tuition";
import { Button } from "@/components/ui/button";
import {
  formatTuitionBudget,
  getTuition,
  TuitionApiError,
  type Tuition,
} from "@/lib/tuitions";

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let tuition: Tuition;
  try {
    tuition = await getTuition(id);
  } catch (error: unknown) {
    if (error instanceof TuitionApiError && error.status === 404) {
      notFound();
    }

    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h1 className="text-xl font-bold">Unable to load this tuition</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again later."}
          </p>
          <Link href="/tuitions" className="mt-6 inline-block">
            <Button variant="outline">Back to tuitions</Button>
          </Link>
        </div>
      </main>
    );
  }

  const postedDate =
    tuition.createdAt && !Number.isNaN(Date.parse(tuition.createdAt))
      ? new Date(tuition.createdAt).toLocaleDateString()
      : "Recently";

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to tuitions
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="rounded-2xl border bg-background p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {tuition.subject}
              </span>
              <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                {tuition.className || "All levels"}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">Posted {postedDate}</span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {tuition.title}
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetailItem icon={MapPin} label="Location" value={tuition.location || "Not specified"} />
              <DetailItem icon={Wallet} label="Monthly budget" value={formatTuitionBudget(tuition.budget)} />
              <DetailItem icon={Clock3} label="Schedule" value={tuition.schedule || "To be discussed"} />
              <DetailItem icon={BadgeCheck} label="Tuition mode" value={tuition.mode || "To be discussed"} />
            </div>

            <div className="mt-8 border-t pt-7">
              <h2 className="text-xl font-bold">About this tuition</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
                {tuition.description || "No additional description was provided."}
              </p>
            </div>

            <div className="mt-8 border-t pt-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred tutor
              </p>
              <p className="mt-2 flex items-center gap-2 font-medium">
                <UserRound className="size-4 text-primary" />
                {tuition.gender || "Any"}
              </p>
              {tuition.userId && (
                <Link
                  href={`/tutors/${encodeURIComponent(tuition.userId)}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  View tutor profile
                </Link>
              )}
            </div>
          </article>

          <aside className="h-fit rounded-2xl border bg-muted/20 p-6 lg:sticky lg:top-24">
            <p className="text-sm text-muted-foreground">Monthly tuition budget</p>
            <p className="mt-1 text-3xl font-bold">{formatTuitionBudget(tuition.budget)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {tuition.schedule || "Schedule to be discussed"}
            </p>

            <ApplyForTuition tuitionId={tuition.id} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}
