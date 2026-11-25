"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BriefcaseBusiness,
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

function getDashboardLinks(role: string): DashboardLink[] {
  const links: DashboardLink[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  ];

  if (role === "student") {
    links.push(
      { href: "/dashboard/student", label: "Student dashboard", icon: GraduationCap },
      { href: "/dashboard/student/applications", label: "My applications", icon: FileText },
      { href: "/dashboard/student/messages", label: "Messages", icon: Mail },
    );
  } else if (role === "tutor") {
    links.push(
      { href: "/dashboard/tutor", label: "Tutor dashboard", icon: GraduationCap },
      { href: "/dashboard/tutor/messages", label: "Messages", icon: Mail },
      { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
      { href: "/dashboard/tutor/tuitions", label: "My tuitions", icon: BriefcaseBusiness },
    );
  } else if (role === "admin") {
    links.push(
      { href: "/dashboard/admin", label: "Admin dashboard", icon: LayoutDashboard },
      { href: "/dashboard/admin/moderation", label: "Content moderation", icon: ClipboardCheck },
      { href: "/dashboard/admin/users", label: "User management", icon: Shield },
      { href: "/dashboard/admin/payments", label: "Payment history", icon: CreditCard },
    );
  }

  links.push(
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
    { href: "/tuitions", label: "Browse tuitions", icon: GraduationCap },
  );

  return links;
}

export function DashboardMobileNav({ role }: { role: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-expanded={open}
        aria-controls="dashboard-mobile-menu"
        aria-label={open ? "Close dashboard navigation" : "Open dashboard navigation"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X /> : <Menu />}
      </Button>
      <nav
        id="dashboard-mobile-menu"
        aria-label="Dashboard navigation"
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border bg-background p-2 shadow-lg"
      >
        {getDashboardLinks(role).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
