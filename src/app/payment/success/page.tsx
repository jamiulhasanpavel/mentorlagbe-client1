import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { paidPlans } from "@/features/payments/plans";
import { getUserPaymentTransaction } from "@/lib/payments/sslcommerz";

type SearchParams = Promise<{
  tran_id?: string | string[];
}>;

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<PaymentResultLoading />}>
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PaymentSuccessContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const tranId = Array.isArray(params.tran_id) ? params.tran_id[0] : params.tran_id;
  if (!tranId || !/^[a-f0-9]{24}$/.test(tranId)) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const callbackUrl = `/payment/success?tran_id=${encodeURIComponent(tranId)}`;
    redirect(`/sign-in?callbackURL=${encodeURIComponent(callbackUrl)}`);
  }

  const payment = await getUserPaymentTransaction(tranId, session.user.id);
  if (!payment) {
    notFound();
  }

  if (payment.status === "pending") {
    redirect(`/payment/pending?tran_id=${encodeURIComponent(tranId)}`);
  }
  if (payment.status !== "paid") {
    redirect(`/payment/cancel?tran_id=${encodeURIComponent(tranId)}`);
  }

  const plan = paidPlans.find((item) => item.id === payment.planId);
  const paidDate = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(payment.paidAt ?? payment.updatedAt);

  return (
    <main className="flex min-h-full items-center justify-center bg-muted/20 px-4 py-14 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border bg-background p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
          <CheckCircle2 className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
          Payment confirmed
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Thank you for your payment</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          SSLCOMMERZ verified your payment for {plan?.name ?? "your plan"}.
        </p>

        <dl className="mt-7 space-y-3 rounded-xl border bg-muted/20 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-semibold">৳{payment.amount.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Transaction ID</dt>
            <dd className="break-all text-right font-mono text-xs">{payment.tranId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Paid on</dt>
            <dd className="text-right">{paidDate}</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm text-muted-foreground">
          This is a one-month purchase. Renew manually when you are ready; no automatic renewal is set up.
        </p>
        <Link href="/dashboard" className="mt-7 inline-block">
          <Button>Return to dashboard</Button>
        </Link>
      </section>
    </main>
  );
}

function PaymentResultLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-14">
      <div className="h-72 w-full max-w-xl animate-pulse rounded-2xl border bg-muted/40" />
    </main>
  );
}
