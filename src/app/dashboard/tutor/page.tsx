import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Clock3, FileText, Users } from "lucide-react";
import { ApplicationList } from "@/components/dashboard/application-list";
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";
import { StripeBillingPortalButton } from "@/components/payments/stripe-billing-portal-button";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function TutorDashboardPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "tutor") {
    redirect(dashboard.role === "admin" ? "/dashboard/admin" : "/dashboard/student");
  }

  const tutorStats = [
    { label: "Total Tuitions Posted", value: dashboard.stats.totalTuitions, icon: BriefcaseBusiness },
    { label: "Active/Approved Tuitions", value: dashboard.stats.activeTuitions, icon: FileText },
    { label: "Total Applicants Received", value: dashboard.stats.totalApplicants, icon: Users },
    {
      label: "Current Plan",
      value:
        dashboard.plan === "tutor-pro" && dashboard.planStatus === "active"
          ? "Tutor Pro"
          : "Free",
      icon: Clock3,
    },
  ];
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
          {dashboard.planStatus === "active" || dashboard.planStatus === "past_due" ? (
            <StripeBillingPortalButton />
          ) : (
            <Link href="/pricing">
              <Button variant="outline">Upgrade plan</Button>
            </Link>
          )}
          <Link href="/dashboard/tutor/post-tuition">
            <Button>
              <BriefcaseBusiness />
              Post a tuition
            </Button>
          </Link>
        </div>
      </div>

      <DashboardStatCards
        stats={tutorStats}
        label="Tutor statistics"
        className="sm:grid-cols-2 xl:grid-cols-4"
      />

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
              href="/dashboard/tutor/my-tuitions"
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
