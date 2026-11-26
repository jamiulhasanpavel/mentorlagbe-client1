import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authBaseURL =
  typeof window === "undefined"
    ? "https://mentorlagbe-client1.vercel.app/api/auth"
    : `${window.location.origin}/api/auth`;

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
