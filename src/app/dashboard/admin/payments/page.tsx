import { redirect } from "next/navigation";
import { AdminPaymentList } from "@/components/dashboard/admin-payment-list";
import { getAdminPayments, getDashboardData } from "@/lib/dashboard-data";

export default async function AdminPaymentsPage() {
  const dashboard = await getDashboardData();
  if (dashboard.role !== "admin") {
    redirect(dashboard.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
  }
  const payments = await getAdminPayments();

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Platform administration</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Payment history</h1>
      <p className="mt-2 text-muted-foreground">
        Review subscription checkout and payment status from Stripe.
      </p>
      <section className="mt-8 rounded-2xl border p-5 sm:p-6">
        <AdminPaymentList payments={payments.data} total={payments.total} />
      </section>
    </div>
  );
}
