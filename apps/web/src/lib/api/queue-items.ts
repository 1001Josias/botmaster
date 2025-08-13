import { apiClient } from './client'
import type { QueueItem, QueueItemFilters, QueueItemsResponse, ExportOptions, ExportResult } from '../types/queue-item'

export interface CreateQueueItemRequest {
  queueId: number
  jobId: string
  jobName: string
  workerId: string
  workerName: string
  workerVersion?: string
  payload?: Record<string, any>
  maxAttempts?: number
  priority?: number
  tags?: string[]
  metadata?: Record<string, any>
}

export interface UpdateQueueItemRequest {
  status?: 'waiting' | 'processing' | 'completed' | 'error' | 'cancelled'
  result?: Record<string, any> | null
  errorMessage?: string | null
  attempts?: number
  processingTime?: number | null
  startedAt?: string | null
  finishedAt?: string | null
}

export const queueItemsApi = {
  // Get all queue items with filtering and pagination
  async getAll(filters: QueueItemFilters): Promise<QueueItemsResponse> {
    const params: Record<string, any> = {
      page: filters.page,
      pageSize: filters.pageSize,
    }

    if (filters.status?.length) {
      params.status = filters.status
    }
    if (filters.workerId) {
      params.workerId = filters.workerId
    }
    if (filters.jobId) {
      params.jobId = filters.jobId
    }
    if (filters.dateFrom) {
      params.dateFrom = filters.dateFrom
    }
    if (filters.dateTo) {
      params.dateTo = filters.dateTo
    }
    if (filters.searchTerm) {
      params.searchTerm = filters.searchTerm
    }

    return apiClient.get<QueueItemsResponse>('/queue-items', params)
  },

  // Get a specific queue item by ID
  async getById(id: string): Promise<QueueItem> {
    return apiClient.get<QueueItem>(`/queue-items/${id}`)
  },

  // Create a new queue item
  async create(data: CreateQueueItemRequest): Promise<QueueItem> {
    return apiClient.post<QueueItem>('/queue-items', data)
  },

  // Update a queue item
  async update(id: string, data: UpdateQueueItemRequest): Promise<QueueItem> {
    return apiClient.put<QueueItem>(`/queue-items/${id}`, data)
  },

  // Delete a queue item
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/queue-items/${id}`)
  },

  // Retry a failed queue item
  async retry(id: string): Promise<QueueItem> {
    return apiClient.post<QueueItem>(`/queue-items/${id}/retry`)
  },

  // Cancel a pending/processing queue item
  async cancel(id: string): Promise<QueueItem> {
    return apiClient.post<QueueItem>(`/queue-items/${id}/cancel`)
  },

  // Export queue items
  async export(options: ExportOptions): Promise<ExportResult> {
    return apiClient.post<ExportResult>('/queue-items/export', options)
  },
}