import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminUserList } from "@/components/dashboard/admin-user-list";
import { getBackendSession } from "@/lib/backend-auth";
import { getAdminUsers, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminUsersPage({
  searchParams,
}: PageProps<"/dashboard/admin/users">) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(
    typeof params.page === "string" ? params.page : "1",
    10,
  );
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const dashboard = await getDashboardData();
  if (dashboard.role !== "admin") {
    redirect(dashboard.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
  }
  const users = await getAdminUsers(page);
  const session = await getBackendSession(await headers());
  if (!session) redirect("/sign-in?callbackURL=%2Fdashboard%2Fadmin%2Fusers");

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Platform administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">User management</h1>
      <p className="mt-2 text-muted-foreground">
        Set account roles. You cannot change your own role or demote the last administrator.
      </p>
      <section className="mt-8 rounded-2xl border p-5 sm:p-6">
        <AdminUserList
          key={users.page}
          users={users.data}
          total={users.total}
          currentUserId={session.user.id}
          page={users.page}
          totalPages={users.totalPages}
        />
      </section>
    </div>
  );
}
