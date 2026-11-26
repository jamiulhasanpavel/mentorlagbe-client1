import { getBackendApiUrl } from "@/lib/backend-url";
import { formatTuitionBudget } from "@/lib/format-tuition-budget";

export { formatTuitionBudget };

export type Tuition = {
  id: string;
  title: string;
  subject: string;
  description?: string;
  location?: string;
  budget?: number | null;
  className?: string;
  schedule?: string;
  daysPerWeek?: number;
  bannerImage?: string;
  mode?: string;
  gender?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  userId?: string;
};

export type TuitionFilters = {
  query?: string;
  subject?: string;
  location?: string;
  className?: string;
  mode?: string;
  page?: number;
  limit?: number;
};

export type TuitionList = {
  data: Tuition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class TuitionApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TuitionApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTuition(value: unknown): value is Tuition {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.subject === "string" &&
    (value.budget === undefined || value.budget === null || typeof value.budget === "number") &&
    (value.daysPerWeek === undefined || typeof value.daysPerWeek === "number") &&
    (value.bannerImage === undefined || typeof value.bannerImage === "string")
  );
}

function getApiBaseUrl() {
  return getBackendApiUrl();
}

async function getResponseMessage(response: Response) {
  try {
    const body: unknown = await response.json();
    if (isRecord(body) && typeof body.message === "string") return body.message;
  } catch {
    return `Tuition service returned ${response.status}.`;
  }
  return `Tuition service returned ${response.status}.`;
}

export async function getTuitions(filters: TuitionFilters = {}): Promise<TuitionList> {
  const search = new URLSearchParams();
  if (filters.query) search.set("search", filters.query);
  if (filters.subject) search.set("subject", filters.subject);
  if (filters.location) search.set("location", filters.location);
  if (filters.className) search.set("className", filters.className);
  if (filters.mode) search.set("mode", filters.mode);
  search.set("page", String(filters.page ?? 1));
  search.set("limit", String(filters.limit ?? 6));

  const response = await fetch(`${getApiBaseUrl()}/api/tuition?${search.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new TuitionApiError(await getResponseMessage(response), response.status);
  }

  const body: unknown = await response.json();
  if (
    !isRecord(body) ||
    body.success !== true ||
    !Array.isArray(body.data) ||
    !body.data.every(isTuition) ||
    !isRecord(body.pagination) ||
    typeof body.pagination.page !== "number" ||
    typeof body.pagination.limit !== "number" ||
    typeof body.pagination.total !== "number" ||
    typeof body.pagination.totalPages !== "number"
  ) {
    throw new TuitionApiError("Tuition service returned an invalid listing.", response.status);
  }

  return {
    data: body.data,
    pagination: {
      page: body.pagination.page,
      limit: body.pagination.limit,
      total: body.pagination.total,
      totalPages: body.pagination.totalPages,
    },
  };
}

export async function getTuition(id: string): Promise<Tuition> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/tuition/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new TuitionApiError(await getResponseMessage(response), response.status);
  }

  const body: unknown = await response.json();
  if (!isRecord(body) || body.success !== true || !isTuition(body.data)) {
    throw new TuitionApiError("Tuition service returned an invalid record.", response.status);
  }
  return body.data;
}
