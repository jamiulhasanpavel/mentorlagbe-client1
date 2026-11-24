import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In | MentorLagbe",
};

export default function SignInPage() {
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

          <form className="mt-8 space-y-5">
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
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
                />
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" name="remember" className="size-4 rounded border" />
              Remember me
            </label>

            <Button type="submit" className="w-full" size="lg">
              Sign In
              <ArrowRight />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" className="w-full" size="lg">
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
