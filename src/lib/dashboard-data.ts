import { headers } from "next/headers";
import { getBackendApiUrl } from "@/lib/backend-url";
import type { Tuition } from "@/lib/tuitions";
import {
  isDashboardMessage,
  type DashboardMessage,
} from "@/lib/messages";

export type DashboardApplication = {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
  studentId?: string;
};

export type AdminDashboardData = {
  role: "admin";
  stats: {
    users: number;
    totalTuitions: number;
    pendingTuitions: number;
    approvedTuitions: number;
    applications: number;
    paidPayments: number;
    revenue: number;
  };
};

export type StudentDashboardData = {
  role: "student";
  plan: "free" | "student-plus" | "tutor-pro";
  planStatus: "inactive" | "active" | "past_due" | "canceled";
  stats: {
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
  };
  recentApplications: DashboardApplication[];
};

export type TutorDashboardData = {
  role: "tutor";
  plan: "free" | "student-plus" | "tutor-pro";
  planStatus: "inactive" | "active" | "past_due" | "canceled";
  stats: {
    totalTuitions: number;
    activeTuitions: number;
    pendingTuitions: number;
    totalApplicants: number;
    pendingApplications: number;
  };
  recentApplications: DashboardApplication[];
};

export type DashboardData =
  | AdminDashboardData
  | StudentDashboardData
  | TutorDashboardData;

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "student" | "tutor" | "admin";
  createdAt?: string;
};

export type AdminPayment = {
  id: string;
  stripeSessionId?: string;
  stripeInvoiceId?: string;
  stripeSubscriptionId?: string | null;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPlan(value: unknown): value is StudentDashboardData["plan"] {
  return ["free", "student-plus", "tutor-pro"].includes(String(value));
}

function isPlanStatus(value: unknown): value is StudentDashboardData["planStatus"] {
  return ["inactive", "active", "past_due", "canceled"].includes(String(value));
}

function isApplication(value: unknown): value is DashboardApplication {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.tuitionId === "string" &&
    typeof value.tuitionTitle === "string" &&
    ["pending", "accepted", "rejected"].includes(String(value.status)) &&
    typeof value.message === "string" &&
    typeof value.createdAt === "string"
  );
}

