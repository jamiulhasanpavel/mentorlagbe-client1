import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-primary">Your workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Your MentorLagbe account is ready. Explore tuition opportunities and manage your learning journey.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link
          href="/tuitions"
          className="group rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">Browse tuitions</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Find opportunities by subject, class, and location.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Explore listings
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <div className="rounded-2xl border bg-background p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-bold">Your account is protected</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This dashboard is available only while you are signed in.
          </p>
        </div>
      </div>
    </div>
  );
}
