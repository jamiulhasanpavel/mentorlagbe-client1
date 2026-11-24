import Link from "next/link";
import {
  Atom,
  BookOpenText,
  Calculator,
  FlaskConical,
  Languages,
  Laptop,
} from "lucide-react";

const subjects = [
  { name: "Mathematics", count: 248, icon: Calculator },
  { name: "Science", count: 196, icon: Atom },
  { name: "English", count: 184, icon: Languages },
  { name: "Physics", count: 132, icon: FlaskConical },
  { name: "Programming", count: 118, icon: Laptop },
  { name: "General", count: 342, icon: BookOpenText },
];

export function PopularSubjects() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Explore subjects
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Popular learning categories
          </h2>
          <p className="mt-4 text-muted-foreground">
            Browse tuition opportunities by the subject you want to learn or teach.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subjects.map(({ name, count, icon: Icon }) => (
            <Link
              key={name}
              href={`/tuitions?subject=${encodeURIComponent(name)}`}
              className="group rounded-2xl border bg-background p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" />
              </span>
              <p className="mt-4 font-semibold">{name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{count} tuitions</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
