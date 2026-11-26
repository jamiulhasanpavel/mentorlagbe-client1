import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTutorTuitions } from "@/lib/dashboard-data";
import { TutorTuitionList } from "@/components/dashboard/tutor-tuition-list";

export default async function TutorTuitionsPage() {
  const tuitions = await getTutorTuitions();
  const activeCount = tuitions.filter(
    ({ status, isActive }) => status === "approved" && isActive !== false,
  ).length;
  const pendingCount = tuitions.filter(({ status }) => status === "pending").length;

  return (
    <div>
      <Link
        href="/dashboard/tutor"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tutor dashboard
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Tutor workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">My tuitions</h1>
          <p className="mt-2 text-muted-foreground">
            Track admin approval status and whether each approved post is active or closed.
          </p>
        </div>
        <Link href="/dashboard/tutor/post-tuition">
          <Button>
            <Plus />
            Post a tuition
          </Button>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-b pb-4 text-sm">
        <span className="rounded-full bg-primary/10 px-4 py-2 font-semibold text-primary">
          All posts: {tuitions.length}
        </span>
        <span className="rounded-full bg-muted px-4 py-2 font-medium text-muted-foreground">
          Published: {activeCount}
        </span>
        <span className="rounded-full bg-muted px-4 py-2 font-medium text-muted-foreground">
          Pending review: {pendingCount}
        </span>
      </div>

      {tuitions.length > 0 ? (
        <TutorTuitionList tuitions={tuitions} />
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed px-5 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BriefcaseBusiness className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold">No tuition posts yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Post a tuition to start connecting with students.
          </p>
          <Link href="/dashboard/tutor/post-tuition" className="mt-5 inline-block">
            <Button>Post your first tuition</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
