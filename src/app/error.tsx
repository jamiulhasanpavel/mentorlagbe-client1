"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-14 sm:px-6">
      <section className="w-full max-w-lg rounded-2xl border bg-background p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          We could not load this page. Please try again, or return to the homepage.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={retry}>
            Try again
          </Button>
          <Link href="/">
            <Button type="button" variant="outline">
              Go to homepage
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
