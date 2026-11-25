import type { AdminPayment } from "@/lib/dashboard-data";

function getPlanName(planId: string) {
  if (planId === "student-plus") return "Student Pro";
  if (planId === "tutor-pro") return "Tutor Pro";
  return planId;
}

export function AdminPaymentList({
  payments,
  total,
}: {
  payments: AdminPayment[];
  total: number;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {payments.length} of {total} payment{total === 1 ? "" : "s"}.
      </p>
      {payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => (
            <article key={payment.id} className="grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <h2 className="font-semibold">{getPlanName(payment.planId)}</h2>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  Stripe ID: {payment.stripeInvoiceId || payment.stripeSessionId}
                </p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  User: {payment.userId}
                </p>
                {payment.createdAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Created {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">
                  {payment.status}
                </span>
                <span className="font-semibold">
                  {new Intl.NumberFormat(payment.currency.toUpperCase() === "BDT" ? "en-BD" : "en-US", {
                    style: "currency",
                    currency: payment.currency.toUpperCase(),
                    ...(payment.currency.toUpperCase() === "BDT"
                      ? { currencyDisplay: "narrowSymbol" as const, maximumFractionDigits: 0 }
                      : {}),
                  }).format(payment.amount / 100)}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No payment records are available.
        </div>
      )}
    </div>
  );
}
