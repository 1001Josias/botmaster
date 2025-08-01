import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const queueItemId = commonValidations.id.describe('The unique identifier of the queue item')
const queueId = commonValidations.id.describe('The unique identifier of the queue')
const timestamp = commonValidations.timestamp

export const QueueItemStatus = z.enum(['waiting', 'processing', 'completed', 'error', 'cancelled'])
  .describe('The status of the queue item')
export type QueueItemStatusType = z.infer<typeof QueueItemStatus>

export const QueueItemBaseSchema = z.object({
  queueId: queueId,
  jobId: z.string().min(1).max(255).describe('External job identifier'),
  jobName: z.string().min(1).max(255).describe('Human-readable job name'),
  workerId: z.string().min(1).max(255).describe('Worker identifier'),
  workerName: z.string().min(1).max(255).describe('Human-readable worker name'),
  workerVersion: z.string().max(50).describe('Worker version').optional().default('1.0.0'),
  payload: z.record(z.any()).describe('Job input data').optional().default({}),
  maxAttempts: z.number().int().min(0).max(10).describe('Maximum retry attempts allowed').optional().default(3),
  priority: z.number().int().min(0).max(10).describe('Item priority (0-10, higher is more important)').optional().default(5),
  tags: z.array(z.string()).describe('The tags associated with the queue item').optional().default([]),
  metadata: z.record(z.any()).describe('Additional metadata for the queue item').optional().default({}),
})

export const QueueItemResponseSchema = QueueItemBaseSchema.extend({
  id: queueItemId,
  status: QueueItemStatus,
  result: z.record(z.any()).nullable().describe('Job output data'),
  errorMessage: z.string().nullable().describe('Error message if failed'),
  attempts: z.number().int().min(0).describe('Current number of attempts'),
  processingTime: z.number().int().nullable().describe('Time taken to process in milliseconds'),
  startedAt: timestamp.nullable().describe('When processing started'),
  finishedAt: timestamp.nullable().describe('When processing finished'),
  createdAt: timestamp.describe('The timestamp when the queue item was created'),
  updatedAt: timestamp.describe('The timestamp of the last queue item update'),
})
export type QueueItemResponseDto = z.infer<typeof QueueItemResponseSchema>

export const CreateQueueItemSchema = QueueItemBaseSchema
export type CreateQueueItemDto = z.infer<typeof CreateQueueItemSchema>

export const UpdateQueueItemSchema = QueueItemBaseSchema.partial().extend({
  status: QueueItemStatus.optional(),
  result: z.record(z.any()).nullable().optional(),
  errorMessage: z.string().nullable().optional(),
})
export type UpdateQueueItemDto = z.infer<typeof UpdateQueueItemSchema>

export const QueueItemRouteParamsSchema = z.object({
  params: z.object({ id: queueItemId }),
})

export const GetQueueItemsRouteQuerySchema = z.object({
  query: z.object({
    page: z.number().int().positive().describe('The page number to retrieve').optional().default(1),
    limit: z.number().int().positive().max(100).describe('Number of items per page').optional().default(20),
    status: z.array(QueueItemStatus).optional().describe('Filter by queue item status'),
    queueId: queueId.optional().describe('Filter by queue ID'),
    workerId: z.string().optional().describe('Filter by worker ID'),
    jobId: z.string().optional().describe('Filter by job ID'),
    dateFrom: z.string().datetime().optional().describe('Filter items created after this date'),
    dateTo: z.string().datetime().optional().describe('Filter items created before this date'),
    search: z.string().optional().describe('Search term for job name or worker name'),
  }),
})

export const QueueItemFiltersSchema = z.object({
  status: z.array(QueueItemStatus).optional(),
  workerId: z.string().optional(),
  jobId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive().max(100),
})
export type QueueItemFiltersDto = z.infer<typeof QueueItemFiltersSchema>

export const QueueItemsResponseSchema = z.object({
  items: z.array(QueueItemResponseSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
  totalPages: z.number().int(),
})
export type QueueItemsResponseDto = z.infer<typeof QueueItemsResponseSchema>

export const ExportOptionsSchema = z.object({
  format: z.enum(['csv', 'json']).describe('Export format'),
  fields: z.array(z.string()).describe('Fields to include in export'),
  compress: z.boolean().describe('Whether to compress the export'),
  selectedIds: z.array(queueItemId).optional().describe('Specific item IDs to export'),
  filters: QueueItemFiltersSchema.optional().describe('Filters to apply to export'),
})
export type ExportOptionsDto = z.infer<typeof ExportOptionsSchema>

export const ExportResultSchema = z.object({
  downloadUrl: z.string().describe('URL to download the export'),
  fileName: z.string().describe('Name of the exported file'),
  expiresAt: z.string().datetime().describe('When the download link expires'),
  itemCount: z.number().int().describe('Number of items exported'),
})
export type ExportResultDto = z.infer<typeof ExportResultSchema>

export type QueueItemDatabaseDto = {
  id: number
  queue_id: number
  job_id: string
  job_name: string
  worker_id: string
  worker_name: string
  worker_version: string
  status: QueueItemStatusType
  payload: Record<string, any>
  result: Record<string, any> | null
  error_message: string | null
  attempts: number
  max_attempts: number
  priority: number
  tags: string[]
  metadata: Record<string, any>
  processing_time: number | null
  started_at: Date | null
  finished_at: Date | null
  created_at: Date
  updated_at: Date
}