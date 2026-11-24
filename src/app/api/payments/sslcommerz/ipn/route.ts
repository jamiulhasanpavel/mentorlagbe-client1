import {
  getPaymentTransaction,
  refreshPaymentStatus,
} from "@/lib/payments/sslcommerz";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response("Invalid notification.", { status: 400 });
  }

  const tranId = formData.get("tran_id");
  if (typeof tranId !== "string" || !/^[a-f0-9]{24}$/.test(tranId)) {
    return new Response("Invalid transaction.", { status: 400 });
  }

  const transaction = await getPaymentTransaction(tranId);
  if (!transaction) {
    return new Response("Transaction not found.", { status: 404 });
  }

  try {
    await refreshPaymentStatus(transaction);
    return new Response("OK");
  } catch {
    console.error("Unable to verify an SSLCOMMERZ IPN.");
    return new Response("Transaction verification unavailable.", { status: 503 });
  }
}
