// Configuration for Annuaire Régionale Bank Tool
// This file defines all available actions and APIs for the directory system

export interface AnnuaireEntry {
  id: number;
  nom: string;
  ip: string;
  poste: string;
  departement: string;
  email: string;
  tel: string;
}

export interface SearchFilters {
  search?: string;
  departement?: string;
  poste?: string;
}

export interface AnnuaireAction {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters?: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required: boolean;
    description: string;
  }[];
  response: {
    type: 'array' | 'object' | 'string' | 'number';
    description: string;
  };
  workflowCompatible: boolean;
  agentCompatible: boolean;
}

export const ANNUAIRE_ACTIONS: AnnuaireAction[] = [
  {
    id: 'get_all_entries',
    name: 'Obtenir toutes les entrées',
    description: 'Récupère toutes les entrées de l\'annuaire',
    endpoint: '/api/annuaire',
    method: 'GET',
    parameters: [],
    response: {
      type: 'array',
      description: 'Liste de toutes les entrées de l\'annuaire'
    },
    workflowCompatible: true,
    agentCompatible: true
  },
  {
    id: 'search_entries',
    name: 'Rechercher des entrées',
    description: 'Recherche dans l\'annuaire par nom, poste, département, IP, email ou téléphone',
    endpoint: '/api/annuaire',
    method: 'GET',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: false,
        description: 'Terme de recherche (nom, poste, département, IP, email, téléphone)'
      },
      {
        name: 'departement',
        type: 'string',
        required: false,
        description: 'Filtrer par département'
      },
      {
        name: 'poste',
        type: 'string',
        required: false,
        description: 'Filtrer par poste/position'
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Nombre maximum de résultats (défaut: 50)'
      }
    ],
    response: {
      type: 'array',
      description: 'Liste des entrées correspondant aux critères'
    },
    workflowCompatible: true,
    agentCompatible: true
  },
  {
    id: 'get_entry_by_id',
    name: 'Obtenir une entrée par ID',
    description: 'Récupère les détails complets d\'une entrée spécifique',
    endpoint: '/api/annuaire/:id',
    method: 'GET',
    parameters: [
      {
        name: 'id',
        type: 'number',
        required: true,
        description: 'ID de l\'entrée à récupérer'
      }
    ],
    response: {
      type: 'object',
      description: 'Détails complets de l\'entrée'
    },
    workflowCompatible: true,
    agentCompatible: true
  },
  {
    id: 'create_entry',
    name: 'Créer une nouvelle entrée',
    description: 'Ajoute une nouvelle entrée dans l\'annuaire (admin seulement)',
    endpoint: '/api/annuaire',
    method: 'POST',
    parameters: [
      {
        name: 'nom',
        type: 'string',
        required: true,
        description: 'Nom et prénom de la personne'
      },
      {
        name: 'ip',
        type: 'string',
        required: false,
        description: 'Adresse IP de l\'appareil'
      },
      {
        name: 'poste',
        type: 'string',
        required: true,
        description: 'Poste/position de la personne'
      },
      {
        name: 'departement',
        type: 'string',
        required: true,
        description: 'Département de la personne'
      },
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Adresse email'
      },
      {
        name: 'tel',
        type: 'string',
        required: true,
        description: 'Numéro de téléphone'
      }
    ],
    response: {
      type: 'object',
      description: 'Nouvelle entrée créée avec son ID'
    },
    workflowCompatible: false,
    agentCompatible: false
  },
  {
    id: 'update_entry',
    name: 'Modifier une entrée',
    description: 'Met à jour une entrée existante (admin seulement)',
    endpoint: '/api/annuaire/:id',
    method: 'PUT',
    parameters: [
      {
        name: 'id',
        type: 'number',
        required: true,
        description: 'ID de l\'entrée à modifier'
      },
      {
        name: 'nom',
        type: 'string',
        required: false,
        description: 'Nouveau nom et prénom'
      },
      {
        name: 'ip',
        type: 'string',
        required: false,
        description: 'Nouvelle adresse IP'
      },
      {
        name: 'poste',
        type: 'string',
        required: false,
        description: 'Nouveau poste/position'
      },
      {
        name: 'departement',
        type: 'string',
        required: false,
        description: 'Nouveau département'
      },
      {
        name: 'email',
        type: 'string',
        required: false,
        description: 'Nouvelle adresse email'
      },
      {
        name: 'tel',
        type: 'string',
        required: false,
        description: 'Nouveau numéro de téléphone'
      }
    ],
    response: {
      type: 'object',
      description: 'Entrée mise à jour'
    },
    workflowCompatible: false,
    agentCompatible: false
  },
  {
    id: 'delete_entry',
    name: 'Supprimer une entrée',
    description: 'Supprime une entrée de l\'annuaire (admin seulement)',
    endpoint: '/api/annuaire/:id',
    method: 'DELETE',
    parameters: [
      {
        name: 'id',
        type: 'number',
        required: true,
        description: 'ID de l\'entrée à supprimer'
      }
    ],
    response: {
      type: 'string',
      description: 'Message de confirmation'
    },
    workflowCompatible: false,
    agentCompatible: false
  }
];

// Configuration pour les workflows
export const ANNUAIRE_WORKFLOW_TRIGGERS = [
  {
    id: 'new_entry_created',
    name: 'Nouvelle entrée créée',
    description: 'Déclenché quand une nouvelle entrée est ajoutée à l\'annuaire',
    action: 'create_entry'
  },
  {
    id: 'entry_updated',
    name: 'Entrée modifiée',
    description: 'Déclenché quand une entrée est mise à jour',
    action: 'update_entry'
  },
  {
    id: 'ip_changed',
    name: 'Adresse IP modifiée',
    description: 'Déclenché quand l\'adresse IP d\'une entrée change',
    action: 'update_entry'
  },
  {
    id: 'department_transfer',
    name: 'Transfert de département',
    description: 'Déclenché quand une personne change de département',
    action: 'update_entry'
  }
];

// Configuration pour les agents IA
export const ANNUAIRE_AGENT_CAPABILITIES = [
  {
    id: 'search_assistant',
    name: 'Assistant de recherche',
    description: 'Aide à rechercher des personnes dans l\'annuaire',
    actions: ['get_all_entries', 'search_entries', 'get_entry_by_id']
  },
  {
    id: 'network_monitor',
    name: 'Moniteur réseau',
    description: 'Surveille les changements d\'IP et les connexions réseau',
    actions: ['get_all_entries', 'search_entries']
  },
  {
    id: 'contact_manager',
    name: 'Gestionnaire de contacts',
    description: 'Gère les informations de contact et les mises à jour',
    actions: ['get_all_entries', 'search_entries', 'get_entry_by_id']
  }
];

// Configuration des permissions
export const ANNUAIRE_PERMISSIONS = {
  read: ['get_all_entries', 'search_entries', 'get_entry_by_id'],
  write: ['create_entry', 'update_entry', 'delete_entry'],
  admin: ['create_entry', 'update_entry', 'delete_entry']
};

// Configuration de l'API
export const ANNUAIRE_API_CONFIG = {
          baseUrl: 'http://172.17.184.236:3005',
  timeout: 10000,
  retries: 3,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  }
};