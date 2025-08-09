// Types for the triggers API
export interface Trigger {
  id: number
  name: string
  description?: string
  type: 'schedule' | 'webhook' | 'event' | 'data'
  targetType: 'workflow' | 'worker'
  workflowId?: string
  workerId?: string
  status: 'active' | 'inactive' | 'error'
  isActive: boolean
  
  // Schedule-specific fields
  scheduleFrequency?: string
  cronExpression?: string
  
  // Webhook-specific fields
  webhookEndpoint?: string
  webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  webhookSecret?: string
  
  // Event-specific fields
  eventSource?: string
  eventName?: string
  
  // Data condition-specific fields
  dataSource?: string
  dataCondition?: string
  
  // Execution tracking
  lastRunAt?: string
  nextRunAt?: string
  executionCount: number
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface CreateTrigger {
  name: string
  description?: string
  type: 'schedule' | 'webhook' | 'event' | 'data'
  targetType: 'workflow' | 'worker'
  workflowId?: string
  workerId?: string
  isActive?: boolean
  
  scheduleFrequency?: string
  cronExpression?: string
  
  webhookEndpoint?: string
  webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  webhookSecret?: string
  
  eventSource?: string
  eventName?: string
  
  dataSource?: string
  dataCondition?: string
  
  createdBy?: string
}

export interface UpdateTrigger extends Partial<CreateTrigger> {
  updatedBy?: string
}

export interface TriggerStats {
  total: number
  active: number
  inactive: number
  error: number
  byType: {
    schedule: number
    webhook: number
    event: number
    data: number
  }
  totalExecutions: number
}

export interface PaginatedTriggers {
  data: Trigger[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface GetTriggersQuery {
  page?: number
  limit?: number
  type?: 'schedule' | 'webhook' | 'event' | 'data'
  status?: 'active' | 'inactive' | 'error'
  targetType?: 'workflow' | 'worker'
  search?: string
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// API response wrapper
interface ApiResponse<T> {
  success: boolean
  message?: string
  responseObject?: T
  statusCode?: number
}

// API service class
class TriggersApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed')
      }

      return data.responseObject as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Get all triggers with pagination and filtering
  async getTriggers(query: GetTriggersQuery = {}): Promise<PaginatedTriggers> {
    const searchParams = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/triggers${queryString ? `?${queryString}` : ''}`
    
    return this.request<PaginatedTriggers>(endpoint)
  }

  // Get trigger by ID
  async getTrigger(id: number): Promise<Trigger> {
    return this.request<Trigger>(`/triggers/${id}`)
  }

  // Create new trigger
  async createTrigger(data: CreateTrigger): Promise<Trigger> {
    return this.request<Trigger>('/triggers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Update trigger
  async updateTrigger(id: number, data: UpdateTrigger): Promise<Trigger> {
    return this.request<Trigger>(`/triggers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Delete trigger
  async deleteTrigger(id: number): Promise<boolean> {
    return this.request<boolean>(`/triggers/${id}`, {
      method: 'DELETE',
    })
  }

  // Toggle trigger status
  async toggleTriggerStatus(id: number, isActive: boolean, updatedBy?: string): Promise<Trigger> {
    return this.request<Trigger>(`/triggers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive, updatedBy }),
    })
  }

  // Execute trigger manually
  async executeTrigger(id: number, executedBy?: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/triggers/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify({ executedBy }),
    })
  }

  // Get trigger statistics
  async getStats(): Promise<TriggerStats> {
    return this.request<TriggerStats>('/triggers/stats')
  }
}

// Export singleton instance
export const triggersApi = new TriggersApiService()