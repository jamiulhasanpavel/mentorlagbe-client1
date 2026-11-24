import Link from "next/link";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentApplicationsPage() {
  return (
    <div>
      <Link
        href="/dashboard/student"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Student dashboard
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-primary">Student workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">My applications</h1>
        <p className="mt-2 text-muted-foreground">
          Review your application history and follow each tuition opportunity.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed px-5 py-14 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-bold">Your applications will show up here</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          You have not applied to any tuitions yet. Browse current opportunities to get started.
        </p>
        <Link href="/tuitions" className="mt-5 inline-block">
          <Button>
            <Search />
            Browse tuitions
          </Button>
        </Link>
      </div>
    </div>
  );
}
