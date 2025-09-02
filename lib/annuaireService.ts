// Service for Annuaire Régionale Bank API
// Handles all communication with the directory system

import { ANNUAIRE_API_CONFIG, ANNUAIRE_ACTIONS, AnnuaireEntry, SearchFilters } from '@/data/annuaireConfig'

class AnnuaireService {
  private baseUrl: string
  private timeout: number
  private retries: number

  constructor() {
    this.baseUrl = ANNUAIRE_API_CONFIG.baseUrl
    this.timeout = ANNUAIRE_API_CONFIG.timeout
    this.retries = ANNUAIRE_API_CONFIG.retries
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, config)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return data
      } catch (error) {
        lastError = error as Error
        console.warn(`Attempt ${attempt} failed for ${endpoint}:`, error)
        
        if (attempt === this.retries) {
          throw new Error(`Failed after ${this.retries} attempts: ${lastError?.message}`)
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  // Get all entries
  async getAllEntries(): Promise<AnnuaireEntry[]> {
    return this.makeRequest('/api/annuaire')
  }

  // Search entries with filters
  async searchEntries(filters: SearchFilters = {}): Promise<AnnuaireEntry[]> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('query', filters.search)
    if (filters.departement) params.append('departement', filters.departement)
    if (filters.poste) params.append('poste', filters.poste)
    
    const queryString = params.toString()
    const endpoint = `/api/annuaire${queryString ? `?${queryString}` : ''}`
    
    return this.makeRequest(endpoint)
  }

  // Get entry by ID
  async getEntryById(id: number): Promise<AnnuaireEntry> {
    return this.makeRequest(`/api/annuaire/${id}`)
  }

  // Create new entry (admin only)
  async createEntry(entry: Omit<AnnuaireEntry, 'id'>): Promise<AnnuaireEntry> {
    return this.makeRequest('/api/annuaire', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }

  // Update entry (admin only)
  async updateEntry(id: number, updates: Partial<AnnuaireEntry>): Promise<AnnuaireEntry> {
    return this.makeRequest(`/api/annuaire/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Delete entry (admin only)
  async deleteEntry(id: number): Promise<{ message: string }> {
    return this.makeRequest(`/api/annuaire/${id}`, {
      method: 'DELETE',
    })
  }

  // Get departments from all entries
  async getDepartments(): Promise<string[]> {
    const allEntries = await this.getAllEntries()
    const departments = [...new Set(allEntries.map(entry => entry.departement))]
    return departments.filter(dept => dept && dept.trim() !== '')
  }

  // Get entries by department
  async getEntriesByDepartment(departement: string): Promise<AnnuaireEntry[]> {
    const allEntries = await this.getAllEntries()
    return allEntries.filter(entry => entry.departement === departement)
  }

  // Get entry by IP address (search through all entries)
  async getEntryByIp(ip: string): Promise<AnnuaireEntry | null> {
    const allEntries = await this.getAllEntries()
    return allEntries.find(entry => entry.ip === ip) || null
  }

  // Get statistics from all entries
  async getStatistics(): Promise<{
    totalEntries: number
    byDepartment: Record<string, number>
    byPoste: Record<string, number>
    lastUpdated: string
  }> {
    const allEntries = await this.getAllEntries()
    
    const byDepartment: Record<string, number> = {}
    const byPoste: Record<string, number> = {}
    
    allEntries.forEach(entry => {
      byDepartment[entry.departement] = (byDepartment[entry.departement] || 0) + 1
      byPoste[entry.poste] = (byPoste[entry.poste] || 0) + 1
    })
    
    return {
      totalEntries: allEntries.length,
      byDepartment,
      byPoste,
      lastUpdated: new Date().toISOString()
    }
  }

  // Test connection
  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      const entries = await this.getAllEntries()
      return {
        status: 'success',
        message: `Connexion réussie. ${entries.length} entrées trouvées.`
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Erreur de connexion: ${(error as Error).message}`
      }
    }
  }

  // Get available actions for workflows
  getWorkflowActions() {
    return ANNUAIRE_ACTIONS.filter(action => action.workflowCompatible)
  }

  // Get available actions for agents
  getAgentActions() {
    return ANNUAIRE_ACTIONS.filter(action => action.agentCompatible)
  }

  // Execute action by ID with parameters
  async executeAction(actionId: string, parameters: Record<string, any> = {}): Promise<any> {
    const action = ANNUAIRE_ACTIONS.find(a => a.id === actionId)
    if (!action) {
      throw new Error(`Action ${actionId} not found`)
    }

    // Build endpoint with parameters
    let endpoint = action.endpoint
    const queryParams = new URLSearchParams()
    const bodyParams: Record<string, any> = {}

    // Handle path parameters
    action.parameters?.forEach(param => {
      if (param.name in parameters) {
        if (endpoint.includes(`:${param.name}`)) {
          endpoint = endpoint.replace(`:${param.name}`, parameters[param.name].toString())
        } else if (action.method === 'GET') {
          queryParams.append(param.name, parameters[param.name].toString())
        } else {
          bodyParams[param.name] = parameters[param.name]
        }
      }
    })

    // Add query parameters for GET requests
    if (action.method === 'GET' && queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }

    const requestOptions: RequestInit = {
      method: action.method,
    }

    // Add body for non-GET requests
    if (action.method !== 'GET' && Object.keys(bodyParams).length > 0) {
      requestOptions.body = JSON.stringify(bodyParams)
    }

    return this.makeRequest(endpoint, requestOptions)
  }

  // Search with natural language
  async searchByNaturalLanguage(query: string): Promise<AnnuaireEntry[]> {
    // This could be enhanced with AI/LLM processing
    const searchTerms = query.toLowerCase().split(' ')
    
    const allEntries = await this.searchEntries()
    
    return allEntries.filter(entry => {
      const searchableText = [
        entry.nom.toLowerCase(),
        entry.poste.toLowerCase(),
        entry.departement.toLowerCase(),
        entry.email.toLowerCase(),
        entry.tel.toLowerCase(),
        entry.ip.toLowerCase()
      ].join(' ')
      
      return searchTerms.some(term => searchableText.includes(term))
    })
  }

  // Get entries with missing information
  async getIncompleteEntries(): Promise<AnnuaireEntry[]> {
    const allEntries = await this.searchEntries()
    return allEntries.filter(entry => 
      !entry.ip || !entry.email || !entry.tel || !entry.poste
    )
  }

  // Get recent changes (mock implementation)
  async getRecentChanges(limit: number = 10): Promise<{
    entry: AnnuaireEntry
    changeType: 'created' | 'updated' | 'deleted'
    timestamp: string
  }[]> {
    // This would typically come from a changes log
    // For now, return mock data
    const recentEntries = await this.searchEntries()
    return recentEntries.slice(0, limit).map(entry => ({
      entry,
      changeType: 'updated' as const,
      timestamp: new Date().toISOString()
    }))
  }
}

// Export singleton instance
export const annuaireService = new AnnuaireService()

// Export types for use in components
export type { AnnuaireEntry, SearchFilters }