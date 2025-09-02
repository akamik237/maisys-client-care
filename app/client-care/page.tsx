"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function WorkflowPage() {
  const router = useRouter();
  const handleLogout = () => {
    // Ici, on peut aussi nettoyer le localStorage/cookies si besoin
    router.push("/");
  };
  return (
    <div className="max-w-3xl mx-auto py-16">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Se déconnecter
        </Button>
      </div>
      {/* Ici viendra le chatbot ou l'espace collaboratif employé */}
      {/* À compléter avec l'organigramme, les modules internes, etc. */}
      <div className="bg-[var(--color-dark-blue)] rounded-xl shadow p-8 mt-4 text-[var(--foreground)]">
        Chatbot Cient Care (à implémenter)
      </div>
    </div>
  );
}