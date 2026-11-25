import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TuitionPostForm } from "@/components/dashboard/tuition-post-form";

export default function NewTutorTuitionPage() {
  return (
    <div>
      <Link
        href="/dashboard/tutor/tuitions"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        My tuitions
      </Link>
      <div className="mt-6 mb-7">
        <p className="text-sm font-semibold text-primary">Tutor workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Post a tuition</h1>
        <p className="mt-2 text-muted-foreground">
          Share the learning opportunity. It will be published after admin review.
        </p>
      </div>
      <TuitionPostForm />
    </div>
  );
}
