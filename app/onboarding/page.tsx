"use client";
import MaisysLogo from "@/components/MaisysLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/UserContext";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "client" | null;
  const { setRole, setUser } = useUserContext();

  useEffect(() => {
    if (type !== "client") {
      router.replace("/");
    }
  }, [type, router]);

  if (type !== "client") return null;

  const handleSelect = (choice: string) => {
    setRole("client"); // For client-care, set role as client
    
    // Set user with choice for personalized experience
    const userData = {
      name: choice === "discovery" ? "Nouveau Client" : "Client Existant",
      role: "client" as const,
      clientType: choice // "discovery" or "existing-client"
    };
    
    // Use setUser to save complete user data
    setUser(userData);
    
    // Redirect to chat with personalized experience
    router.push("/client-care/home");
  };

  return (
    <div className="rounded- p-8 max-w-3xl mx-auto flex flex-col items-center text-[var(--foreground)]">
      <span className="text-xs text-[var(--color-light-blue)] mb-2">Onboarding</span>
      <MaisysLogo size={56} />
      <h2 className="text-2xl font-bold text-[var(--color-light-yellow)] text-center mt-4 mb-2" style={{fontFamily: 'Rubik, var(--font-sans)'}}>
        Êtes-vous déjà familier avec <br/> 
        les services de la Regionale <br/> 
        ≡ BANK ? ≡
      </h2>
      
      <div className="flex flex-col items-center gap-4 mt-8">
        <button
          className="bg-[var(--color-dark-blue)] text-[var(--foreground)] rounded-lg px-8 py-4 font-medium text-base hover:bg-[var(--color-sky-blue)] border-2 border-[var(--color-sky-blue)] min-w-[300px] transition"
          onClick={() => handleSelect("discovery")}
        >
          Je viens de découvrir La Regionale
        </button>
        <button
          className="bg-[var(--color-dark-blue)] text-[var(--foreground)] rounded-lg px-8 py-4 font-medium text-base hover:bg-[var(--color-sky-blue)] border-2 border-[var(--color-sky-blue)] min-w-[300px] transition"
          onClick={() => handleSelect("existing-client")}
        >
          Oui, Je suis un client de la banque
        </button>
      </div>

      <Button
        onClick={() => router.replace("/")}
        className="mt-8 underline text-[var(--color-sky-blue)]"
      >
        Retour à l'accueil
      </Button>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}