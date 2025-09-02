// Centralized app data for the entire application
// This file is the single source of truth for all static/mock data
// Replace with backend API calls later

export type Integration = {
  id: number;
  name: string;
  type: string;
  status: "active" | "inactive";
  description: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "error";
  capabilities: string[];
  lastActivity: string;
  trigger: {
    name: string;
    type: string;
    description?: string;
  };
};

export type Workflow = {
  id: string;
  name: string;
  status: string;
  description?: string;
};

export type ErrorLog = {
  type: string;
  time: string;
  resolved: boolean;
};

export type Activity = {
  user: string;
  action: string;
  time: string;
};

export const integrations: Integration[] = [
  { id: 1, name: "Outlook API", type: "Email", status: "active", description: "Synchronise les emails et calendriers." },
  { id: 2, name: "Active Directory", type: "User Directory", status: "active", description: "Gestion des utilisateurs et rôles." },
  { id: 3, name: "GLPI", type: "IT Asset", status: "inactive", description: "Gestion du parc informatique." },
  { id: 4, name: "Amplitude Up Oracle", type: "Core Banking", status: "active", description: "Connexion au système bancaire." },
  { id: 5, name: "Smartpass", type: "Présence", status: "active", description: "Gestion des présences par reconnaissance faciale" },
  { id: 6, name: "Annuaire Régionale Bank", type: "Directory", status: "active", description: "Annuaire interne des adresses IP et contacts de La Régionale Bank." },
];

export const agents: Agent[] = [
  { id: "1", name: "Agent Outlook", role: "Gestion des emails et calendriers", status: "active", capabilities: ["Outlook", "Mail"], lastActivity: "Il y a 2 min", trigger: { name: "Daily summary at 8pm", type: "timer", description: "Summarize today's Outlook emails at 8pm" } },
  { id: "2", name: "Agent Oracle", role: "Connexion base Oracle RH", status: "inactive", capabilities: ["Oracle", "API"], lastActivity: "Il y a 1h", trigger: { name: "On demand", type: "manual", description: "Triggered manually by user" } },
  { id: "3", name: "Agent AD", role: "Gestion Active Directory", status: "active", capabilities: ["AD"], lastActivity: "Il y a 5 min", trigger: { name: "On user creation", type: "event", description: "Triggered when a new user is created" } },
  { id: "4", name: "Agent Smartpass", role: "Réinitialisation de mot de passe", status: "error", capabilities: ["Smartpass", "AD"], lastActivity: "Il y a 10 min", trigger: { name: "On password reset request", type: "event", description: "Triggered when a password reset is requested" } },
  { id: "5", name: "Agent Solvabilité Client", role: "Analyse de la solvabilité des clients", status: "inactive", capabilities: ["Finance", "Analyse"], lastActivity: "Il y a 3h", trigger: { name: "Nouvelle analyse", type: "manual", description: "Déclenché à la demande d'un conseiller" } },
  { id: "6", name: "Agent Client Care", role: "Support et assistance client omnicanal", status: "active", capabilities: ["Support", "Chatbot", "Omnicanal"], lastActivity: "Il y a 1 min", trigger: { name: "Message entrant", type: "event", description: "Déclenché à chaque nouveau message client" } },
];

// Workflows are now loaded from the backend via workflowService
// export const workflows: Workflow[] = []; // Removed mock data

export const errors: ErrorLog[] = [
  { type: "Connexion Oracle", time: "10:32", resolved: false },
  { type: "GLPI Asset Sync", time: "09:15", resolved: true },
];

export const recentActivity: Activity[] = [
  { user: "A. Biloa", action: "Validé étape onboarding", time: "11:05" },
  { user: "M. Tchoua", action: "Ajout agent IA", time: "10:50" },
  { user: "Système", action: "Sync GLPI", time: "09:15" },
]; 