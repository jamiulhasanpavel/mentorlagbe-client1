import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authBaseURL =
  typeof window === "undefined"
    ? "http://localhost:3000/api/auth"
    : `${window.location.origin}/api/auth`;

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