async function getApiData(path: string): Promise<unknown> {
  const apiBaseUrl = getBackendApiUrl();
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Backend returned an unreadable response (${response.status}).`);
  }

  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : `Backend returned ${response.status}.`;
    throw new Error(message);
  }
  if (!isRecord(body) || body.success !== true || !("data" in body)) {
    throw new Error("Backend returned an invalid response.");
  }
  return body.data;
}

export async function getDashboardData(): Promise<DashboardData> {
  const data = await getApiData("/api/dashboard");
  if (!isRecord(data) || !isRecord(data.stats)) {
    throw new Error("Dashboard data is invalid.");
  }

  if (
    data.role === "admin" &&
    isNumber(data.stats.users) &&
    isNumber(data.stats.totalTuitions) &&
    isNumber(data.stats.pendingTuitions) &&
    isNumber(data.stats.approvedTuitions) &&
    isNumber(data.stats.applications) &&
    isNumber(data.stats.paidPayments) &&
    isNumber(data.stats.revenue)
  ) {
    return { role: "admin", stats: data.stats as AdminDashboardData["stats"] };
  }

  if (
    data.role === "student" &&
    isPlan(data.plan) &&
    isPlanStatus(data.planStatus) &&
    isNumber(data.stats.totalApplications) &&
    isNumber(data.stats.pendingApplications) &&
    isNumber(data.stats.acceptedApplications) &&
    Array.isArray(data.recentApplications) &&
    data.recentApplications.every(isApplication)
  ) {
    return {
      role: "student",
      plan: data.plan,
      planStatus: data.planStatus,
      stats: data.stats as StudentDashboardData["stats"],
      recentApplications: data.recentApplications,
    };
  }

  if (
    data.role === "tutor" &&
    isPlan(data.plan) &&
    isPlanStatus(data.planStatus) &&
    isNumber(data.stats.totalTuitions) &&
    isNumber(data.stats.activeTuitions) &&
    isNumber(data.stats.pendingTuitions) &&
    isNumber(data.stats.totalApplicants) &&
    isNumber(data.stats.pendingApplications) &&
    Array.isArray(data.recentApplications) &&
    data.recentApplications.every(isApplication)
  ) {
    return {
      role: "tutor",
      plan: data.plan,
      planStatus: data.planStatus,
      stats: data.stats as TutorDashboardData["stats"],
      recentApplications: data.recentApplications,
    };
  }

  throw new Error("Dashboard data does not match the signed-in account role.");
}

export async function getStudentApplications(): Promise<DashboardApplication[]> {
  const data = await getApiData("/api/applications/me");
  if (!Array.isArray(data) || !data.every(isApplication)) {
    throw new Error("Application service returned an invalid list.");
  }
  return data;
}

export async function getStudentMessages(): Promise<DashboardMessage[]> {
  const data = await getApiData("/api/messages/me");
  if (!Array.isArray(data) || !data.every(isDashboardMessage)) {
    throw new Error("Message service returned an invalid inbox.");
  }
  return data;
}

export async function getTutorApplications(): Promise<DashboardApplication[]> {
  const data = await getApiData("/api/applications/tutor");
  if (!Array.isArray(data) || !data.every(isApplication)) {
    throw new Error("Application service returned an invalid list.");
  }
  return data;
}

export async function getTutorMessages(): Promise<DashboardMessage[]> {
  const data = await getApiData("/api/messages/tutor");
  if (!Array.isArray(data) || !data.every(isDashboardMessage)) {
    throw new Error("Message service returned an invalid inbox.");
  }
  return data;
}

function isTuition(value: unknown): value is Tuition {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.subject === "string" &&
    (value.budget === undefined || typeof value.budget === "number")
  );
}

export async function getTutorTuitions(): Promise<Tuition[]> {
  const data = await getApiData("/api/tuition/mine");
  if (!Array.isArray(data) || !data.every(isTuition)) {
    throw new Error("Tuition service returned an invalid list.");
  }
  return data;
}

export async function getAdminTuitions(status: "pending" | "approved" | "rejected") {
  const data = await getApiData(`/api/tuition?status=${status}&limit=100`);
  if (
    !isRecord(data) ||
    !Array.isArray(data.data) ||
    !data.data.every(isTuition) ||
    !isRecord(data.pagination) ||
    !isNumber(data.pagination.total)
  ) {
    throw new Error("Tuition service returned an invalid moderation list.");
  }
  return { data: data.data, total: data.pagination.total };
}

export async function getAdminUsers(): Promise<{ data: AdminUser[]; total: number }> {
  const data = await getApiData("/api/users/admin?limit=100");
  if (
    !isRecord(data) ||
    !Array.isArray(data.data) ||
    !data.data.every(
      (user) =>
        isRecord(user) &&
        typeof user.id === "string" &&
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        ["student", "tutor", "admin"].includes(String(user.role)),
    ) ||
    !isRecord(data.pagination) ||
    !isNumber(data.pagination.total)
  ) {
    throw new Error("User service returned an invalid admin list.");
  }

  return {
    data: data.data.map((user) => ({
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
      role: user.role as AdminUser["role"],
      ...(typeof user.image === "string" || user.image === null
        ? { image: user.image }
        : {}),
      ...(typeof user.createdAt === "string" ? { createdAt: user.createdAt } : {}),
    })),
    total: data.pagination.total,
  };
}

export async function getAdminPayments(): Promise<{ data: AdminPayment[]; total: number }> {
  const data = await getApiData("/api/payments/admin?limit=100");
  if (
    !isRecord(data) ||
    !Array.isArray(data.data) ||
    !data.data.every(
      (payment) =>
        isRecord(payment) &&
        typeof payment.id === "string" &&
        (typeof payment.stripeSessionId === "string" ||
          typeof payment.stripeInvoiceId === "string") &&
        typeof payment.userId === "string" &&
        typeof payment.planId === "string" &&
        isNumber(payment.amount) &&
        typeof payment.currency === "string" &&
        typeof payment.status === "string",
    ) ||
    !isRecord(data.pagination) ||
    !isNumber(data.pagination.total)
  ) {
    throw new Error("Payment service returned an invalid admin list.");
  }

  return {
    data: data.data.map((payment) => ({
      id: payment.id as string,
      ...(typeof payment.stripeSessionId === "string"
        ? { stripeSessionId: payment.stripeSessionId }
        : {}),
      ...(typeof payment.stripeInvoiceId === "string"
        ? { stripeInvoiceId: payment.stripeInvoiceId }
        : {}),
      ...(typeof payment.stripeSubscriptionId === "string" || payment.stripeSubscriptionId === null
        ? { stripeSubscriptionId: payment.stripeSubscriptionId }
        : {}),
      userId: payment.userId as string,
      planId: payment.planId as string,
      amount: payment.amount as number,
      currency: payment.currency as string,
      status: payment.status as string,
      ...(typeof payment.createdAt === "string" ? { createdAt: payment.createdAt } : {}),
    })),
    total: data.pagination.total,
  };
}
