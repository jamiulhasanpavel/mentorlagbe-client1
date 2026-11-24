import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  createPaymentTransaction,
  failPaymentTransaction,
  getSslCommerzConfig,
  normalizeBangladeshPhone,
  setPaymentSession,
} from "@/lib/payments/sslcommerz";
import { getPaidPlan } from "@/features/payments/plans";

type CheckoutRequest = {
  planId?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  postcode?: unknown;
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Sign in before starting checkout." }, { status: 401 });
  }

  const config = getSslCommerzConfig();
  if (!config) {
    return Response.json(
      { error: "Payment is not configured. Please contact support." },
      { status: 503 },
    );
  }

  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== config.appBaseUrl) {
    return Response.json({ error: "Invalid checkout request origin." }, { status: 403 });
  }

  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return Response.json({ error: "The checkout request is invalid." }, { status: 400 });
  }

  const plan = typeof body.planId === "string" ? getPaidPlan(body.planId) : undefined;
  if (!plan) {
    return Response.json({ error: "Choose a valid paid plan." }, { status: 400 });
  }

  const requiredRole = plan.id === "student-plus" ? "student" : "tutor";
  if (session.user.role !== requiredRole) {
    return Response.json(
      { error: `The ${plan.name} plan is available to ${requiredRole} accounts only.` },
      { status: 403 },
    );
  }

  const phone =
    typeof body.phone === "string" ? normalizeBangladeshPhone(body.phone) : null;
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const postcode = typeof body.postcode === "string" ? body.postcode.trim() : "";

  if (!phone || address.length < 3 || address.length > 50 || city.length < 2 || city.length > 50) {
    return Response.json(
      { error: "Enter a valid Bangladesh mobile number, billing address, and city." },
      { status: 400 },
    );
  }

  if (postcode.length > 30) {
    return Response.json({ error: "Postal code must be 30 characters or fewer." }, { status: 400 });
  }

  const tranId = randomBytes(12).toString("hex");
  const createdAt = new Date();
  await createPaymentTransaction({
    tranId,
    userId: session.user.id,
    planId: plan.id,
    amount: plan.amount,
    currency: "BDT",
    status: "pending",
    createdAt,
    updatedAt: createdAt,
  });

  const callbackUrl = `${config.appBaseUrl}/api/payments/sslcommerz/return`;
  const ipnUrl = `${config.appBaseUrl}/api/payments/sslcommerz/ipn`;
  const gatewayRequest = new URLSearchParams({
    store_id: config.storeId,
    store_passwd: config.storePassword,
    total_amount: plan.amount.toFixed(2),
    currency: "BDT",
    tran_id: tranId,
    success_url: `${callbackUrl}?outcome=success`,
    fail_url: `${callbackUrl}?outcome=fail`,
    cancel_url: `${callbackUrl}?outcome=cancel`,
    ipn_url: ipnUrl,
    cus_name: session.user.name.slice(0, 50),
    cus_email: session.user.email.slice(0, 50),
    cus_add1: address,
    cus_city: city,
    cus_postcode: postcode,
    cus_country: "Bangladesh",
    cus_phone: phone,
    shipping_method: "NO",
    product_name: `MentorLagbe ${plan.name}`,
    product_category: "Education",
    product_profile: "non-physical-goods",
    value_a: session.user.id,
    value_b: plan.id,
  });

  let gatewayResponse: Response;
  try {
    gatewayResponse = await fetch(
      `${config.gatewayBaseUrl}/gwprocess/v4/api.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: gatewayRequest,
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );
  } catch (error) {
    await failPaymentTransaction(tranId);
    console.error("SSLCOMMERZ session request failed.", error);
    return Response.json(
      { error: "Could not connect to the payment gateway. Please try again." },
      { status: 502 },
    );
  }

  if (!gatewayResponse.ok) {
    await failPaymentTransaction(tranId);
    console.error("SSLCOMMERZ session request returned an unsuccessful response.", gatewayResponse.status);
    return Response.json(
      { error: "The payment gateway could not start checkout. Please try again." },
      { status: 502 },
    );
  }

  let gatewayPayload: unknown;
  try {
    gatewayPayload = await gatewayResponse.json();
  } catch {
    await failPaymentTransaction(tranId);
    return Response.json(
      { error: "The payment gateway returned an invalid response." },
      { status: 502 },
    );
  }

  if (
    !isGatewaySession(gatewayPayload) ||
    gatewayPayload.status !== "SUCCESS" ||
    typeof gatewayPayload.sessionkey !== "string"
  ) {
    await failPaymentTransaction(tranId);
    return Response.json(
      { error: "The payment gateway rejected the checkout request." },
      { status: 502 },
    );
  }

  const gatewayPageUrl = getSafeGatewayUrl(gatewayPayload.GatewayPageURL, config.sandbox);
  if (!gatewayPageUrl) {
    await failPaymentTransaction(tranId);
    console.error("SSLCOMMERZ returned an unexpected checkout URL.");
    return Response.json(
      { error: "The payment gateway returned an invalid checkout link." },
      { status: 502 },
    );
  }

  await setPaymentSession(tranId, gatewayPayload.sessionkey);
  return Response.json({ url: gatewayPageUrl });
}

function isGatewaySession(
  value: unknown,
): value is { status: string; GatewayPageURL: string; sessionkey?: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof value.status === "string" &&
    "GatewayPageURL" in value &&
    typeof value.GatewayPageURL === "string"
  );
}

function getSafeGatewayUrl(value: string, sandbox: boolean) {
  try {
    const url = new URL(value);
    const expectedHost = sandbox ? "sandbox.sslcommerz.com" : "securepay.sslcommerz.com";
    return url.protocol === "https:" && url.hostname === expectedHost ? url.toString() : null;
  } catch {
    return null;
  }
}
