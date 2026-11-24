import {
  getPaymentTransaction,
  getSslCommerzConfig,
  refreshPaymentStatus,
} from "@/lib/payments/sslcommerz";

export async function GET(request: Request) {
  const tranId = new URL(request.url).searchParams.get("tran_id");
  return handleReturn(request, tranId);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return redirectTo(request, "/payment/cancel");
  }

  const tranId = formData.get("tran_id");
  return handleReturn(request, typeof tranId === "string" ? tranId : null);
}

async function handleReturn(request: Request, tranId: string | null) {
  if (!tranId || !/^[a-f0-9]{24}$/.test(tranId)) {
    return redirectTo(request, "/payment/cancel");
  }

  const transaction = await getPaymentTransaction(tranId);
  if (!transaction) {
    return redirectTo(request, "/payment/cancel");
  }

  try {
    const updatedTransaction = await refreshPaymentStatus(transaction);
    if (updatedTransaction.status === "paid") {
      return redirectTo(request, `/payment/success?tran_id=${encodeURIComponent(tranId)}`);
    }
    if (updatedTransaction.status === "pending") {
      return redirectTo(request, `/payment/pending?tran_id=${encodeURIComponent(tranId)}`);
    }
    return redirectTo(request, `/payment/cancel?tran_id=${encodeURIComponent(tranId)}`);
  } catch {
    console.error("Unable to verify an SSLCOMMERZ return.");
    return redirectTo(request, `/payment/pending?tran_id=${encodeURIComponent(tranId)}`);
  }
}

function redirectTo(request: Request, path: string) {
  const appBaseUrl = getSslCommerzConfig()?.appBaseUrl ?? new URL(request.url).origin;
  const target = new URL(path, appBaseUrl);
  return Response.redirect(target, 303);
}
