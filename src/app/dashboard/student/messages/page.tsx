import { MessageInbox } from "@/components/dashboard/message-inbox";
import { getStudentMessages } from "@/lib/dashboard-data";

export default async function StudentMessagesPage() {
  const messages = await getStudentMessages();

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Student workspace</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Messages</h1>
      <p className="mt-2 text-muted-foreground">
        View your messages to tutors and any replies they send.
      </p>
      <section className="mt-8" aria-label="Your messages">
        <MessageInbox initialMessages={messages} role="student" />
      </section>
    </div>
  );
}
