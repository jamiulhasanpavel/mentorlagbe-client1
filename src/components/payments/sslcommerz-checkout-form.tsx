"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function SslCommerzCheckoutForm({
  planId,
  enabled,
}: {
  planId: string;
  enabled: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/payments/sslcommerz/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, phone, address, city, postcode }),
      });
      const result: unknown = await response.json();

      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("url" in result) ||
        typeof result.url !== "string"
      ) {
        const message =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to start checkout. Please try again.";
        setErrorMessage(message);
        return;
      }

      window.location.assign(result.url);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start checkout. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {!enabled && (
        <p
          role="alert"
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900"
        >
          Payment gateway credentials are not configured. Contact support to enable checkout.
        </p>
      )}
      <label className="grid gap-2 text-sm font-medium">
        Bangladesh mobile number
        <input
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          disabled={!enabled || isSubmitting}
          value={phone}
          onChange={(event) => setPhone(event.currentTarget.value)}
          placeholder="01XXXXXXXXX"
          className="h-11 rounded-lg border bg-background px-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Billing address
        <input
          type="text"
          autoComplete="street-address"
          required
          maxLength={50}
          disabled={!enabled || isSubmitting}
          value={address}
          onChange={(event) => setAddress(event.currentTarget.value)}
          placeholder="House, road, area"
          className="h-11 rounded-lg border bg-background px-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          City
          <input
            type="text"
            autoComplete="address-level2"
            required
            maxLength={50}
            disabled={!enabled || isSubmitting}
            value={city}
            onChange={(event) => setCity(event.currentTarget.value)}
            className="h-11 rounded-lg border bg-background px-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Postal code
          <input
            type="text"
            autoComplete="postal-code"
            maxLength={30}
            disabled={!enabled || isSubmitting}
            value={postcode}
            onChange={(event) => setPostcode(event.currentTarget.value)}
            className="h-11 rounded-lg border bg-background px-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
          />
        </label>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={!enabled || isSubmitting}>
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}
        {isSubmitting ? "Connecting to payment gateway..." : "Continue to SSLCOMMERZ"}
      </Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        Card and mobile banking details are entered on the SSLCOMMERZ hosted payment page.
      </p>
    </form>
  );
}
