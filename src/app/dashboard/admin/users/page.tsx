import { redirect } from "next/navigation";
import { AdminUserList } from "@/components/dashboard/admin-user-list";
import { getAdminUsers, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminUsersPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "admin") {
    redirect(dashboard.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
  }
  const users = await getAdminUsers();

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Platform administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">User management</h1>
      <p className="mt-2 text-muted-foreground">
        Review platform accounts and set student or tutor roles. Administrator roles are protected.
      </p>
      <section className="mt-8 rounded-2xl border p-5 sm:p-6">
        <AdminUserList users={users.data} total={users.total} />
      </section>
    </div>
  );
}
