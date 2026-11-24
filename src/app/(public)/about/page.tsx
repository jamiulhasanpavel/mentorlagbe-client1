import Link from "next/link";
import { HeartHandshake, SearchCheck, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Trusted connections",
    description: "Clear profiles and application information help learners make confident decisions.",
    icon: ShieldCheck,
  },
  {
    title: "Easy discovery",
    description: "Find relevant subjects, locations, schedules, and opportunities in one place.",
    icon: SearchCheck,
  },
  {
    title: "Community first",
    description: "We help tutors and students build meaningful learning relationships.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="border-b bg-muted/20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">About MentorLagbe</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Learning works better with the right mentor
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
            MentorLagbe is a tuition marketplace built to connect students, guardians,
            and qualified tutors across Bangladesh through a simple and transparent experience.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-2xl border p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-5 text-xl font-bold">{title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid items-center gap-8 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10 lg:grid-cols-[1fr_auto]">
            <div className="flex items-start gap-4">
              <HeartHandshake className="mt-1 size-8 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold">Ready to find your match?</h2>
                <p className="mt-2 opacity-80">
                  Browse available tuitions or join MentorLagbe to start your journey.
                </p>
              </div>
            </div>
            <Link href="/tuitions">
              <Button variant="secondary" className="w-full sm:w-auto">
                Browse tuitions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
