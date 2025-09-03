"use client";
import MaisysLogo from "@/components/MaisysLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/UserContext";
import SobadjoRobot from "@/components/Sobadjo";

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

  const handleDepartmentSelect = (department: string) => {
    // Détermine le type de client basé sur le département sélectionné
    const clientType = department.includes("Découverte") || department.includes("Nouveau") ? "discovery" : "existing-client";
    handleSelect(clientType);
  };

  // Définition des départements/boutons pour le robot
  const clientDepartments = [
    { short: "Nouveau", full: "Je viens de découvrir La Regionale" },
    { short: "Client", full: "Oui, Je suis un client de la banque" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[var(--foreground)]">
      <span className="text-xs text-[var(--color-light-blue)] mb-4">Onboarding</span>
      
      <h2 className="text-2xl font-bold text-[var(--color-light-yellow)] text-center mb-8" style={{fontFamily: 'Rubik, var(--font-sans)'}}>
        Êtes-vous déjà familier avec <br/> 
        les services de la Regionale <br/> 
        <div className="flex justify-center items-center gap-1 mt-2">
          <div className="w-5 h-0.5 bg-[var(--color-light-yellow)]"></div>
          <div className="w-6 h-0.5 bg-[var(--color-golden-yellow)]"></div>
          <div className="w-5 h-0.5 bg-[var(--color-light-yellow)]"></div>
          <span className="mx-2 text-[var(--color-light-yellow)]">Bank?</span>
          <div className="w-5 h-0.5 bg-[var(--color-light-yellow)]"></div>
          <div className="w-6 h-0.5 bg-[var(--color-golden-yellow)]"></div>
          <div className="w-5 h-0.5 bg-[var(--color-light-yellow)]"></div>
        </div>
      </h2>

      {/* Robot Sobadjo avec boutons flottants */}
      <div className="relative w-full max-w-4xl h-96 mb-8">
        <SobadjoRobot
          className="w-full h-full"
          showDepartments={true}
          departments={clientDepartments}
          onDepartmentSelect={handleDepartmentSelect}
        />
      </div>

      <Button
        onClick={() => router.replace("/")}
        className="mt-4 underline text-[var(--color-sky-blue)]"
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