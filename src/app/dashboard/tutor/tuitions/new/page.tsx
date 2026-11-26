import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TuitionPostForm } from "@/components/dashboard/tuition-post-form";
import { getDashboardData, getTutorTuitions } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";

export default async function NewTutorTuitionPage() {
  const [dashboard, tuitions] = await Promise.all([
    getDashboardData(),
    getTutorTuitions(),
  ]);
  if (dashboard.role !== "tutor") return null;

  const isPro =
    dashboard.plan === "tutor-pro" && dashboard.planStatus === "active";
  const reachedFreeLimit = !isPro && tuitions.length >= 2;

  return (
    <div>
      <Link
        href="/dashboard/tutor/tuitions"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        My tuitions
      </Link>
      <div className="mt-6 mb-7">
        <p className="text-sm font-semibold text-primary">Tutor workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Post a tuition</h1>
        <p className="mt-2 text-muted-foreground">
          Share the learning opportunity. It will be published after admin review.
        </p>
      </div>
      {reachedFreeLimit ? (
        <section className="rounded-2xl border bg-background p-6">
          <h2 className="text-lg font-bold">Free plan post limit reached</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Free tutors can keep up to 2 tuition posts. Upgrade to Tutor Pro to
            create unlimited posts.
          </p>
          <Link href="/pricing" className="mt-5 inline-block">
            <Button>Upgrade to Tutor Pro</Button>
          </Link>
        </section>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {isPro
              ? "Tutor Pro includes unlimited tuition posts."
              : `${Math.max(0, 2 - tuitions.length)} free post${2 - tuitions.length === 1 ? "" : "s"} remaining.`}
          </p>
          <TuitionPostForm />
        </>
      )}
    </div>
  );
}
