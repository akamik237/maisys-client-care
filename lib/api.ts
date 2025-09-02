// Centralized API service for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://172.17.184.236:8001';
const LLM_GATEWAY_URL = process.env.NEXT_PUBLIC_LLM_GATEWAY_URL || 'http://172.17.184.236:8000';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async llmRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${LLM_GATEWAY_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`LLM Gateway Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Backend API calls
  async getIntegrations() {
    return this.request<Integration[]>('/data/integrations');
  }

  async getAgents() {
    return this.request<Agent[]>('/data/agents');
  }

  async getWorkflows() {
    return this.request<Workflow[]>('/data/workflows');
  }

  async getErrors() {
    return this.request<ErrorLog[]>('/data/errors');
  }

  async getRecentActivity() {
    return this.request<Activity[]>('/data/activity');
  }

  // LLM Gateway API calls
  async getLLMAgents() {
    return this.llmRequest<any[]>('/agents');
  }

  async getLLMAgent(agentName: string) {
    return this.llmRequest<any>(`/agents/${agentName}`);
  }

  async queryAgent(agent: string, question: string) {
    return this.llmRequest<{
      answer: string;
      model_used: string;
      complexity_analysis: any;
      success: boolean;
    }>(`/query`, {
      method: 'POST',
      body: JSON.stringify({ agent, question }),
    });
  }

  async testAgent(agentName: string, question: string, customInstructions?: string) {
    return this.llmRequest<{
      answer: string;
      agent: string;
      model_used: string;
      complexity_analysis: any;
    }>(`/agents/${agentName}/test`, {
      method: 'POST',
      body: JSON.stringify({ 
        agent: agentName, 
        question, 
        custom_instructions: customInstructions || '' 
      }),
    });
  }

  async getModelRecommendations() {
    return this.llmRequest<{
      quick_tasks: string[];
      complex_tasks: string[];
      available_models: string[];
    }>('/models/recommendations');
  }

  async getModels() {
    return this.llmRequest<{models: string[]}>('/models');
  }
}

export const apiService = new ApiService();

// Types (move to separate types file later)
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