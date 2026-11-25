import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Users } from "lucide-react";
import { ApplicationList } from "@/components/dashboard/application-list";
import { getTutorApplications } from "@/lib/dashboard-data";

export default async function TutorApplicantsPage() {
  const applications = await getTutorApplications();
  const stats = [
    { label: "Total applicants", value: applications.length, icon: Users },
    {
      label: "Awaiting review",
      value: applications.filter(({ status }) => status === "pending").length,
      icon: Clock3,
    },
    {
      label: "Accepted",
      value: applications.filter(({ status }) => status === "accepted").length,
      icon: CheckCircle2,
    },
  ];

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
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-5 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Applications to review</h2>
        <ApplicationList applications={applications} canManage />
      </section>
    </div>
  );
}
