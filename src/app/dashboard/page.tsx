import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardOverviewLoading />}>
      <DashboardOverview />
    </Suspense>
  );
}

async function DashboardOverview() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?callbackURL=%2Fdashboard");
  }

  const isTutor = session.user.role === "tutor";
  const workspaceHref = isTutor ? "/dashboard/tutor" : "/dashboard/student";
  const workspaceTitle = isTutor ? "Tutor dashboard" : "Student dashboard";
  const workspaceDescription = isTutor
    ? "Manage your tuition assignments and teaching activity."
    : "Review your applications and track their progress.";
  const WorkspaceIcon = isTutor ? BriefcaseBusiness : FileText;

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-primary">Your workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {session.user.name}. Choose a workspace to continue.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link
          href={workspaceHref}
          className="group rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <WorkspaceIcon className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">{workspaceTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{workspaceDescription}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Open dashboard
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/tuitions"
          className="group rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">Browse tuitions</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Explore opportunities by subject, class, and location.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Explore listings
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <div className="rounded-2xl border bg-background p-6 md:col-span-2">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">Your account is protected</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Dashboard pages are available only while you are signed in.
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardOverviewLoading() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="h-56 animate-pulse rounded-2xl border bg-muted/40" />
        <div className="h-56 animate-pulse rounded-2xl border bg-muted/40" />
      </div>
    </div>
  );
}
