"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authBaseURL, authClient } from "@/lib/auth-client";
import { Brand } from "@/components/shared/brand";
import { useToast } from "@/providers/toast-provider";

const demoAccounts = [
  { role: "admin", label: "Demo Admin Login", email: "admin@mentorlagbe.com", icon: ShieldCheck },
  { role: "tutor", label: "Demo Tutor Login", email: "tutor@mentorlagbe.com", icon: GraduationCap },
  { role: "student", label: "Demo Student Login", email: "student@mentorlagbe.com", icon: BookOpen },
] as const;
type DemoAccountRole = (typeof demoAccounts)[number]["role"];

function getCallbackURL() {
  const callbackURL = new URLSearchParams(window.location.search).get("callbackURL");
  return callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
    ? callbackURL
    : null;
}

const demoDashboardByRole: Record<DemoAccountRole, string> = {
  admin: "/dashboard/admin",
  tutor: "/dashboard/tutor",
  student: "/dashboard/student",
};

function getDashboardByRole(role: string | undefined) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
}

export default function SignInPage() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("remember") === "on";
    const callbackURL = getCallbackURL();

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: callbackURL ?? "/dashboard",
      });

      if (error) {
        setErrorMessage(error.message || "Unable to sign in. Please try again.");
        return;
      }

      showToast("Login successful. Welcome back!");
      router.replace(callbackURL ?? getDashboardByRole(data?.user.role));
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the authentication service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setErrorMessage("");
    window.sessionStorage.setItem("mentorlagbe:google-login-success", "true");
    const callbackURL = getCallbackURL();

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL ?? "/dashboard",
      });

      if (error) {
        window.sessionStorage.removeItem("mentorlagbe:google-login-success");
        setErrorMessage(error.message || "Unable to continue with Google.");
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      window.sessionStorage.removeItem("mentorlagbe:google-login-success");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the authentication service. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  async function handleDemoSignIn(role: DemoAccountRole, demoEmail: string) {
    setEmail(demoEmail);
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${authBaseURL.replace(/\/+$/, "")}/demo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setErrorMessage(result.message || "Unable to sign in to this demo account.");
        return;
      }

      const callbackURL = getCallbackURL();
      showToast("Demo login successful. Welcome!");
      router.replace(callbackURL ?? demoDashboardByRole[role]);
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the authentication service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/35 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 size-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-36 size-[30rem] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border bg-background/95 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
          <div className="mb-7 text-center">
            <div className="mb-5 flex justify-center">
              <Brand />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your tuition dashboard
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignIn}>
            <label className="grid gap-2 text-sm font-medium">
              Email address
              <span className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border bg-muted/20 pl-10 pr-3.5 outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              <span className="flex items-center justify-between">
                Password
                <Link href="#" className="text-xs font-normal text-primary hover:underline">
                  Forgot password?
                </Link>
              </span>
              <span className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border bg-muted/20 pl-10 pr-11 outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>

            <label className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
              <input type="checkbox" name="remember" className="size-4 rounded border accent-primary" />
              Remember me
            </label>

            <Button
              type="submit"
              className="color-animated-border h-11 w-full rounded-xl shadow-md shadow-primary/15"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              <ArrowRight />
            </Button>
          </form>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <span className="font-bold text-primary">G</span>
            Sign in with Google
          </Button>

          <div className="mt-6 border-t pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                ⚡ Quick Demo Access
              </p>
              <span className="text-[10px] font-medium text-primary">Select an account</span>
            </div>
            <div className="space-y-2">
              {demoAccounts.map(({ role, label, email: demoEmail, icon: Icon }) => (
                <button
                  key={demoEmail}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoSignIn(role, demoEmail)}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border bg-muted/20 p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold">{label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {demoEmail}
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {isSubmitting ? "Signing in to demo account..." : "Select an account to sign in instantly."}
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
