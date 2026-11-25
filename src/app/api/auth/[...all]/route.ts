import { getBackendApiUrl } from "@/lib/backend-url";

async function proxyAuthRequest(request: Request) {
  const requestUrl = new URL(request.url);
  const backendUrl = new URL(getBackendApiUrl());
  const authPath = requestUrl.pathname.slice("/api/auth".length);
  backendUrl.pathname = `${backendUrl.pathname.replace(/\/+$/, "")}/api/auth${authPath}`;
  backendUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("connection");
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("host");

  const requestInit: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    requestInit.body = await request.arrayBuffer();
  }

  let response: Response;
  try {
    response = await fetch(backendUrl, requestInit);
  } catch (error) {
    console.error("Authentication backend request failed.", error);
    return Response.json(
      { message: "The authentication service is unavailable." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  const setCookies = response.headers.getSetCookie();
  if (setCookies.length > 0) {
    responseHeaders.delete("set-cookie");
    for (const cookie of setCookies) {
      responseHeaders.append("set-cookie", cookie);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
