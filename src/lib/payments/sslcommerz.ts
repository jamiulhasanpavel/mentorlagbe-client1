import { mongoClient } from "@/lib/auth";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type PaymentTransaction = {
  tranId: string;
  userId: string;
  planId: string;
  amount: number;
  currency: "BDT";
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  sessionKey?: string;
  validationId?: string;
  paidAt?: Date;
};

const paymentTransactions =
  mongoClient.db("mentorlagbe").collection<PaymentTransaction>("paymentTransactions");

export function getSslCommerzConfig() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  const appBaseUrl = process.env.APP_BASE_URL?.trim();

  if (!storeId || !storePassword || !appBaseUrl) {
    return null;
  }

  try {
    const appUrl = new URL(appBaseUrl);
    if (
      !["http:", "https:"].includes(appUrl.protocol) ||
      (process.env.NODE_ENV === "production" && appUrl.protocol !== "https:")
    ) {
      return null;
    }

    const sandbox = process.env.SSLCOMMERZ_SANDBOX !== "false";
    return {
      appBaseUrl: appUrl.origin,
      storeId,
      storePassword,
      sandbox,
      gatewayBaseUrl: sandbox
        ? "https://sandbox.sslcommerz.com"
        : "https://securepay.sslcommerz.com",
    };
  } catch {
    return null;
  }
}

export function normalizeBangladeshPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const localNumber = digits.startsWith("880") ? `0${digits.slice(3)}` : digits;
  return /^01[3-9]\d{8}$/.test(localNumber) ? localNumber : null;
}

export async function getPaymentTransaction(tranId: string) {
  return paymentTransactions.findOne({ tranId });
}

export async function getUserPaymentTransaction(tranId: string, userId: string) {
  return paymentTransactions.findOne({ tranId, userId });
}

export async function refreshPaymentStatus(transaction: PaymentTransaction) {
  const config = getSslCommerzConfig();
  if (!config) {
    throw new Error("SSLCOMMERZ is not configured.");
  }

  if (!transaction.sessionKey) {
    throw new Error("The payment gateway session is not available.");
  }

  const validationUrl = new URL(
    "/validator/api/merchantTransIDvalidationAPI.php",
    config.gatewayBaseUrl,
  );
  validationUrl.searchParams.set("sessionkey", transaction.sessionKey);
  validationUrl.searchParams.set("store_id", config.storeId);
  validationUrl.searchParams.set("store_passwd", config.storePassword);
  validationUrl.searchParams.set("format", "json");

  const response = await fetch(validationUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`SSLCOMMERZ validation request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload)) {
    throw new Error("SSLCOMMERZ returned an invalid validation response.");
  }

  if (
    payload.APIConnect !== "DONE" ||
    payload.tran_id !== transaction.tranId ||
    payload.sessionkey !== transaction.sessionKey ||
    Number(payload.amount) !== transaction.amount ||
    payload.currency_type !== transaction.currency ||
    (payload.currency !== undefined && payload.currency !== transaction.currency) ||
    payload.value_a !== transaction.userId ||
    payload.value_b !== transaction.planId
  ) {
    throw new Error("SSLCOMMERZ validation data did not match the stored transaction.");
  }

  const nextStatus = getPaymentStatus(payload.status);
  if (!nextStatus) {
    throw new Error("SSLCOMMERZ returned an unrecognized transaction status.");
  }

  const updatedAt = new Date();
  const update: Partial<PaymentTransaction> = {
    status: transaction.status === "paid" ? "paid" : nextStatus,
    updatedAt,
  };

  if (nextStatus === "paid") {
    update.paidAt = transaction.paidAt ?? updatedAt;
    if (typeof payload.val_id === "string") {
      update.validationId = payload.val_id;
    }
  }

  await paymentTransactions.updateOne({ tranId: transaction.tranId }, { $set: update });
  return { ...transaction, ...update };
}

export async function setPaymentSession(
  tranId: string,
  sessionKey: string,
) {
  await paymentTransactions.updateOne(
    { tranId },
    { $set: { sessionKey, updatedAt: new Date() } },
  );
}

export async function createPaymentTransaction(
  transaction: PaymentTransaction,
) {
  await paymentTransactions.createIndex({ tranId: 1 }, { unique: true });
  await paymentTransactions.insertOne(transaction);
}

export async function failPaymentTransaction(tranId: string) {
  await paymentTransactions.updateOne(
    { tranId, status: "pending" },
    { $set: { status: "failed", updatedAt: new Date() } },
  );
}

function getPaymentStatus(value: unknown): PaymentStatus | null {
  if (value === "VALID" || value === "VALIDATED") {
    return "paid";
  }
  if (value === "FAILED" || value === "EXPIRED") {
    return "failed";
  }
  if (value === "CANCELLED" || value === "UNATTEMPTED") {
    return "cancelled";
  }
  if (value === "PENDING") {
    return "pending";
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
