import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/features/payments/plans";

export default function PricingPage() {
  return (
    <main>
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Simple pricing</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose a plan that fits your goals
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Start for free and upgrade only when you need more visibility and applications.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm ${
                plan.recommended ? "border-primary shadow-lg md:-translate-y-3" : ""
              }`}
            >
              {plan.recommended && (
                <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Recommended
                </span>
              )}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-6 text-4xl font-bold">
                {plan.price}
                {plan.amount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                )}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.amount > 0 ? `/payment/checkout?plan=${plan.id}` : "/sign-up"}
                className="mt-8"
              >
                <Button variant={plan.recommended ? "default" : "outline"} className="w-full">
                  {plan.amount > 0 ? "Continue to checkout" : "Get started"}
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 px-6 py-8 text-center">
            <ShieldCheck className="size-8 text-primary" />
            <div>
              <h2 className="font-bold">Secure and transparent</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                No hidden charges. Cancel or change your plan whenever you need.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
