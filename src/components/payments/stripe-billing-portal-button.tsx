"use client";

import { useState } from "react";
import { ExternalLink, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function StripeBillingPortalButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function openPortal() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/payments/portal", {
        method: "POST",
        credentials: "include",
      });
      const body: unknown = await response.json();
      if (!response.ok || !isRecord(body) || body.success !== true || typeof body.url !== "string") {
        setErrorMessage(
          isRecord(body) && typeof body.message === "string"
            ? body.message
            : "Unable to open Stripe billing settings.",
        );
        return;
      }

      const portalUrl = new URL(body.url);
      if (portalUrl.protocol !== "https:" || portalUrl.hostname !== "billing.stripe.com") {
        throw new Error("Stripe returned an unexpected billing portal URL.");
      }
      window.location.assign(portalUrl.toString());
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to open Stripe billing settings.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" disabled={isLoading} onClick={openPortal}>
        {isLoading ? <LoaderCircle className="animate-spin" /> : <ExternalLink />}
        {isLoading ? "Opening billing..." : "Manage subscription"}
      </Button>
      {errorMessage && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
