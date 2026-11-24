import { Suspense, type ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<StudentDashboardLoading />}>
      <StudentOnly>{children}</StudentOnly>
    </Suspense>
  );
}

async function StudentOnly({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?callbackURL=%2Fdashboard%2Fstudent");
  }

  if (session.user.role !== "student") {
    redirect("/dashboard");
  }

  return children;
}

function StudentDashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading student dashboard">
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-xl border bg-muted/40" />
    </div>
  );
}
