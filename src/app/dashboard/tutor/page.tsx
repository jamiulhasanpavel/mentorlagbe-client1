import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Clock3, FileText, Users } from "lucide-react";
import { ApplicationList } from "@/components/dashboard/application-list";
import { StripeBillingPortalButton } from "@/components/payments/stripe-billing-portal-button";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function TutorDashboardPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "tutor") {
    redirect(dashboard.role === "admin" ? "/dashboard/admin" : "/dashboard/student");
  }

  const tutorStats = [
    { label: "My tuition posts", value: dashboard.stats.totalTuitions, icon: BriefcaseBusiness },
    { label: "Active tuitions", value: dashboard.stats.activeTuitions, icon: FileText },
    { label: "Awaiting moderation", value: dashboard.stats.pendingTuitions, icon: Clock3 },
    { label: "Applicants", value: dashboard.stats.totalApplicants, icon: Users },
  ];
  const planLabel =
    dashboard.plan === "tutor-pro"
      ? "Tutor Pro"
      : dashboard.plan === "student-plus"
        ? "Student Pro"
        : "Free";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Tutor workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Your teaching dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage tuition posts and respond to students who apply.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border bg-background px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Current plan</p>
            <p className="mt-0.5 text-sm font-semibold">{planLabel}</p>
          </div>
          {dashboard.planStatus === "active" || dashboard.planStatus === "past_due" ? (
            <StripeBillingPortalButton />
          ) : (
            <Link href="/pricing">
              <Button variant="outline">Upgrade plan</Button>
            </Link>
          )}
          <Link href="/dashboard/tutor/tuitions/new">
            <Button>
              <BriefcaseBusiness />
              Post a tuition
            </Button>
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Tutor statistics">
        {tutorStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-5 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Recent applicants</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review applications to your tuition posts.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/tutor/applicants"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              All applicants
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/tutor/tuitions"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Manage tuitions
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="p-5">
          <ApplicationList applications={dashboard.recentApplications} canManage />
        </div>
      </section>
    </div>
  );
}
