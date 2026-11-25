import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/shared/brand";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Find your perfect tutor or share your expertise with students across Bangladesh.
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="font-semibold">Quick Links</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-primary">Home</Link></li>
            <li><Link href="/tuitions" className="transition-colors hover:text-primary">Browse Tuitions</Link></li>
            <li><Link href="/pricing" className="transition-colors hover:text-primary">Pricing</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-primary">About</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-semibold">Contact Info</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href="mailto:mentorlagbe@gmail.com" className="hover:text-primary">
                mentorlagbe@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="tel:+8801500000000" className="hover:text-primary">
                +880-1500-000000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Connect With Us</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Follow our social channels for study tips, tutor highlights, and updates.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {[
              ["Facebook", "https://facebook.com"],
              ["X", "https://x.com"],
              ["Instagram", "https://instagram.com"],
              ["LinkedIn", "https://linkedin.com"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-primary"
              >
                {label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© MentorLagbe. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/pricing" className="hover:text-primary">Pricing</Link>
            <Link href="/tuitions" className="hover:text-primary">Tuitions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
