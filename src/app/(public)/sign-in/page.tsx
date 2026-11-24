"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/providers/toast-provider";

function getCallbackURL() {
  const callbackURL = new URLSearchParams(window.location.search).get("callbackURL");
  return callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
    ? callbackURL
    : "/";
}

export default function SignInPage() {
  const router = useRouter();
  const showToast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("remember") === "on";
    const callbackURL = getCallbackURL();

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL,
      });

      if (error) {
        setErrorMessage(error.message || "Unable to sign in. Please try again.");
        return;
      }

      showToast("Login successful. Welcome back!");
      router.replace(callbackURL);
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
        callbackURL,
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

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-background p-6 shadow-lg sm:p-8">
          <div>
            <p className="text-sm font-semibold text-primary">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in to MentorLagbe</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue your learning or teaching journey.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
            <label className="grid gap-2 text-sm font-medium">
              Email address
              <span className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
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
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-10 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" name="remember" className="size-4 rounded border" />
              Remember me
            </label>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
              <ArrowRight />
            </Button>
          </form>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <span className="font-bold">G</span>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to MentorLagbe?{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
