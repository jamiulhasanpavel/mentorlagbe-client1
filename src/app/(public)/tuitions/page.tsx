import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Clock3, MapPin, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTuitions } from "@/lib/tuitions";

type SearchParams = Promise<{
  query?: string | string[];
  subject?: string | string[];
  location?: string | string[];
  className?: string | string[];
  mode?: string | string[];
  page?: string | string[];
}>;

async function TuitionResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const queryValue = Array.isArray(params.query) ? params.query[0] : params.query;
  const subjectValue = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const locationValue = Array.isArray(params.location) ? params.location[0] : params.location;
  const classValue = Array.isArray(params.className) ? params.className[0] : params.className;
  const modeValue = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const query = queryValue?.trim() ?? "";
  const subject = subjectValue?.trim() ?? "";
  const locationFilter = locationValue?.trim() ?? "";
  const classFilter = classValue?.trim() ?? "";
  const modeFilter = modeValue?.trim() ?? "";
  const requestedPage = Number.parseInt(pageValue ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  let tuitions: Awaited<ReturnType<typeof getTuitions>>["data"] = [];
  let pagination = { page: currentPage, limit: 6, total: 0, totalPages: 1 };
  let errorMessage = "";
  try {
    const result = await getTuitions({
      query,
      subject,
      location: locationFilter,
      className: classFilter,
      mode: modeFilter,
      page: currentPage,
      limit: 6,
    });
    tuitions = result.data;
    pagination = result.pagination;
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load tuition listings. Please try again.";
  }
  const safePage = pagination.page;

  const buildHref = (
    page: number,
    overrides?: { subject?: string; location?: string; className?: string; mode?: string },
  ) => {
    const nextSubject = overrides?.subject ?? subject;
    const nextLocation = overrides?.location ?? locationFilter;
    const nextClass = overrides?.className ?? classFilter;
    const nextMode = overrides?.mode ?? modeFilter;
    const search = new URLSearchParams();
    if (query) search.set("query", query);
    if (nextSubject) search.set("subject", nextSubject);
    if (nextLocation) search.set("location", nextLocation);
    if (nextClass) search.set("className", nextClass);
    if (nextMode) search.set("mode", nextMode);
    if (page > 1) search.set("page", String(page));
    const queryString = search.toString();
    return `/tuitions${queryString ? `?${queryString}` : ""}`;
  };

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
            {locationFilter && <input type="hidden" name="location" value={locationFilter} />}
            {classFilter && <input type="hidden" name="className" value={classFilter} />}
            {modeFilter && <input type="hidden" name="mode" value={modeFilter} />}
            <Button type="submit" size="lg" className="h-11">
              Search
              <ArrowRight />
            </Button>
          </form>

          {(query || subject || locationFilter || classFilter || modeFilter) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active search:</span>
              {subject && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{subject}</span>}
              {query && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{query}</span>}
              {locationFilter && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{locationFilter}</span>}
              {classFilter && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{classFilter}</span>}
              {modeFilter && <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{modeFilter}</span>}
              <Link href="/tuitions" className="ml-1 underline underline-offset-4">
                Clear
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form action="/tuitions" className="mb-7 grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Subject
              <input
                name="subject"
                defaultValue={subject}
                placeholder="Any subject"
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Location
              <input
                name="location"
                defaultValue={locationFilter}
                placeholder="Any location"
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Class level
              <input
                name="className"
                defaultValue={classFilter}
                placeholder="Any class level"
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Tuition mode
              <select
                name="mode"
                defaultValue={modeFilter}
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                <option value="">Any mode</option>
                <option value="Online">Online</option>
                <option value="At student home">At student home</option>
                <option value="At tutor home">At tutor home</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>
            {query && <input type="hidden" name="query" value={query} />}
            <Button type="submit" className="h-10 self-end">
              Apply filters
            </Button>
          </form>

          {!errorMessage && (
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {pagination.total} tuition{pagination.total === 1 ? "" : "s"} found
              </h2>
            </div>
          )}

          {errorMessage ? (
            <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <h3 className="text-lg font-bold">Unable to load tuition listings</h3>
              <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          ) : tuitions.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {tuitions.map((tuition) => (
                  <article
                    key={tuition.id}
                    className="flex flex-col rounded-2xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {tuition.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">{tuition.className || "All levels"}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{tuition.title}</h3>
                    <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        {tuition.location || "Location not specified"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Wallet className="size-4 text-primary" />
                        {tuition.budget == null
                          ? "Negotiable"
                          : `${new Intl.NumberFormat("en-BD").format(tuition.budget)} BDT/month`}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="size-4 text-primary" />
                        {tuition.schedule || tuition.mode || "Schedule negotiable"}
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

              {pagination.totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Tuition pages">
                  <Link
                    href={buildHref(Math.max(1, safePage - 1))}
                    aria-disabled={safePage === 1}
                    className={`rounded-lg border px-3 py-2 text-sm ${safePage === 1 ? "pointer-events-none opacity-50" : "hover:bg-muted"}`}
                  >
                    Previous
                  </Link>
                  {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
                    <Link
                      key={page}
                      href={buildHref(page)}
                      aria-current={safePage === page ? "page" : undefined}
                      className={`size-9 rounded-lg border text-center text-sm leading-9 ${
                        safePage === page ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                  <Link
                    href={buildHref(Math.min(pagination.totalPages, safePage + 1))}
                    aria-disabled={safePage === pagination.totalPages}
                    className={`rounded-lg border px-3 py-2 text-sm ${safePage === pagination.totalPages ? "pointer-events-none opacity-50" : "hover:bg-muted"}`}
                  >
                    Next
                  </Link>
                </nav>
              )}
            </>
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
