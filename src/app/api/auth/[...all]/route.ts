// import { getBackendApiUrl } from "@/lib/backend-url";

// async function proxyAuthRequest(request: Request) {
//   const requestUrl = new URL(request.url);
//   const backendUrl = new URL(getBackendApiUrl());
//   const authPath = requestUrl.pathname.slice("/api/auth".length);
//   backendUrl.pathname = `${backendUrl.pathname.replace(/\/+$/, "")}/api/auth${authPath}`;
//   backendUrl.search = requestUrl.search;

//   const headers = new Headers(request.headers);
//   headers.delete("connection");
//   headers.delete("content-encoding");
//   headers.delete("content-length");
//   headers.delete("host");

//   const requestInit: RequestInit = {
//     method: request.method,
//     headers,
//     redirect: "manual",
//     cache: "no-store",
//     signal: AbortSignal.timeout(15_000),
//   };
//   if (request.method !== "GET" && request.method !== "HEAD") {
//     requestInit.body = await request.arrayBuffer();
//   }

//   let response: Response;
//   try {
//     response = await fetch(backendUrl, requestInit);
//   } catch (error) {
//     console.error("Authentication backend request failed.", error);
//     const message =
//       error instanceof Error && error.name === "TimeoutError"
//         ? "The authentication service timed out. Please try again."
//         : "The authentication service is unavailable.";
//     return Response.json(
//       { message },
//       { status: 504, headers: { "Cache-Control": "no-store" } },
//     );
//   }

//   if (response.status === 404) {
//     return Response.json(
//       { message: "Authentication is currently unavailable. The backend auth service needs to be restarted or redeployed." },
//       { status: 503, headers: { "Cache-Control": "no-store" } },
//     );
//   }

//   const responseHeaders = new Headers(response.headers);
//   responseHeaders.delete("content-encoding");
//   responseHeaders.delete("content-length");

//   const setCookies = response.headers.getSetCookie();
//   if (setCookies.length > 0) {
//     responseHeaders.delete("set-cookie");
//     for (const cookie of setCookies) {
//       responseHeaders.append("set-cookie", cookie);
//     }
//   }

//   return new Response(response.body, {
//     status: response.status,
//     statusText: response.statusText,
//     headers: responseHeaders,
//   });
// }

// export const GET = proxyAuthRequest;
// export const POST = proxyAuthRequest;

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);