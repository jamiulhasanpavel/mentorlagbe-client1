import { getBackendApiUrl } from "@/lib/backend-url";

type BackendSession = {
  session: {
    id: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: string;
    bio?: string;
    bannerImage?: string | null;
    role: "student" | "tutor" | "admin";
  };
};

export async function getBackendSession(
  requestHeaders: Headers,
): Promise<BackendSession | null> {
  const cookie = requestHeaders.get("cookie");

  let response: Response;
  try {
    response = await fetch(`${getBackendApiUrl()}/api/auth/get-session`, {
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    });
  } catch (error) {
    console.error("Unable to reach the authentication service.", error);
    return null;
  }

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 504) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Authentication service returned ${response.status}.`);
  }

  const result = (await response.json()) as BackendSession | null;
  return result?.session && result?.user ? result : null;
}
