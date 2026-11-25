import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Clock3 } from "lucide-react";
import { getBackendSession } from "@/lib/backend-auth";
import { Button } from "@/components/ui/button";
import { getUserStripePayment } from "@/lib/payments/stripe";

type SearchParams = Promise<{
  session_id?: string | string[];
}>;

export default function PaymentPendingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<PendingLoading />}>
      <PaymentPendingContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PaymentPendingContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    notFound();
  }

  const session = await getBackendSession(await headers());
  if (!session) {
    const callbackUrl = `/payment/pending?session_id=${encodeURIComponent(sessionId)}`;
    redirect(`/sign-in?callbackURL=${encodeURIComponent(callbackUrl)}`);
  }

  const payment = await getUserStripePayment(sessionId, await headers());
  if (!payment) {
    notFound();
  }
  if (payment.status === "paid") {
    redirect(`/payment/success?session_id=${encodeURIComponent(sessionId)}`);
  }
  if (payment.status === "expired") {
    redirect("/payment/cancel");
  }

  return (
    <main className="flex min-h-full items-center justify-center bg-muted/20 px-4 py-14 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border bg-background p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-700">
          <Clock3 className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
          Payment pending
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">We are checking your payment</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Stripe has not confirmed the subscription yet. Wait briefly and check again to avoid
          starting a duplicate checkout.
        </p>
        <p className="mt-5 break-all font-mono text-xs text-muted-foreground">
          Checkout ID: {payment.stripeSessionId}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`/payment/pending?session_id=${encodeURIComponent(sessionId)}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-sm font-medium hover:bg-muted"
          >
            Check status again
          </a>
          <Link href="/dashboard">
            <Button variant="outline">Return to dashboard</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

function PendingLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-14">
      <div className="h-72 w-full max-w-xl animate-pulse rounded-2xl border bg-muted/40" />
    </main>
  );
}
