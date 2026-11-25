import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { ApplicationList } from "@/components/dashboard/application-list";
import { Button } from "@/components/ui/button";
import { getStudentApplications } from "@/lib/dashboard-data";

export default async function StudentApplicationsPage() {
  const applications = await getStudentApplications();

  return (
    <div>
      <Link
        href="/dashboard/student"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Student dashboard
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Student workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">My applications</h1>
          <p className="mt-2 text-muted-foreground">
            Review your application history and follow each tuition opportunity.
          </p>
        </div>
        <Link href="/tuitions">
          <Button variant="outline">
            <Search />
            Browse tuitions
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {applications.length} application{applications.length === 1 ? "" : "s"}
      </p>
      <div className="mt-4">
        <ApplicationList applications={applications} />
      </div>
    </div>
  );
}
