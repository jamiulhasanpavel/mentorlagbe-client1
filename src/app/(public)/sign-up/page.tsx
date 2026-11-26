"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const role = formData.get("role") === "tutor" ? "tutor" : "student";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(error.message || "Unable to create your account. Please try again.");
        return;
      }

      router.replace("/");
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
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border bg-background p-6 shadow-lg sm:p-8">
          <div>
            <p className="text-sm font-semibold text-primary">Join MentorLagbe</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose how you want to use MentorLagbe.
            </p>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSignUp}>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">I want to</legend>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="role" value="student" className="peer sr-only" defaultChecked />
                  <span className="flex h-full items-center gap-3 rounded-xl border p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
                    <UserRound className="size-5 text-primary" />
                    <span>
                      <span className="block text-sm font-semibold">Find a tutor</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">As a student or guardian</span>
                    </span>
                  </span>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="role" value="tutor" className="peer sr-only" />
                  <span className="flex h-full items-center gap-3 rounded-xl border p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
                    <GraduationCap className="size-5 text-primary" />
                    <span>
                      <span className="block text-sm font-semibold">Become a tutor</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">Apply for tuitions</span>
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>

            <label className="grid gap-2 text-sm font-medium">
              Full name
              <span className="relative">
                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
                />
              </span>
            </label>

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
              Password
              <span className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

            <label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 rounded border" />
              <span>
                I agree to the{" "}
                <Link href="#" className="font-medium text-primary hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="#" className="font-medium text-primary hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight />
            </Button>
          </form>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
