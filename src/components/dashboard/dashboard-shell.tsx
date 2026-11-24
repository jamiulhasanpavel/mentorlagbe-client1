import Link from "next/link";
import { GraduationCap, LayoutDashboard } from "lucide-react";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

export function DashboardShell({
  name,
  email,
  role,
  children,
}: {
  name: string;
  email: string;
  role: string;
  children: React.ReactNode;
}) {
  const roleLabel = role === "tutor" ? "Tutor" : "Student";

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Mentor<span className="text-primary">Lagbe</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted sm:inline-flex"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href="/tuitions"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted sm:inline-flex"
            >
              <GraduationCap className="size-4" />
              Tuitions
            </Link>
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
              {roleLabel}
            </span>
            <SignOutButton />
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="hidden self-start rounded-2xl border bg-background p-5 lg:block">
          <div className="truncate font-semibold">{name}</div>
          <div className="mt-1 truncate text-sm text-muted-foreground">{email}</div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium">
            <span className="size-2 rounded-full bg-emerald-500" />
            {roleLabel} account
          </div>
          <nav className="mt-6 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
            >
              <LayoutDashboard className="size-4" />
              Overview
            </Link>
            <Link
              href="/tuitions"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <GraduationCap className="size-4" />
              Browse tuitions
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 rounded-2xl border bg-background p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
