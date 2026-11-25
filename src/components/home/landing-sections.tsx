import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Compass,
  GraduationCap,
  MessageCircle,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { pricingPlans } from "@/features/payments/plans";

const steps = [
  {
    title: "Create Your Account",
    description:
      "Sign up as a Student to find mentors or as a Tutor to offer your academic expertise.",
    icon: GraduationCap,
  },
  {
    title: "Browse & Discover",
    description:
      "Explore verified tuitions filtered by subject, class level, location, and learning mode.",
    icon: Compass,
  },
  {
    title: "Apply & Connect",
    description:
      "Submit applications with your preferred schedule and communicate directly with tutors.",
    icon: MessageCircle,
  },
  {
    title: "Start Learning",
    description:
      "Begin your personalized tuition sessions and achieve your academic goals with confidence.",
    icon: BookOpenCheck,
  },
];

const testimonials = [
  {
    quote:
      "I found a great BUET math mentor through MentorLagbe in just a few days. Verified profiles and simple scheduling made arranging lessons feel easy and reassuring.",
    name: "Mahir Rahman",
    detail: "HSC Candidate, Dhaka College",
  },
  {
    quote:
      "I was looking for extra practice in IELTS writing and speaking. My mentor's thoughtful feedback helped me raise my overall score from 6.5 to 8.0!",
    name: "Nabila Tasnim",
    detail: "IELTS Student, Score 8.0",
  },
  {
    quote:
      "Posting my programming tuition with MentorLagbe Pro helped me reach more students. The dashboard also makes reviewing applications straightforward.",
    name: "Rafiul Islam",
    detail: "Computer Science Undergrad",
  },
];

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

export function HomePricing() {
  return (
    <section className="border-y bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Pricing"
          title="Choose Your Plan"
          description="Simple, transparent plans designed for committed students and ambitious academic tutors."
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`color-animated-border relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm ${
                plan.recommended ? "border-primary shadow-lg md:-translate-y-2" : ""
              }`}
            >
              {plan.recommended && (
                <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Recommended
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>
              <p className="mt-5 text-4xl font-bold tracking-tight">
                {plan.price}
                {plan.amount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                )}
              </p>
              {plan.amount === 0 && (
                <p className="mt-1 text-sm font-medium text-primary">Free forever</p>
              )}
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.amount > 0 ? `/payment/checkout?plan=${plan.id}` : "/sign-up"}
                className="mt-8"
              >
                <span
                  className={buttonVariants({
                    variant: plan.recommended ? "default" : "outline",
                    className: "color-animated-border w-full",
                  })}
                >
                  {plan.amount > 0 ? "Choose plan" : "Get started free"}
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="How It Works"
          title="Start Learning in 4 Easy Steps"
          description="From profile setup to your first live session, we make connecting with verified mentors seamless."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className="color-animated-border rounded-2xl border bg-background p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-muted/25 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Student Feedback"
          title="Trusted by Thousands Across Bangladesh"
          description="Read real stories from students and mentors accelerating their learning on MentorLagbe."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map(({ quote, name, detail }) => (
            <figure key={name} className="color-animated-border flex h-full flex-col rounded-2xl border bg-background p-6">
              <div className="flex gap-1 text-amber-400" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-sm leading-7 text-muted-foreground">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span>
                  <span className="block font-semibold">{name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCallToAction() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/75">
            Get Started Today
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-foreground/80">
            Join students and tutors across Bangladesh. Post tuitions, discover academic mentors,
            and take the next step.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sign-up">
              <span className={buttonVariants({ variant: "secondary", size: "lg", className: "color-animated-border w-full sm:w-auto" })}>
                Join as Student
                <ArrowRight />
              </span>
            </Link>
            <Link href="/sign-up">
              <span className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "color-animated-border w-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto",
              })}>
                Join as Tutor
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
