import Link from "next/link";
import { ArrowLeft, ClipboardCheck } from "lucide-react";

export default function AdminModerationPage() {
  return (
    <div>
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Admin dashboard
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-primary">Platform administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Content moderation</h1>
        <p className="mt-2 text-muted-foreground">
          Review tuition listings before they are published on the marketplace.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border">
        <div className="border-b p-5">
          <h2 className="text-lg font-bold">Tuition review queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Listings awaiting moderation will be shown here.
          </p>
        </div>

        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardCheck className="size-5" />
          </span>
          <h3 className="mt-4 font-semibold">Moderation queue not connected</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Tuition listings are currently static sample content. Connect listing submissions and
            review actions to the database before using this page to approve or reject content.
          </p>
        </div>
      </section>
    </div>
  );
}
