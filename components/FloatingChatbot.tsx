"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "@/context/UserContext";

type Task = { label: string; icon: string };

const CONTEXT_TASKS: { [key: string]: Task[] } = {
  workflows: [
    { label: "Créer un nouveau workflow", icon: "➕" },
    { label: "Voir l'historique des exécutions", icon: "📜" },
    { label: "Simuler un workflow", icon: "🧪" },
    { label: "Exporter le workflow", icon: "⬇️" },
    { label: "Partager le workflow", icon: "🔗" },
    { label: "Supprimer le workflow", icon: "🗑️" },
  ],
  agents: [
    { label: "Ajouter un agent IA", icon: "🤖" },
    { label: "Configurer un agent", icon: "⚙️" },
    { label: "Voir les logs d'agent", icon: "📄" },
    { label: "Suspendre un agent", icon: "⏸️" },
    { label: "Supprimer un agent", icon: "🗑️" },
  ],
};

export default function FloatingChatbot() {
  const pathname = usePathname();
  const { user } = useUserContext();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tasksRef = useRef<HTMLDivElement>(null);

  // Only show for admin users
  if (user?.role !== 'admin') {
    return null;
  }

  // Determine context
  let context: "workflows" | "agents" | "default" = "default";
  if (pathname.includes("workflow")) context = "workflows";
  else if (pathname.includes("agent")) context = "agents";
  const tasks: Task[] = CONTEXT_TASKS[context] || [];

  // Animation logic
  useEffect(() => {
    if (open) setIsVisible(true);
    else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Scroll tasks to start on context change
  useEffect(() => {
    if (tasksRef.current) {
      tasksRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [context, open]);

  const placeholder =
    context === "workflows"
      ? "Posez une question sur les workflows..."
      : context === "agents"
      ? "Posez une question sur les agents..."
      : "Posez votre question...";

  return (
    <>
      {/* Floating open button centered at bottom */}
      {!open && (
        <button
          className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-golden-yellow)] text-[var(--color-dark-blue)] shadow-lg hover:bg-[var(--color-sky-blue)] transition font-bold text-base"
          aria-label="Ouvrir le chatbot"
          onClick={() => setOpen(true)}
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="10" r="3"/>
            <path d="M8 16c0-2.2 8-2.2 8 0"/>
          </svg>
          <span>Assistant MAiSYS Orchestrator</span>
        </button>
      )}
      {/* Chatbot window with animation */}
      {isVisible && (
        <div
          className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[600px] max-w-[98vw]
            transition-all duration-300 ease-in-out
            ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"}
          `}
        >
          <div className="rounded-[2rem] shadow-2xl bg-[var(--color-dark-blue)] text-[var(--color-light-yellow)] px-8 py-2 flex flex-col gap-2 border border-[var(--color-light-blue)]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[var(--color-light-yellow)] text-[var(--color-dark-blue)] rounded-full p-2 flex items-center justify-center">
                {/* MAiSYS/assistant icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M8 16c0-2.2 8-2.2 8 0"/></svg>
              </span>
              <span className="font-semibold text-sm">Assistant MAiSYS</span>
              <button
                className="ml-auto rounded-full p-2 hover:bg-[var(--color-light-yellow)]"
                aria-label="Fermer le chatbot"
                onClick={() => setOpen(false)}
              >
                {/* Chevron down */}
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="var(--color-golden-yellow)" 
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
            </div>
            {/* Contextual Tasks - horizontally scrollable with fade and hidden scrollbar */}
            {tasks.length > 0 && (
              <div className="relative">
                <div
                  ref={tasksRef}
                  className="flex gap-2 mb-2 overflow-x-auto whitespace-nowrap hide-scrollbar pr-8"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {tasks.map((task: Task, i: number) => (
                    <button
                      key={i}
                      className="bg-[var(--color-light-yellow)] text-[var(--color-dark-blue)] px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition"
                      onClick={() => setInput(task.label)}
                    >
                      <span className="mr-1">{task.icon}</span>
                      {task.label}
                    </button>
                  ))}
                </div>
                {/* Left fade overlay */}
                <div className="pointer-events-none absolute top-0 left-0 h-full w-8"
                  style={{
                    background: "linear-gradient(to right, var(--color-dark-blue), transparent)"
                  }}
                />
                {/* Right fade overlay */}
                <div className="pointer-events-none absolute top-0 right-0 h-full w-8"
                  style={{
                    background: "linear-gradient(to left, var(--color-dark-blue), transparent)"
                  }}
                />
                <style>{`
                  .hide-scrollbar::-webkit-scrollbar { display: none; }
                  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
              </div>
            )}
            {/* Input Row */}
            <div className="flex items-center gap-2 mt-2">
              <input
                className="flex-1 rounded-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border-none outline-none text-base"
                placeholder={placeholder}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button className="rounded-full bg-[var(--foreground)] text-white w-10 h-10 flex items-center justify-center text-xl" aria-label="Validate">
                ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
