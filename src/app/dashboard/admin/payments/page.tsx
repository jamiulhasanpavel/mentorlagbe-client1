import { redirect } from "next/navigation";
import { AdminPaymentList } from "@/components/dashboard/admin-payment-list";
import { getAdminPayments, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminPaymentsPage({
  searchParams,
}: PageProps<"/dashboard/admin/payments">) {
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
  const payments = await getAdminPayments(page);

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Platform administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Transaction management</h1>
      <p className="mt-2 text-muted-foreground">
        Review Stripe transactions with account details, plan, amount, and payment date.
      </p>
      <section className="mt-8 rounded-2xl border p-5 sm:p-6">
        <AdminPaymentList
          payments={payments.data}
          total={payments.total}
          page={payments.page}
          totalPages={payments.totalPages}
        />
      </section>
    </div>
  );
}
