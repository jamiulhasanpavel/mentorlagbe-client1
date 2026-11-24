export default function Loading() {
  return (
    <main
      className="mx-auto min-h-[60vh] w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded bg-muted" />
      <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl border bg-muted/30"
          />
        ))}
      </div>
      <span className="sr-only">Loading content</span>
    </main>
  );
}
