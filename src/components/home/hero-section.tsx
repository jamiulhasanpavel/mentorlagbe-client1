import Link from "next/link";
import { ArrowRight, GraduationCap, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,oklch(0.87_0.08_250),transparent_38%),linear-gradient(to_bottom,oklch(0.98_0.01_250),oklch(1_0_0))]" />

      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm font-medium shadow-sm">
            <ShieldCheck className="size-4 text-primary" />
            Trusted tutors across Bangladesh
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Find the right tutor for
            <span className="text-primary"> your learning goals</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Explore verified tuition opportunities, connect with qualified mentors,
            and make learning simpler, safer, and more effective.
          </p>

          <form
            action="/tuitions"
            className="mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border bg-background p-2 shadow-lg sm:flex-row"
          >
            <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <span className="sr-only">Search subject or location</span>
              <input
                name="query"
                type="search"
                placeholder="Subject or location"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Button type="submit" size="lg" className="h-11">
              Find a Tutor
              <ArrowRight />
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              1,000+ learners
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              500+ tutors
            </span>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div className="absolute -inset-6 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative rounded-3xl border bg-background p-6 shadow-xl">
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className="text-sm font-medium opacity-80">Popular this week</p>
              <p className="mt-2 text-2xl font-bold">Academic Excellence</p>
              <p className="mt-2 text-sm opacity-80">
                Find experienced tutors for every subject and class.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Science", "120 tutors"],
                ["Mathematics", "96 tutors"],
                ["English", "84 tutors"],
                ["Admission", "68 tutors"],
              ].map(([subject, count]) => (
                <Link
                  key={subject}
                  href={`/tuitions?subject=${encodeURIComponent(subject)}`}
                  className="rounded-xl border p-4 transition-colors hover:bg-muted"
                >
                  <p className="font-semibold">{subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{count}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
