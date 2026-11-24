import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredTuitions = [
  {
    id: "class-8-math-dhanmondi",
    title: "Class 8 Mathematics Tutor Needed",
    location: "Dhanmondi, Dhaka",
    subject: "Mathematics",
    salary: "8,000 BDT/month",
    schedule: "3 days/week",
  },
  {
    id: "hsc-physics-banani",
    title: "HSC Physics Part-Time Tuition",
    location: "Banani, Dhaka",
    subject: "Physics",
    salary: "12,000 BDT/month",
    schedule: "4 days/week",
  },
  {
    id: "english-speaking-mirpur",
    title: "Spoken English for Professionals",
    location: "Mirpur, Dhaka",
    subject: "English",
    salary: "10,000 BDT/month",
    schedule: "Flexible",
  },
];

export function FeaturedTuitions() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Fresh opportunities
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured tuitions
            </h2>
          </div>
          <Link href="/tuitions">
            <Button variant="outline">
              View all tuitions
              <ArrowRight />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredTuitions.map((tuition) => (
            <article
              key={tuition.id}
              className="flex flex-col rounded-2xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {tuition.subject}
                </span>
                <span className="text-xs text-muted-foreground">Recently added</span>
              </div>

              <h3 className="mt-5 text-lg font-bold">{tuition.title}</h3>

              <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  {tuition.location}
                </p>
                <p className="flex items-center gap-2">
                  <Wallet className="size-4 text-primary" />
                  {tuition.salary}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 text-primary" />
                  {tuition.schedule}
                </p>
              </div>

              <Link
                href={`/tuitions/${tuition.id}`}
                className="mt-6 flex h-9 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <BookOpen className="size-4" />
                View details
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
