// backendService.ts
// Service for interacting with the Backend API

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';

export interface Agent {
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
}

export interface Integration {
  id: number;
  name: string;
  type: string;
  status: "active" | "inactive";
  description: string;
  config?: Record<string, any>;
  actions?: Array<{
    id: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
}

export interface CreateAgentRequest {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive";
  capabilities: string[];
  lastActivity: string;
  trigger: {
    name: string;
    type: string;
    description?: string;
  };
}

class BackendService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  async getIntegrations(): Promise<Integration[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/integrations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
  }

  async getAgent(agentId: string): Promise<Agent> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/${agentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  }

  async createAgent(agentData: CreateAgentRequest): Promise<Agent> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  async updateAgent(agentId: string, agentData: Partial<CreateAgentRequest>): Promise<Agent> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }

  async deleteAgent(agentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/${agentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }

  // Sync health check
  async checkSyncHealth(): Promise<{
    llm_gateway_connected: boolean;
    sync_service_status: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/sync/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking sync health:', error);
      throw error;
    }
  }

  // Deployment methods
  async deployAgent(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/${agentId}/deploy`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to deploy agent: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deploying agent:', error);
      throw error;
    }
  }

  async undeployAgent(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/${agentId}/undeploy`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to undeploy agent: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error undeploying agent:', error);
      throw error;
    }
  }

  async getAgentDeploymentStatus(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/data/agents/${agentId}/deployment-status`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to get deployment status: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting deployment status:', error);
      throw error;
    }
  }

  async getDeploymentOverview(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/data/deployment/overview`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to get deployment overview: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting deployment overview:', error);
      throw error;
    }
  }
}

export const backendService = new BackendService();