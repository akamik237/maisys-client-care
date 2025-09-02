"use client";
import MaisysLogo from "@/components/MaisysLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/UserContext";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "employee" | null;
  const { setRole } = useUserContext();

  useEffect(() => {
    if (type !== "employee") {
      router.replace("/");
    }
  }, [type, router]);

  if (type !== "employee") return null;

  const handleSelect = (choice: string) => {
    setRole("employee"); // On force le rôle employé dans le contexte
    // Redirection spécifique selon le département
    if (choice === "Information System Unit" || choice === "Moyens Généraux") {
      router.push("/orchestra/dashboard");
    } else {
      router.push("/coworker/home");
    }
  };

  const departments = [
    "Top Management",
    "Risk Management Unit",
    "Compliance and Anti-Money Laundering",
    "Permanent Control Unit",
    "Information System Unit",
    "Credit Unit",
    "PME",
    "Agribanking",
    "Business Network",
    "Acouting and Financial Unit",
    "Marketing and Communication Unit",
    "Operation and Treasury Unit",
    "Moyens Généraux",
    "Legal and Governance Unit",
    "Human Capital Unit",
  ];
  return (
    <div className="rounded- p-8 max-w-3xl mx-auto flex flex-col items-center text-[var(--foreground)]">
      <span className="text-xs text-[var(--color-light-blue)] mb-2">Onboarding</span>
      <MaisysLogo size={56} />
      <h2 className="text-2xl font-bold text-[var(--color-light-yellow)] text-center mt-4 mb-2" style={{fontFamily: 'Rubik, var(--font-sans)'}}>A quel département appartenez au sein de la Regionale <br/> ≡ BANK ? ≡</h2>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {departments.map(dep => (
          <button
            key={dep}
            className="bg-[var(--color-dark-blue)] text-[var(--foreground)] rounded-lg px-4 py-2 font-medium text-sm hover:bg-[var(--color-sky-blue)] border-2 border-[var(--color-sky-blue)] min-w-[180px] transition"
            onClick={() => handleSelect(dep)}
          >
            {dep}
          </button>
        ))}
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
