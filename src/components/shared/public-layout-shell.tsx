"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignInPage = pathname === "/sign-in";

  return (
    <div className="min-h-full">
      {!isSignInPage && <Navbar />}
      {children}
      {!isSignInPage && <Footer />}
    </div>
  );
}
