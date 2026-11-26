import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { ModerationQueue } from "@/components/dashboard/moderation-queue";
import { getAdminTuitions, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminModerationPage({
  searchParams,
}: PageProps<"/dashboard/admin/moderation">) {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "admin") {
    redirect(dashboard.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
  }
  const params = await searchParams;
  const status =
    params.status === "approved" || params.status === "rejected"
      ? params.status
      : "pending";
  const pageNumber = Number.parseInt(
    typeof params.page === "string" ? params.page : "1",
    10,
  );
  const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const listings = await getAdminTuitions(status, page);
  const tabs = [
    { status: "pending", label: "Pending", icon: Clock3 },
    { status: "approved", label: "Approved", icon: CheckCircle2 },
    { status: "rejected", label: "Rejected", icon: XCircle },
  ] as const;

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
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Tuition approval</h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage all tutor-submitted listings by approval status.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold">Tuition approval flow</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve suitable listings or reject posts that do not meet marketplace requirements.
          </p>
        </div>
        <nav aria-label="Tuition approval status" className="mb-5 flex flex-wrap gap-2">
          {tabs.map(({ status: tabStatus, label, icon: Icon }) => (
            <Link
              key={tabStatus}
              href={`/dashboard/admin/tuitions?status=${tabStatus}`}
              aria-current={status === tabStatus ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                status === tabStatus
                  ? "border-primary bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <ModerationQueue
          key={`${status}-${listings.page}`}
          tuitions={listings.data}
          total={listings.total}
          status={status}
          page={listings.page}
          totalPages={listings.totalPages}
        />
      </section>
    </div>
  );
}
