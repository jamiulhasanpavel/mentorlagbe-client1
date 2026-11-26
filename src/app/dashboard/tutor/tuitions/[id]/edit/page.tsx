import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TuitionPostForm } from "@/components/dashboard/tuition-post-form";
import { getTutorTuitions } from "@/lib/dashboard-data";

export default async function EditTutorTuitionPage({
  params,
}: PageProps<"/dashboard/tutor/tuitions/[id]/edit">) {
  const { id } = await params;
  const tuitions = await getTutorTuitions();
  const tuition = tuitions.find((item) => item.id === id);
  if (!tuition) notFound();

  return (
    <div>
      <Link
        href="/dashboard/tutor/my-tuitions"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        My tuitions
      </Link>
      <div className="mb-7 mt-6">
        <p className="text-sm font-semibold text-primary">Tutor workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit tuition</h1>
        <p className="mt-2 text-muted-foreground">
          Saving changes sends the post back to admin review.
        </p>
      </div>
      <TuitionPostForm initialTuition={tuition} />
    </div>
  );
}
