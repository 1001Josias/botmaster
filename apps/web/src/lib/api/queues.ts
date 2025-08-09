import { apiClient } from './client'

export interface Queue {
  id: number
  key: string
  name: string
  folderKey: string
  description: string
  status: 'active' | 'paused' | 'error'
  concurrency: number
  retryLimit: number
  retryDelay: number
  priority: number
  isActive: boolean
  tags: string[]
  metadata: Record<string, any>
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
}

export interface CreateQueueRequest {
  name: string
  description?: string
  concurrency?: number
  retryLimit?: number
  retryDelay?: number
  priority?: number
  isActive?: boolean
  tags?: string[]
  metadata?: Record<string, any>
}

export interface UpdateQueueRequest {
  name?: string
  description?: string
  concurrency?: number
  retryLimit?: number
  retryDelay?: number
  priority?: number
  isActive?: boolean
  tags?: string[]
  metadata?: Record<string, any>
}

export interface QueueStats {  
  totalPending: number
  totalProcessing: number
  totalCompleted: number
  totalFailed: number
  avgProcessingTime: number
}

export interface GetQueuesFilters {
  page?: number
  limit?: number
  status?: 'active' | 'paused' | 'error'
  folderKey?: string
  search?: string
}

export interface QueuesResponse {
  queues: Queue[]
  total: number
}

export const queuesApi = {
  // Get all queues with filtering and pagination
  async getAll(filters: GetQueuesFilters = {}): Promise<QueuesResponse> {
    const params: Record<string, any> = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    }

    if (filters.status) {
      params.status = filters.status
    }
    if (filters.folderKey) {
      params.folderKey = filters.folderKey
    }
    if (filters.search) {
      params.search = filters.search
    }

    return apiClient.get<QueuesResponse>('/queues', params)
  },

  // Get a specific queue by ID
  async getById(id: number): Promise<Queue> {
    return apiClient.get<Queue>(`/queues/${id}`)
  },

  // Get a specific queue by key
  async getByKey(key: string): Promise<Queue> {
    return apiClient.get<Queue>(`/queues/key/${key}`)
  },

  // Create a new queue
  async create(data: CreateQueueRequest): Promise<Queue> {
    return apiClient.post<Queue>('/queues', data)
  },

  // Update a queue
  async update(id: number, data: UpdateQueueRequest): Promise<Queue> {
    return apiClient.put<Queue>(`/queues/${id}`, data)
  },

  // Delete a queue
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/queues/${id}`)
  },

  // Pause a queue
  async pause(id: number): Promise<Queue> {
    return apiClient.post<Queue>(`/queues/${id}/pause`)
  },

  // Resume a queue
  async resume(id: number): Promise<Queue> {
    return apiClient.post<Queue>(`/queues/${id}/resume`)
  },

  // Get queue statistics
  async getStats(id: number): Promise<QueueStats> {
    return apiClient.get<QueueStats>(`/queues/${id}/stats`)
  },
}