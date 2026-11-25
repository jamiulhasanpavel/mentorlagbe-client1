"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { isDashboardMessage, type DashboardMessage } from "@/lib/messages";

export function MessageInbox({
  initialMessages,
  role,
}: {
  initialMessages: DashboardMessage[];
  role: "student" | "tutor";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function sendReply(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const reply = (drafts[id] || "").trim();
    setErrorMessage("");
    setSuccessMessage("");
    if (reply.length < 10) {
      setErrorMessage("Replies must be at least 10 characters.");
      return;
    }

    setBusyId(id);
    try {
      const response = await fetch(`/api/messages/${id}/replies`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
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
            : "Unable to send your reply. Please try again.",
        );
        return;
      }
      const updatedMessage = body.data;
      if (!isDashboardMessage(updatedMessage)) {
        setErrorMessage("Message service returned an invalid thread.");
        return;
      }

      setMessages((current) =>
        current.map((item) => (item.id === id ? updatedMessage : item)),
      );
      setDrafts((current) => ({ ...current, [id]: "" }));
      setSuccessMessage("Your reply was sent.");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send your reply.",
      );
    } finally {
      setBusyId("");
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed px-5 py-14 text-center">
        <h2 className="text-lg font-bold">No messages yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {role === "tutor"
            ? "Messages from students will appear here."
            : "Messages you send to tutors and their replies will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      {messages.map((item) => (
        <article key={item.id} className="rounded-2xl border bg-background p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {role === "tutor" ? `From ${item.senderName}` : `To ${item.tutorName}`}
              </p>
              <h2 className="mt-1 text-lg font-bold">{item.subject}</h2>
            </div>
            <time className="text-xs text-muted-foreground" dateTime={item.createdAt}>
              {new Date(item.createdAt).toLocaleString()}
            </time>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{item.message}</p>

          {item.replies.length > 0 && (
            <section className="mt-5 space-y-3 border-l-2 border-primary/30 pl-4">
              <h3 className="text-sm font-semibold">Replies</h3>
              {item.replies.map((reply, index) => (
                <div key={`${reply.createdAt}-${index}`} className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs font-semibold text-primary">
                    {role === "tutor" ? "Your reply" : `Reply from ${item.tutorName}`}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                    {reply.message}
                  </p>
                  <time className="mt-2 block text-xs text-muted-foreground" dateTime={reply.createdAt}>
                    {new Date(reply.createdAt).toLocaleString()}
                  </time>
                </div>
              ))}
            </section>
          )}

          {role === "tutor" && (
            <form onSubmit={(event) => sendReply(event, item.id)} className="mt-5 space-y-3 border-t pt-5">
              <label className="grid gap-2 text-sm font-medium">
                Reply to {item.senderName}
                <textarea
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={4}
                  value={drafts[item.id] || ""}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [item.id]: event.currentTarget.value,
                    }))
                  }
                  className="resize-y rounded-lg border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-3 focus:ring-ring/30"
                  placeholder="Write a reply to the student."
                />
              </label>
              <Button type="submit" disabled={busyId === item.id}>
                {busyId === item.id ? "Sending reply…" : "Send reply"}
              </Button>
            </form>
          )}
        </article>
      ))}
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
