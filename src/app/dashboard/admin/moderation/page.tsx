import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ModerationQueue } from "@/components/dashboard/moderation-queue";
import { getAdminTuitions, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminModerationPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "admin") {
    redirect(dashboard.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
  }
  const pending = await getAdminTuitions("pending");

  return (
    <div>
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Admin dashboard
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-primary">Platform administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Content moderation</h1>
        <p className="mt-2 text-muted-foreground">
          Review tuition listings before publishing them on the marketplace.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold">Tuition review queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve suitable listings or reject posts that do not meet marketplace requirements.
          </p>
        </div>
        <ModerationQueue tuitions={pending.data} total={pending.total} />
      </section>
    </div>
  );
}
