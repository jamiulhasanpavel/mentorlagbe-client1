import Link from "next/link";
import { ArrowRight, ClipboardCheck, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-primary">Platform administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Review moderation tools and keep the MentorLagbe marketplace healthy.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link
          href="/dashboard/admin/moderation"
          className="group rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">Content moderation</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Review tuition listings that are submitted for approval.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Open moderation
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <div className="rounded-2xl border bg-background p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">Restricted access</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Administrator access is provisioned outside public signup and checked on the server.
          </p>
        </div>
      </div>
    </div>
  );
}
