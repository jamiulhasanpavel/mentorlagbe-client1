import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2.5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <GraduationCap className="size-6" />
      </span>
      <span className="text-xl font-bold tracking-tight text-primary">MentorLagbe</span>
    </Link>
  );
}
