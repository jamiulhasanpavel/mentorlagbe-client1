import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tutorStats = [
  { label: "Active tuitions", value: 0, icon: BriefcaseBusiness },
  { label: "New applicants", value: 0, icon: Users },
  { label: "Completed tuitions", value: 0, icon: CheckCircle2 },
];

export default function TutorDashboardPage() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Tutor workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Your teaching dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Keep track of your tutoring activity and manage your tuition assignments.
          </p>
        </div>
        <Link href="/tuitions">
          <Button>
            <GraduationCap />
            Find tuition opportunities
          </Button>
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Tutor statistics">
        {tutorStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-5 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">My tuitions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review your current tuition assignments and their progress.
            </p>
          </div>
          <Link
            href="/dashboard/tutor/tuitions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Manage tuitions
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Clock3 className="size-5" />
          </span>
          <h3 className="mt-4 font-semibold">No tuition assignments yet</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Once you are matched with a tuition, its schedule and status will appear here.
          </p>
          <Link href="/tuitions" className="mt-5">
            <Button variant="outline">Browse tuition opportunities</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
