import { Suspense, type ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBackendSession } from "@/lib/backend-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}

async function AuthenticatedDashboard({ children }: { children: ReactNode }) {
  const session = await getBackendSession(await headers());

  if (!session) {
    redirect("/sign-in?callbackURL=%2Fdashboard");
  }

  return (
    <DashboardShell
      name={session.user.name}
      email={session.user.email}
      role={session.user.role}
    >
      {children}
    </DashboardShell>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/20" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-16 border-b bg-background" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl border bg-background" />
      </div>
    </div>
  );
}
