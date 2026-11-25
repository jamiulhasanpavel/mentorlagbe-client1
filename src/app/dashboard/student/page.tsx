import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, FileText, Search } from "lucide-react";
import { ApplicationList } from "@/components/dashboard/application-list";
import { StripeBillingPortalButton } from "@/components/payments/stripe-billing-portal-button";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function StudentDashboardPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "student") {
    redirect(dashboard.role === "admin" ? "/dashboard/admin" : "/dashboard/tutor");
  }

  const applicationStats = [
    { label: "Total applications", value: dashboard.stats.totalApplications, icon: FileText },
    { label: "Under review", value: dashboard.stats.pendingApplications, icon: Clock3 },
    { label: "Accepted", value: dashboard.stats.acceptedApplications, icon: CheckCircle2 },
  ];
  const planLabel =
    dashboard.plan === "student-plus"
      ? "Student Pro"
      : dashboard.plan === "tutor-pro"
        ? "Tutor Pro"
        : "Free";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Student workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Your learning dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Track your tuition applications and discover new opportunities.
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
          <Link href="/tuitions">
            <Button>
              <Search />
              Find a tuition
            </Button>
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Application statistics">
        {applicationStats.map(({ label, value, icon: Icon }) => (
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
            <h2 className="text-lg font-bold">Recent applications</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep up with the status of your tuition applications.
            </p>
          </div>
          <Link
            href="/dashboard/student/applications"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all applications
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="p-5">
          <ApplicationList applications={dashboard.recentApplications} />
          {dashboard.recentApplications.length === 0 && (
            <Link href="/tuitions" className="mt-5 inline-block">
              <Button variant="outline">Browse available tuitions</Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
