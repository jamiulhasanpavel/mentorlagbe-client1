import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, Check, CreditCard, ShieldCheck } from "lucide-react";
import { getBackendSession } from "@/lib/backend-auth";
import { StripeCheckoutButton } from "@/components/payments/stripe-checkout-button";
import { getPaidPlan } from "@/features/payments/plans";

type SearchParams = Promise<{
  plan?: string | string[];
}>;

export default function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CheckoutContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const planId = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const plan = getPaidPlan(planId);

  if (!plan) {
    notFound();
  }

  const session = await getBackendSession(await headers());
  if (!session) {
    const checkoutPath = `/payment/checkout?plan=${plan.id}`;
    redirect(`/sign-in?callbackURL=${encodeURIComponent(checkoutPath)}`);
  }

  const requiredRole = plan.id === "student-plus" ? "student" : "tutor";
  if (session.user.role !== requiredRole) {
    return (
      <main className="flex min-h-full items-center justify-center bg-muted/20 px-4 py-14">
        <section className="w-full max-w-lg rounded-2xl border bg-background p-7 text-center">
          <h1 className="text-2xl font-bold">This plan is for {requiredRole} accounts</h1>
          <p className="mt-3 text-muted-foreground">
            Your signed-in account does not match the selected plan.
          </p>
          <Link href="/pricing" className="mt-6 inline-block">
            <span className="text-sm font-semibold text-primary hover:underline">
              Return to pricing
            </span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-muted/20 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to pricing
        </Link>

        <div className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Secure payment
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Complete your purchase
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review the plan and enter your billing details to continue.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border bg-background p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </span>
              <div>
                <h2 className="font-bold">Stripe subscription checkout</h2>
                <p className="text-sm text-muted-foreground">
                  Upgrade your account with a secure monthly subscription.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Payment details stay with the gateway</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Your payment details are entered on Stripe&apos;s secure checkout page, not stored by MentorLagbe.
                  </p>
                </div>
              </div>
            </div>

            <StripeCheckoutButton planId={plan.id} />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your subscription renews monthly until canceled.
            </p>
          </section>

          <aside className="h-fit rounded-2xl border bg-background p-6">
            <h2 className="text-lg font-bold">Order summary</h2>
            <div className="mt-5 flex items-start justify-between gap-4 border-b pb-5">
              <div>
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">Monthly subscription</p>
              </div>
              <p className="text-lg font-bold">{plan.price}</p>
            </div>
            <ul className="space-y-3 py-5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-5 font-semibold">
              <span>Total due today</span>
              <span>{plan.price}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Subscription renewal is handled by Stripe.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CheckoutLoading() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-14 sm:px-6">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/40" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/40" />
      </div>
    </main>
  );
}
