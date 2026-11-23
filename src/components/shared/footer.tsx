import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-lg font-bold">
            Mentor<span className="text-primary">Lagbe</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connecting learners with qualified mentors.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <Link href="/tuitions" className="hover:text-foreground">Tuitions</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
        </nav>
      </div>
    </footer>
  );
}
