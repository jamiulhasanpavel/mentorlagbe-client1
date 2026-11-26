import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CircleDollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";
import { getAdminTuitions, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "admin") {
    redirect(dashboard.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
  }
  const pending = await getAdminTuitions("pending");

  const stats = [
    { label: "Total Users", value: dashboard.stats.users, icon: Users },
    { label: "Total Tutors", value: dashboard.stats.tutors, icon: GraduationCap },
    { label: "Pending Tuitions", value: dashboard.stats.pendingTuitions, icon: ClipboardCheck },
    { label: "Approved Tuitions", value: dashboard.stats.approvedTuitions, icon: CheckCircle2 },
    {
      label: "Total Stripe Revenue",
      value: new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
      }).format(dashboard.stats.revenue / 100),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-primary">Platform administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor platform activity and review new tuition listings.
        </p>
      </div>

      <DashboardStatCards
        stats={stats}
        label="Platform statistics"
        className="sm:grid-cols-2 xl:grid-cols-3"
      />

      <section className="mt-8 rounded-2xl border bg-background">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Moderation queue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {pending.total} tuition post{pending.total === 1 ? "" : "s"} awaiting review.
            </p>
          </div>
          <Link href="/dashboard/admin/tuitions">
            <Button variant="outline">
              Review listings
              <ArrowRight />
            </Button>
          </Link>
        </div>

        {pending.data.length > 0 ? (
          <ul className="divide-y">
            {pending.data.slice(0, 3).map((tuition) => (
              <li key={tuition.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{tuition.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tuition.subject}
                    {tuition.location ? ` · ${tuition.location}` : ""}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No tuition posts need review.</p>
        )}
      </section>
    </div>
  );
}
