"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

type DashboardLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

function getDashboardLinks(role: string): DashboardLink[] {
  const overviewHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student";
  const links: DashboardLink[] = [
    { href: overviewHref, label: "Overview", icon: LayoutDashboard },
  ];

  if (role === "admin") {
    links.push({
      href: "/dashboard/admin/tuitions",
      label: "Tuition approval",
      icon: ClipboardCheck,
    });
    links.push({
      href: "/dashboard/admin/users",
      label: "User management",
      icon: Shield,
    });
    links.push({
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: CreditCard,
    });
  } else if (role === "tutor") {
    links.push(
      { href: "/dashboard/tutor/messages", label: "Messages", icon: Mail },
      { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
      { href: "/dashboard/tutor/my-tuitions", label: "My tuitions", icon: BriefcaseBusiness },
    );
  } else {
    links.push({
      href: "/dashboard/student/my-applications",
      label: "My applications",
      icon: FileText,
    });
    links.push({
      href: "/dashboard/student/messages",
      label: "Messages",
      icon: Mail,
    });
  }

  return links;
}

function getPageTitle(pathname: string) {
  const titles: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/admin": "Admin Dashboard",
    "/dashboard/admin/moderation": "Content Moderation",
    "/dashboard/admin/tuitions": "Tuition Approval",
    "/dashboard/admin/users": "User Management",
    "/dashboard/admin/payments": "Payment History",
    "/dashboard/admin/transactions": "Transaction Management",
    "/dashboard/profile": "Account Settings",
    "/dashboard/student": "Student Dashboard",
    "/dashboard/student/applications": "My Applications",
    "/dashboard/student/my-applications": "My Applications",
    "/dashboard/student/messages": "Messages",
    "/dashboard/tutor": "Tutor Dashboard",
    "/dashboard/tutor/messages": "Messages",
    "/dashboard/tutor/applicants": "Applicants",
    "/dashboard/tutor/tuitions": "My Tuitions",
    "/dashboard/tutor/my-tuitions": "My Tuitions",
  };

  return titles[pathname] || "Dashboard";
}

function getRoleLabel(role: string) {
  return role === "admin" ? "Administrator" : role === "tutor" ? "Tutor" : "Student";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  pathname,
  collapsed = false,
}: DashboardLink & { pathname: string; collapsed?: boolean }) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        collapsed ? "justify-center" : ""
      } ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      <span className={collapsed ? "sr-only" : ""}>{label}</span>
    </Link>
  );
}

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
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const roleLabel = getRoleLabel(role);
  const dashboardLinks = getDashboardLinks(role);
  const initials = getInitials(name) || "ML";

  return (
    <div className="min-h-screen bg-muted/30">
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-background transition-[width] lg:flex ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`flex min-h-[73px] items-center border-b ${sidebarCollapsed ? "justify-center px-3" : "px-5"}`}>
          {sidebarCollapsed ? (
            <Link
              href="/"
              aria-label="MentorLagbe home"
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm"
            >
              ML
            </Link>
          ) : (
            <Brand />
          )}
        </div>

        <div className={`flex items-center gap-3 border-b p-4 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {initials}
          </span>
          <span className={`min-w-0 ${sidebarCollapsed ? "hidden" : ""}`}>
            <span className="block truncate text-sm font-semibold">{name}</span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">{email}</span>
          </span>
        </div>

        <nav
          aria-label="Dashboard sidebar"
          className={`flex-1 space-y-6 overflow-y-auto p-4 ${sidebarCollapsed ? "px-3" : ""}`}
        >
          <div>
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Main menu
              </p>
            )}
            <div className="space-y-1">
              {dashboardLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  {...link}
                  pathname={pathname}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </div>
          </div>

          <div>
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Preferences
              </p>
            )}
            <SidebarLink
              href="/dashboard/profile"
              label="Update profile"
              icon={UserRound}
              pathname={pathname}
              collapsed={sidebarCollapsed}
            />
          </div>

          <div>
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Marketplace
              </p>
            )}
            <SidebarLink
              href="/tuitions"
              label="Browse tuitions"
              icon={GraduationCap}
              pathname={pathname}
              collapsed={sidebarCollapsed}
            />
          </div>
        </nav>

        <div className={`space-y-3 border-t p-4 ${sidebarCollapsed ? "px-3" : ""}`}>
          <SignOutButton compact={sidebarCollapsed} />
          <Button
            type="button"
            variant="ghost"
            size={sidebarCollapsed ? "icon" : "default"}
            className={sidebarCollapsed ? "w-full" : "w-full justify-start"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            {!sidebarCollapsed && <span>Collapse sidebar</span>}
          </Button>
        </div>
      </aside>

      <div className={`min-h-screen transition-[padding] ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <DashboardMobileNav role={role} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              >
                {sidebarCollapsed ? <Menu /> : <ChevronLeft />}
              </Button>
              <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                {getPageTitle(pathname)}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <ThemeToggle />
              <div className="lg:hidden">
                <SignOutButton compact />
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials}
                </span>
                <span className="hidden text-sm font-medium md:inline">{name}</span>
              </div>
              <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary lg:inline-flex">
                {roleLabel}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
