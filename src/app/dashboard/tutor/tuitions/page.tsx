import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TutorTuitionsPage() {
  return (
    <div>
      <Link
        href="/dashboard/tutor"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tutor dashboard
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-primary">Tutor workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">My tuitions</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your active and completed tuition assignments.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-b pb-4 text-sm">
        <span className="rounded-full bg-primary/10 px-4 py-2 font-semibold text-primary">
          All assignments: 0
        </span>
        <span className="rounded-full bg-muted px-4 py-2 font-medium text-muted-foreground">
          Active: 0
        </span>
        <span className="rounded-full bg-muted px-4 py-2 font-medium text-muted-foreground">
          Completed: 0
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed px-5 py-14 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <BriefcaseBusiness className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-bold">No tuition assignments to manage</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Your active and completed assignments will appear here after you are matched with a student.
        </p>
        <Link href="/tuitions" className="mt-5 inline-block">
          <Button>
            <GraduationCap />
            Browse opportunities
          </Button>
        </Link>
      </div>
    </div>
  );
}
