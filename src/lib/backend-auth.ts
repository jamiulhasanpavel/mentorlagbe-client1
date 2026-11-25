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

  const response = await fetch(`${getBackendApiUrl()}/api/auth/get-session`, {
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Authentication service returned ${response.status}.`);
  }

  const result = (await response.json()) as BackendSession | null;
  return result?.session && result?.user ? result : null;
}
