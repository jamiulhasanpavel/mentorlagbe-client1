import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-14 sm:px-6">
      <section className="w-full max-w-lg rounded-2xl border bg-background p-7 text-center shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          This page may have moved, or the link may be incorrect.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft />
              Home
            </Button>
          </Link>
          <Link href="/tuitions">
            <Button>
              <Search />
              Browse tuitions
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
