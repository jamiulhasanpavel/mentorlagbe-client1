import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, FileText, Search, WalletCards } from "lucide-react";
import { ApplicationList } from "@/components/dashboard/application-list";
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";
import { StripeBillingPortalButton } from "@/components/payments/stripe-billing-portal-button";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function StudentDashboardPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "student") {
    redirect(dashboard.role === "admin" ? "/dashboard/admin" : "/dashboard/tutor");
  }

  const applicationStats = [
    { label: "Total Applied Tuitions", value: dashboard.stats.totalApplications, icon: FileText },
    { label: "Accepted Applications", value: dashboard.stats.acceptedApplications, icon: CheckCircle2 },
    { label: "Pending Applications", value: dashboard.stats.pendingApplications, icon: Clock3 },
    {
      label: "Current Plan",
      value:
        dashboard.plan === "student-plus" && dashboard.planStatus === "active"
          ? "Student Pro"
          : "Free",
      icon: WalletCards,
    },
  ];

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

      <DashboardStatCards
        stats={applicationStats}
        label="Application statistics"
        className="sm:grid-cols-2 xl:grid-cols-4"
      />

      <section className="mt-8 rounded-2xl border">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Recent applications</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep up with the status of your tuition applications.
            </p>
          </div>
          <Link
            href="/dashboard/student/my-applications"
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
