import type { LucideIcon } from "lucide-react";

type DashboardStat = {
  label: string;
  value: number | string;
  icon: LucideIcon;
};

export function DashboardStatCards({
  stats,
  label,
  className = "sm:grid-cols-2 xl:grid-cols-4",
}: {
  stats: DashboardStat[];
  label: string;
  className?: string;
}) {
  return (
    <section
      className={`mt-8 grid gap-4 ${className}`}
      aria-label={label}
    >
      {stats.map(({ label: title, value, icon: Icon }) => (
        <div key={title} className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{title}</p>
            <Icon className="size-5 shrink-0 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-bold">{value}</p>
        </div>
      ))}
    </section>
  );
}
