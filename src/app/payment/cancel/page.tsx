import Link from "next/link";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-full items-center justify-center bg-muted/20 px-4 py-14 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border bg-background p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CircleX className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
          Payment not completed
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Checkout canceled</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          No successful payment was confirmed. You can return to pricing and try again.
        </p>
        <Link href="/pricing" className="mt-7 inline-block">
          <Button variant="outline">Return to pricing</Button>
        </Link>
      </section>
    </main>
  );
}
