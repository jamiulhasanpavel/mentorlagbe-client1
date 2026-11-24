import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const applicantStats = [
  { label: "Total applicants", value: 0, icon: Users },
  { label: "Awaiting review", value: 0, icon: Clock3 },
  { label: "Shortlisted", value: 0, icon: CheckCircle2 },
];

export default function TutorApplicantsPage() {
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
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Applicant management</h1>
        <p className="mt-2 text-muted-foreground">
          Review and respond to students who apply to your tuition posts.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Applicant statistics">
        {applicantStats.map(({ label, value, icon: Icon }) => (
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
        <div className="border-b p-5">
          <h2 className="text-lg font-bold">Applications to review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New applications and their review status will appear here.
          </p>
        </div>

        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText className="size-5" />
          </span>
          <h3 className="mt-4 font-semibold">No applicants yet</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            There are no applications to review right now. Once students can submit applications
            to your tuition posts, you will be able to review them here.
          </p>
          <Link href="/dashboard/tutor/tuitions" className="mt-5">
            <Button variant="outline">View my tuitions</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
