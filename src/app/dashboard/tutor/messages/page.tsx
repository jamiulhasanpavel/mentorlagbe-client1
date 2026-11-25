import { MessageInbox } from "@/components/dashboard/message-inbox";
import { getTutorMessages } from "@/lib/dashboard-data";

export default async function TutorMessagesPage() {
  const messages = await getTutorMessages();

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Tutor workspace</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Student messages</h1>
      <p className="mt-2 text-muted-foreground">
        Read private messages sent to you and reply directly to each student.
      </p>
      <section className="mt-8" aria-label="Messages from students">
        <MessageInbox initialMessages={messages} role="tutor" />
      </section>
    </div>
  );
}
