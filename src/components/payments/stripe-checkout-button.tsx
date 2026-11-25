"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function StripeCheckoutButton({ planId }: { planId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function startCheckout() {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const body: unknown = await response.json();

      if (!response.ok || !isRecord(body) || body.success !== true || typeof body.url !== "string") {
        setErrorMessage(
          isRecord(body) && typeof body.message === "string"
            ? body.message
            : "Unable to start secure checkout. Please try again.",
        );
        return;
      }

      const checkoutUrl = new URL(body.url);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
        throw new Error("Stripe returned an unexpected checkout URL.");
      }
      window.location.assign(checkoutUrl.toString());
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start secure checkout.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      {errorMessage && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
        onClick={startCheckout}
      >
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}
        {isSubmitting ? "Connecting to Stripe..." : "Continue to Stripe checkout"}
      </Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        Enter payment details on Stripe&apos;s secure checkout page. Subscriptions renew monthly.
      </p>
    </div>
  );
}
