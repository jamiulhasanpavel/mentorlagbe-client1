import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getBackendSession } from "@/lib/backend-auth";
import { Button } from "@/components/ui/button";
import { paidPlans } from "@/features/payments/plans";
import { getUserStripePayment } from "@/lib/payments/stripe";

type SearchParams = Promise<{
  session_id?: string | string[];
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
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    notFound();
  }

  const session = await getBackendSession(await headers());
  if (!session) {
    const callbackUrl = `/payment/success?session_id=${encodeURIComponent(sessionId)}`;
    redirect(`/sign-in?callbackURL=${encodeURIComponent(callbackUrl)}`);
  }

  const payment = await getUserStripePayment(sessionId, await headers());
  if (!payment) {
    notFound();
  }

  if (payment.status === "pending") {
    redirect(`/payment/pending?session_id=${encodeURIComponent(sessionId)}`);
  }
  if (payment.status !== "paid") {
    redirect("/payment/cancel");
  }

  const plan = paidPlans.find((item) => item.id === payment.planId);
  const paidDate = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(payment.updatedAt));

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
          Stripe verified your subscription for {plan?.name ?? "your plan"}.
        </p>

        <dl className="mt-7 space-y-3 rounded-xl border bg-muted/20 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-semibold">
              {new Intl.NumberFormat(payment.currency.toUpperCase() === "BDT" ? "en-BD" : "en-US", {
                style: "currency",
                currency: payment.currency.toUpperCase(),
                ...(payment.currency.toUpperCase() === "BDT"
                  ? { currencyDisplay: "narrowSymbol" as const, maximumFractionDigits: 0 }
                  : {}),
              }).format(payment.amount / 100)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Checkout ID</dt>
            <dd className="break-all text-right font-mono text-xs">{payment.stripeSessionId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Paid on</dt>
            <dd className="text-right">{paidDate}</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm text-muted-foreground">
          Your plan is active and renews monthly through Stripe.
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
