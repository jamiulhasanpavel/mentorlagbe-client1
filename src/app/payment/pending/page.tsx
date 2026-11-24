import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Clock3 } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getUserPaymentTransaction } from "@/lib/payments/sslcommerz";

type SearchParams = Promise<{
  tran_id?: string | string[];
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
  const tranId = Array.isArray(params.tran_id) ? params.tran_id[0] : params.tran_id;
  if (!tranId || !/^[a-f0-9]{24}$/.test(tranId)) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const callbackUrl = `/payment/pending?tran_id=${encodeURIComponent(tranId)}`;
    redirect(`/sign-in?callbackURL=${encodeURIComponent(callbackUrl)}`);
  }

  const payment = await getUserPaymentTransaction(tranId, session.user.id);
  if (!payment) {
    notFound();
  }
  if (payment.status === "paid") {
    redirect(`/payment/success?tran_id=${encodeURIComponent(tranId)}`);
  }
  if (payment.status !== "pending") {
    redirect(`/payment/cancel?tran_id=${encodeURIComponent(tranId)}`);
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
          SSLCOMMERZ has not confirmed this payment yet. Please wait a moment before trying again
          to avoid duplicate payments.
        </p>
        <p className="mt-5 break-all font-mono text-xs text-muted-foreground">
          Transaction ID: {payment.tranId}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`/payment/pending?tran_id=${encodeURIComponent(tranId)}`}
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
