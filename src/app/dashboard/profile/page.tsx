import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBackendSession } from "@/lib/backend-auth";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfilePageContent />
    </Suspense>
  );
}

async function ProfilePageContent() {
  const session = await getBackendSession(await headers());

  if (!session) {
    redirect("/sign-in?callbackURL=%2Fdashboard%2Fprofile");
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Account settings</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">My profile</h1>
      <p className="mt-2 text-muted-foreground">
        Keep your account details, profile photo, and tutor banner up to date.
      </p>
      <ProfileForm
        name={session.user.name}
        email={session.user.email}
        image={session.user.image ?? null}
        phone={session.user.phone}
        bio={session.user.bio}
        bannerImage={session.user.bannerImage ?? null}
        role={session.user.role}
      />
    </div>
  );
}

function ProfileLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading profile">
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl border bg-muted/40" />
    </div>
  );
}
