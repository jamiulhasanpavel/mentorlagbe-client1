import { getBackendApiUrl } from "@/lib/backend-url";

export type TutorProfile = {
  id: string;
  name: string;
  image?: string | null;
  bio?: string;
  bannerImage?: string | null;
};

export class TutorProfileApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TutorProfileApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTutorProfile(value: unknown): value is TutorProfile {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.image === undefined || value.image === null || typeof value.image === "string") &&
    (value.bio === undefined || typeof value.bio === "string") &&
    (value.bannerImage === undefined ||
      value.bannerImage === null ||
      typeof value.bannerImage === "string")
  );
}

export async function getTutorProfile(id: string): Promise<TutorProfile> {
  const apiBaseUrl = getBackendApiUrl();
  const response = await fetch(
    `${apiBaseUrl}/api/users/tutors/${encodeURIComponent(id)}/profile`,
    { cache: "no-store" },
  );

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new TutorProfileApiError(
      `Tutor service returned an unreadable response (${response.status}).`,
      response.status,
    );
  }

  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : `Tutor service returned ${response.status}.`;
    throw new TutorProfileApiError(message, response.status);
  }
  if (!isRecord(body) || body.success !== true || !isTutorProfile(body.data)) {
    throw new TutorProfileApiError(
      "Tutor service returned an invalid profile.",
      response.status,
    );
  }

  return body.data;
}
