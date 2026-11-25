import { BriefcaseBusiness, GraduationCap, Star, Users } from "lucide-react";

const stats = [
  { label: "Active Tutors", value: "500+", icon: GraduationCap },
  { label: "Happy Students", value: "2,000+", icon: Users },
  { label: "Approved Tuitions", value: "1,000+", icon: BriefcaseBusiness },
  { label: "Success Rate", value: "98%", icon: Star },
];

export function StatsSection() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center px-3 text-center md:border-r md:last:border-r-0"
          >
            <Icon className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
