import { Suspense, type ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBackendSession } from "@/lib/backend-auth";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <AdminOnly>{children}</AdminOnly>
    </Suspense>
  );
}

async function AdminOnly({ children }: { children: ReactNode }) {
  const session = await getBackendSession(await headers());

  if (!session) {
    redirect("/sign-in?callbackURL=%2Fdashboard%2Fadmin");
  }

  if (!hasAdminRole(session.user.role)) {
    redirect("/dashboard");
  }

  return children;
}

function hasAdminRole(role: string) {
  return role === "admin";
}

function AdminDashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading admin dashboard">
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="h-40 animate-pulse rounded-xl border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
