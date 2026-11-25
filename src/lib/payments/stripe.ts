import { getBackendApiUrl } from "@/lib/backend-url";

export type StripePayment = {
  id: string;
  stripeSessionId: string;
  planId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "expired";
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStripePayment(value: unknown): value is StripePayment {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.stripeSessionId === "string" &&
    typeof value.planId === "string" &&
    typeof value.amount === "number" &&
    typeof value.currency === "string" &&
    ["pending", "paid", "expired"].includes(String(value.status)) &&
    typeof value.updatedAt === "string"
  );
}

export async function getUserStripePayment(
  sessionId: string,
  requestHeaders: Headers,
): Promise<StripePayment | null> {
  const apiBaseUrl = getBackendApiUrl();
  const cookie = requestHeaders.get("cookie");
  const response = await fetch(
    `${apiBaseUrl}/api/payments/session/${encodeURIComponent(sessionId)}`,
    {
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    },
  );

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Payment service returned an unreadable response (${response.status}).`);
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : `Payment service returned ${response.status}.`;
    throw new Error(message);
  }
  if (!isRecord(body) || body.success !== true || !isStripePayment(body.data)) {
    throw new Error("Payment service returned an invalid payment record.");
  }
  return body.data;
}
