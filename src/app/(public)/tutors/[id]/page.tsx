import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { MessageToTutor } from "@/components/tuitions/message-to-tutor";
import { Button } from "@/components/ui/button";
import {
  getTutorProfile,
  TutorProfileApiError,
  type TutorProfile,
} from "@/lib/tutors";

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let tutor: TutorProfile;
  try {
    tutor = await getTutorProfile(id);
  } catch (error: unknown) {
    if (error instanceof TutorProfileApiError && error.status === 404) {
      notFound();
    }

    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h1 className="text-xl font-bold">Unable to load this tutor profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again later."}
          </p>
          <Link href="/tuitions" className="mt-6 inline-block">
            <Button variant="outline">Browse tuitions</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Browse tuitions
        </Link>

        <article className="mt-6 rounded-2xl border bg-background p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-8" />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary">Tutor profile</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{tutor.name}</h1>
            </div>
          </div>

          <div className="mt-7 border-t pt-6">
            <h2 className="text-lg font-semibold">About the tutor</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
              {tutor.bio || "This tutor has not added a profile description yet."}
            </p>
          </div>

          <div className="mt-7 border-t pt-6">
            <MessageToTutor tutorId={tutor.id} tutorName={tutor.name} />
          </div>
        </article>
      </div>
    </main>
  );
}
