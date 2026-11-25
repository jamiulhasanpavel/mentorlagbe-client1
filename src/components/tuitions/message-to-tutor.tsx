"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Mail, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function MessageToTutor({
  tutorId,
  tutorName,
}: {
  tutorId: string;
  tutorName: string;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (subject.trim().length < 2 || message.trim().length < 10) {
      setErrorMessage("Enter a subject and a message with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, subject, message }),
      });
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        setErrorMessage(`Message service returned an unreadable response (${response.status}).`);
        return;
      }

      if (!response.ok || !isRecord(body) || body.success !== true) {
        setErrorMessage(
          isRecord(body) && typeof body.message === "string"
            ? body.message
            : "Unable to send your message. Please try again.",
        );
        return;
      }

      setSuccessMessage(`Your message was sent to ${tutorName}.`);
      setSubject("");
      setMessage("");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send your message.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending) {
    return <Button className="mt-6 w-full" disabled>Checking account…</Button>;
  }

  if (!session) {
    return (
      <Link
        href={`/sign-in?callbackURL=${encodeURIComponent(`/tutors/${tutorId}`)}`}
        className="mt-6 block"
      >
        <Button className="w-full">
          <Mail />
          Sign in to message
        </Button>
      </Link>
    );
  }

  if (session.user.role !== "student") {
    return (
      <p className="mt-6 rounded-lg border bg-background p-3 text-sm text-muted-foreground">
        Only student accounts can message tutors.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <Button
        type="button"
        className="w-full"
        aria-expanded={isOpen}
        aria-controls="message-to-tutor-form"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X /> : <Mail />}
        {isOpen ? "Close message form" : "Message to the Tutor"}
      </Button>

      {isOpen && (
        <form
          id="message-to-tutor-form"
          onSubmit={handleSubmit}
          className="mt-4 space-y-4 rounded-xl border bg-background p-4"
        >
          <div>
            <h2 className="font-semibold">Message {tutorName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your message and any reply will be available in your dashboard.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Tutor
            <input
              value={tutorName}
              readOnly
              className="h-10 rounded-lg border bg-muted/40 px-3 text-sm font-normal"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Subject
            <input
              required
              minLength={2}
              maxLength={150}
              value={subject}
              onChange={(event) => setSubject(event.currentTarget.value)}
              className="h-10 rounded-lg border bg-background px-3 text-sm font-normal outline-none focus:ring-3 focus:ring-ring/30"
              placeholder="What would you like to discuss?"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Message
            <textarea
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              className="resize-y rounded-lg border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-3 focus:ring-ring/30"
              placeholder="Write your message to the tutor."
            />
          </label>
          {errorMessage && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}
