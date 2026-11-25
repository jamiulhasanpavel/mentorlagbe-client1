import "server-only";

export function getBackendApiUrl() {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl && process.env.NODE_ENV === "production") {
    throw new Error("BACKEND_API_URL must be configured for production.");
  }

  return (backendApiUrl || "http://localhost:5000").replace(/\/+$/, "");
}
