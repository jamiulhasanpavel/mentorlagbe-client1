export type DashboardMessageReply = {
  senderId: string;
  message: string;
  createdAt: string;
};

export type DashboardMessage = {
  id: string;
  senderId: string;
  senderName: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  replies: DashboardMessageReply[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMessageReply(value: unknown): value is DashboardMessageReply {
  return (
    isRecord(value) &&
    typeof value.senderId === "string" &&
    typeof value.message === "string" &&
    typeof value.createdAt === "string"
  );
}

export function isDashboardMessage(value: unknown): value is DashboardMessage {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.senderId === "string" &&
    typeof value.senderName === "string" &&
    typeof value.tutorId === "string" &&
    typeof value.tutorName === "string" &&
    typeof value.subject === "string" &&
    typeof value.message === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    Array.isArray(value.replies) &&
    value.replies.every(isMessageReply)
  );
}
