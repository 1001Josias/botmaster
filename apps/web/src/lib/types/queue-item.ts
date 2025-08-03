export type QueueItemStatus = 'waiting' | 'processing' | 'completed' | 'error' | 'cancelled'

export interface QueueItem {
  id: string
  jobId: string
  jobName: string
  workerId: string
  workerName: string
  workerVersion: string
  status: QueueItemStatus
  createdAt: string
  startedAt: string | null
  finishedAt: string | null
  processingTime: number | null
  payload: Record<string, any>
  result: Record<string, any> | null
  error: string | null
  attempts: number
  maxAttempts: number
  priority: number
  tags: string[]
  metadata: Record<string, any>
}

export interface QueueItemFilters {
  status?: QueueItemStatus[]
  workerId?: string
  jobId?: string
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
  page: number
  pageSize: number
}

export interface QueueItemsResponse {
  items: QueueItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ExportOptions {
  format: 'csv' | 'json'
  fields: string[]
  compress: boolean
  selectedIds?: string[]
  filters?: QueueItemFilters
}

export interface ExportResult {
  downloadUrl: string
  fileName: string
  expiresAt: string
  itemCount: number
}
