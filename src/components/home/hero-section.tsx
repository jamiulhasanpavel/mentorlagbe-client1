import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mentorDetails = [
  { label: "Subjects", value: "Math & Physics", icon: BookOpen },
  { label: "Class level", value: "HSC / A-Level", icon: GraduationCap },
  { label: "Tuition mode", value: "Home & online", icon: MapPin },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b bg-gradient-to-br from-violet-50/80 via-background to-slate-50 dark:from-violet-950/20 dark:via-background dark:to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 -top-32 -z-10 size-[34rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/4 -z-10 size-96 rounded-full bg-indigo-200/20 blur-3xl"
      />

      <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
            <ShieldCheck className="size-4" />
            Bangladesh&apos;s Premier Tuition Marketplace
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Ideal Tutor or{" "}
            <span className="text-primary">Mentorship Batch</span> Today
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Connect with verified tutors for personalized learning in Mathematics,
            Physics, Programming, IELTS &amp; more across Bangladesh.
          </p>

          <form
            action="/tuitions"
            className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border bg-background p-2 shadow-lg shadow-primary/5 sm:flex-row"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="size-5 shrink-0 text-primary" />
              <span className="sr-only">Search tuitions</span>
              <input
                name="query"
                type="search"
                placeholder="Search by subject, class level, or keyword..."
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Button type="submit" size="lg" className="color-animated-border h-12 rounded-xl px-5">
              Search Tuitions
              <ArrowRight />
            </Button>
          </form>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 sm:gap-6">
            {[
              ["2,500+", "Verified Tutors"],
              ["15,000+", "Active Students"],
              ["98%", "Satisfaction"],
            ].map(([value, label]) => (
              <div key={label} className="border-l-2 border-primary/20 pl-3 sm:pl-4">
                <p className="text-xl font-bold tracking-tight sm:text-2xl">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[500px]">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2.5rem] bg-primary/10 blur-2xl"
          />
          <div className="color-animated-border relative rounded-[2rem] border bg-background/90 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-6">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-violet-50 to-indigo-50 p-5 dark:from-primary/15 dark:via-violet-950/30 dark:to-indigo-950/20 sm:p-7">
              <div className="flex items-center gap-4 rounded-2xl bg-background/80 p-3 shadow-lg shadow-primary/10">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <GraduationCap className="size-9" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Top Rated Mentor</p>
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Verified BUET Graduate</p>
                </div>
              </div>

              <div className="mt-7 space-y-3 rounded-2xl border bg-background/90 p-4 sm:p-5">
                {mentorDetails.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="size-4 text-primary" />
                      {label}
                    </span>
                    <span className="text-right text-sm font-semibold">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 border-t pt-3">
                  <span className="text-sm text-muted-foreground">Monthly tuition</span>
                  <span className="text-sm font-bold text-primary">৳12,000</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ml-1 text-sm font-bold">5.0</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-3.5" />
                  Approved
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/tuitions"
            className="color-animated-border absolute -bottom-14 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background px-4 py-3 text-sm font-medium shadow-lg"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <Users className="size-4 text-primary" />
            New requests live
          </Link>
        </div>
      </div>
    </section>
  );
}
