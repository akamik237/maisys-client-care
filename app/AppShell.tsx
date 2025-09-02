"use client";
import React, { useEffect } from "react";
// Sidebar supprimée - utilisation de la sidebar intégrée dans la page

import { ThemeToggle } from "../components/ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserContext();
  const hideNav = pathname === "/" || pathname === "/login" || pathname === "/onboarding";

  // Redirect logic based on user state and role
  useEffect(() => {
    console.log("AppShell Debug:", { user, pathname, hideNav });
    
    if (!user) {
      console.log("No user - allowing access to public pages");
      // Redirect to onboarding if trying to access protected pages
      if (pathname.startsWith("/client-care")) {
        console.log("Redirecting to onboarding for protected page");
        router.replace("/onboarding?type=client");
      }
      return;
    }

    // If user is fully authenticated (has name and role), allow them to stay on home page
    if (user.name && user.role) {
      console.log("User is fully authenticated");
      // Only redirect from login page, not from home page
      if (pathname === "/login") {
        console.log("Redirecting from login to home");
        router.replace("/");
        return;
      }
    }
  }, [user, pathname, router]);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Plus de sidebar externe - chaque page gère sa propre sidebar */}
        <main className="p-0 h-screen">
          {children}
        </main>
      </div>
      {/* Chat removed - client-care uses integrated chat in pages */}
      
      {/* ThemeToggle fixe seulement sur les pages publiques */}
      {(pathname === "/" || pathname === "/login") && <ThemeToggle />}
    </>
  );
}
