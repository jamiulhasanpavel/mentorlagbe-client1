"use client";

import { useState } from "react";
import Link from "next/link";
import type { AdminUser } from "@/lib/dashboard-data";

export function AdminUserList({
  users,
  total,
  currentUserId,
  page,
  totalPages,
}: {
  users: AdminUser[];
  total: number;
  currentUserId: string;
  page: number;
  totalPages: number;
}) {
  const [items, setItems] = useState(users);
  const [busyId, setBusyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function updateRole(userId: string, role: AdminUser["role"]) {
    setBusyId(userId);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`/api/users/admin/${userId}/role`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const body: unknown = await response.json();
      const result =
        typeof body === "object" && body !== null
          ? (body as Record<string, unknown>)
          : null;

      if (!response.ok || result?.success !== true) {
        setErrorMessage(
          typeof result?.message === "string" ? result.message : "Unable to update user role.",
        );
        return;
      }

      setItems((current) =>
        current.map((user) => (user.id === userId ? { ...user, role } : user)),
      );
      setSuccessMessage("User role updated.");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update user role.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {items.length} of {total} user{total === 1 ? "" : "s"}.
      </p>
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
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((user) => (
            <article key={user.id} className="flex flex-col gap-4 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{user.name}</h2>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                {user.createdAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`role-${user.id}`}>
                  Role
                </label>
                <select
                  id={`role-${user.id}`}
                  value={user.role}
                  disabled={busyId === user.id || user.id === currentUserId}
                  onChange={(event) => {
                    const role = event.currentTarget.value;
                    if (role === "student" || role === "tutor" || role === "admin") {
                      void updateRole(user.id, role);
                    }
                  }}
                  className="h-9 rounded-lg border bg-background px-3 text-sm"
                  aria-label={`Role for ${user.email}`}
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No users found.
        </div>
      )}
      {totalPages > 1 && (
        <nav aria-label="User pages" className="flex items-center justify-between border-t pt-4">
          <Link
            href={`/dashboard/admin/users?page=${Math.max(1, page - 1)}`}
            aria-disabled={page <= 1}
            className={`rounded-lg border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-muted"}`}
          >
            Previous
          </Link>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/dashboard/admin/users?page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page >= totalPages}
            className={`rounded-lg border px-3 py-2 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-muted"}`}
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  );
}
