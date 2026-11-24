import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Clock3, MapPin, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const tuitions = [
  {
    id: "class-8-math-dhanmondi",
    title: "Class 8 Mathematics Tutor Needed",
    location: "Dhanmondi, Dhaka",
    subject: "Mathematics",
    className: "Class 8",
    salary: "8,000 BDT/month",
    schedule: "3 days/week",
  },
  {
    id: "hsc-physics-banani",
    title: "HSC Physics Part-Time Tuition",
    location: "Banani, Dhaka",
    subject: "Physics",
    className: "HSC",
    salary: "12,000 BDT/month",
    schedule: "4 days/week",
  },
  {
    id: "english-speaking-mirpur",
    title: "Spoken English for Professionals",
    location: "Mirpur, Dhaka",
    subject: "English",
    className: "Professional",
    salary: "10,000 BDT/month",
    schedule: "Flexible",
  },
  {
    id: "class-10-science-uttara",
    title: "SSC Science Group Tutor",
    location: "Uttara, Dhaka",
    subject: "Science",
    className: "SSC",
    salary: "11,000 BDT/month",
    schedule: "3 days/week",
  },
  {
    id: "javascript-developer-gulshan",
    title: "Frontend Development Mentor",
    location: "Gulshan, Dhaka",
    subject: "Programming",
    className: "Advanced",
    salary: "18,000 BDT/month",
    schedule: "2 days/week",
  },
  {
    id: "admission-biology-mohammadpur",
    title: "Medical Admission Biology Tuition",
    location: "Mohammadpur, Dhaka",
    subject: "Biology",
    className: "Admission",
    salary: "15,000 BDT/month",
    schedule: "4 days/week",
  },
];

type SearchParams = Promise<{
  query?: string | string[];
  subject?: string | string[];
}>;

async function TuitionResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const queryValue = Array.isArray(params.query) ? params.query[0] : params.query;
  const subjectValue = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const query = queryValue?.trim() ?? "";
  const subject = subjectValue?.trim() ?? "";

  const filteredTuitions = tuitions.filter((tuition) => {
    const searchableText =
      `${tuition.title} ${tuition.location} ${tuition.subject} ${tuition.className}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query.toLowerCase());
    const matchesSubject =
      !subject || tuition.subject.toLowerCase() === subject.toLowerCase();
    return matchesQuery && matchesSubject;
  });

  return (
    <main>
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Browse opportunities
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Find your ideal tuition
          </h1>

          <form action="/tuitions" className="mt-7 flex max-w-3xl flex-col gap-3 rounded-xl border bg-background p-2 shadow-sm sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <span className="sr-only">Search tuitions</span>
              <input
                name="query"
                defaultValue={query}
                type="search"
                placeholder="Search subject, location, or class"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            {subject && <input type="hidden" name="subject" value={subject} />}
            <Button type="submit" size="lg" className="h-11">
              Search
              <ArrowRight />
            </Button>
          </form>

          {(query || subject) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active search:</span>
              {subject && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{subject}</span>}
              {query && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{query}</span>}
              <Link href="/tuitions" className="ml-1 underline underline-offset-4">
                Clear
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {filteredTuitions.length} tuition{filteredTuitions.length === 1 ? "" : "s"} found
            </h2>
          </div>

          {filteredTuitions.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredTuitions.map((tuition) => (
                <article
                  key={tuition.id}
                  className="flex flex-col rounded-2xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {tuition.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">{tuition.className}</span>
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
                    className="mt-6 flex h-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    View details
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
              <h3 className="text-lg font-bold">No matching tuitions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different subject, location, or search term.
              </p>
              <Link href="/tuitions" className="mt-5 inline-block">
                <Button variant="outline">View all tuitions</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function TuitionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-2xl border bg-muted/40" />
            ))}
          </div>
        </main>
      }
    >
      <TuitionResults searchParams={searchParams} />
    </Suspense>
  );
}
