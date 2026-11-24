import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
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
    gender: "Any",
    mode: "At student home",
    posted: "2 hours ago",
    description:
      "A responsible and experienced Class 8 Mathematics tutor is needed for a student in Dhanmondi. The tutor should be able to explain fundamentals clearly, provide regular practice, and prepare the student for weekly tests.",
  },
  {
    id: "hsc-physics-banani",
    title: "HSC Physics Part-Time Tuition",
    location: "Banani, Dhaka",
    subject: "Physics",
    className: "HSC",
    salary: "12,000 BDT/month",
    schedule: "4 days/week",
    gender: "Any",
    mode: "At student home",
    posted: "5 hours ago",
    description:
      "Seeking a knowledgeable HSC Physics tutor for problem-solving and board exam preparation. The ideal tutor will maintain a structured study plan and provide chapter-based assessment.",
  },
  {
    id: "english-speaking-mirpur",
    title: "Spoken English for Professionals",
    location: "Mirpur, Dhaka",
    subject: "English",
    className: "Professional",
    salary: "10,000 BDT/month",
    schedule: "Flexible",
    gender: "Any",
    mode: "Online",
    posted: "Yesterday",
    description:
      "A professional learner is looking for an English tutor to improve workplace communication, pronunciation, interview skills, and speaking confidence.",
  },
  {
    id: "class-10-science-uttara",
    title: "SSC Science Group Tutor",
    location: "Uttara, Dhaka",
    subject: "Science",
    className: "SSC",
    salary: "11,000 BDT/month",
    schedule: "3 days/week",
    gender: "Female preferred",
    mode: "At student home",
    posted: "Yesterday",
    description:
      "An SSC Science student needs guidance across Physics, Chemistry, and General Science. The tutor should help with textbook practice and preparation for school and board examinations.",
  },
  {
    id: "javascript-developer-gulshan",
    title: "Frontend Development Mentor",
    location: "Gulshan, Dhaka",
    subject: "Programming",
    className: "Advanced",
    salary: "18,000 BDT/month",
    schedule: "2 days/week",
    gender: "Any",
    mode: "Online",
    posted: "2 days ago",
    description:
      "Looking for a frontend mentor experienced in JavaScript, React, responsive design, and portfolio projects. Practical mentoring and code review experience will be considered.",
  },
  {
    id: "admission-biology-mohammadpur",
    title: "Medical Admission Biology Tuition",
    location: "Mohammadpur, Dhaka",
    subject: "Biology",
    className: "Admission",
    salary: "15,000 BDT/month",
    schedule: "4 days/week",
    gender: "Any",
    mode: "At tutor home",
    posted: "2 days ago",
    description:
      "Admission candidate seeking Biology tuition focused on admission test preparation, model tests, and efficient revision of HSC Biology topics.",
  },
  {
    id: "class-9-chemistry-bashundhara",
    title: "Class 9 Chemistry Home Tutor",
    location: "Bashundhara, Dhaka",
    subject: "Chemistry",
    className: "Class 9",
    salary: "9,500 BDT/month",
    schedule: "3 days/week",
    gender: "Any",
    mode: "At student home",
    posted: "3 days ago",
    description:
      "A Class 9 student needs a Chemistry tutor for conceptual lessons, numerical practice, and regular academic support.",
  },
  {
    id: "ielts-preparation-gulshan",
    title: "IELTS Preparation Tutor",
    location: "Gulshan, Dhaka",
    subject: "English",
    className: "Professional",
    salary: "16,000 BDT/month",
    schedule: "Flexible",
    gender: "Any",
    mode: "Online",
    posted: "3 days ago",
    description:
      "An IELTS candidate needs focused coaching for speaking and writing modules, with mock tests and actionable feedback.",
  },
  {
    id: "primary-bangla-uttara",
    title: "Primary Level Bangla Tutor",
    location: "Uttara, Dhaka",
    subject: "Bangla",
    className: "Primary",
    salary: "7,500 BDT/month",
    schedule: "5 days/week",
    gender: "Female preferred",
    mode: "At student home",
    posted: "4 days ago",
    description:
      "A primary-level student needs patient Bangla tutoring to improve reading, writing, spelling, and grammar skills.",
  },
];

export function generateStaticParams() {
  return tuitions.map((tuition) => ({ id: tuition.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tuition = tuitions.find((item) => item.id === id);
  return {
    title: tuition ? `${tuition.title} | MentorLagbe` : "Tuition Not Found | MentorLagbe",
  };
}

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tuition = tuitions.find((item) => item.id === id);

  if (!tuition) {
    notFound();
  }

  return (
    <main className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to tuitions
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="rounded-2xl border bg-background p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {tuition.subject}
              </span>
              <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                {tuition.className}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">Posted {tuition.posted}</span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {tuition.title}
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetailItem icon={MapPin} label="Location" value={tuition.location} />
              <DetailItem icon={Wallet} label="Salary" value={tuition.salary} />
              <DetailItem icon={Clock3} label="Schedule" value={tuition.schedule} />
              <DetailItem icon={BadgeCheck} label="Tuition type" value={tuition.mode} />
            </div>

            <div className="mt-8 border-t pt-7">
              <h2 className="text-xl font-bold">About this tuition</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{tuition.description}</p>
            </div>

            <div className="mt-8 grid gap-4 border-t pt-7 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred tutor</p>
                <p className="mt-2 flex items-center gap-2 font-medium">
                  <UserRound className="size-4 text-primary" />
                  {tuition.gender}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification</p>
                <p className="mt-2 flex items-center gap-2 font-medium">
                  <ShieldCheck className="size-4 text-primary" />
                  Guardian profile verified
                </p>
              </div>
            </div>
          </article>

          <aside className="h-fit rounded-2xl border bg-muted/20 p-6 lg:sticky lg:top-24">
            <p className="text-sm text-muted-foreground">Monthly tuition fee</p>
            <p className="mt-1 text-3xl font-bold">{tuition.salary}</p>
            <p className="mt-2 text-sm text-muted-foreground">{tuition.schedule}</p>

            <Link href="/sign-in" className="mt-6 block">
              <Button className="w-full" size="lg">
                Apply for this tuition
              </Button>
            </Link>
            <Link
              href="/sign-in"
              className="mt-3 flex h-9 items-center justify-center rounded-lg border text-sm font-medium hover:bg-background"
            >
              Save tuition
            </Link>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Sign in to submit your application and contact the guardian.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}
