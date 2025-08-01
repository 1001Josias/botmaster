import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const queueId = commonValidations.id.describe('The unique identifier of the queue')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

export const QueueStatus = z.enum(['active', 'paused', 'error']).describe('The status of the queue')
export type QueueStatusType = z.infer<typeof QueueStatus>

export const QueueBaseSchema = z.object({
  name: z
    .string({ description: 'The name of the queue' })
    .nonempty()
    .trim()
    .min(1)
    .max(255)
    .describe('The name of the queue')
    .openapi({
      example: 'Email Processing Queue',
    }),
  description: z.string().max(2500).describe('The description of the queue').optional().default(''),
  concurrency: z.number().int().min(1).max(100).describe('Maximum number of concurrent jobs').optional().default(1),
  retryLimit: z.number().int().min(0).max(10).describe('Maximum number of retry attempts').optional().default(3),
  retryDelay: z.number().int().min(0).describe('Delay between retries in milliseconds').optional().default(60000),
  priority: z.number().int().min(0).max(10).describe('Queue priority (0-10, higher is more important)').optional().default(5),
  isActive: z.boolean().describe('Whether the queue is active').optional().default(true),
  tags: z.array(z.string()).describe('The tags associated with the queue').optional().default([]),
  metadata: z.record(z.any()).describe('Additional metadata for the queue').optional().default({}),
})

export const QueueResponseSchema = QueueBaseSchema.extend({
  id: queueId,
  key: commonValidations.key.describe('The unique identifier of the queue'),
  folderKey: commonValidations.key.describe('The unique identifier of the folder'),
  status: QueueStatus,
  createdBy: userIdSchema.describe('The user id of the creator of the queue'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the queue'),
  createdAt: timestamp.describe('The timestamp when the queue was created'),
  updatedAt: timestamp.describe('The timestamp of the last queue update'),
})
export type QueueResponseDto = z.infer<typeof QueueResponseSchema>

export const CreateQueueSchema = QueueBaseSchema
export type CreateQueueDto = z.infer<typeof CreateQueueSchema>

export const UpdateQueueSchema = QueueBaseSchema.partial()
export type UpdateQueueDto = z.infer<typeof UpdateQueueSchema>

export const QueueRouteParamsSchema = z.object({
  params: z.object({ id: queueId }),
})

export const QueueKeyRouteParamsSchema = z.object({
  key: commonValidations.key,
})

export const GetQueuesRouteQuerySchema = z.object({
  query: z.object({
    page: z.number().int().positive().describe('The page number to retrieve').optional().default(1),
    limit: z.number().int().positive().max(100).describe('Number of items per page').optional().default(20),
    status: QueueStatus.optional().describe('Filter by queue status'),
    folderKey: commonValidations.key.optional().describe('Filter by folder key'),
    search: z.string().optional().describe('Search term for queue name or description'),
  }),
})

export const QueueStatsSchema = z.object({
  totalPending: z.number().int().describe('Total pending items across all queues'),
  totalProcessing: z.number().int().describe('Total processing items across all queues'),
  totalCompleted: z.number().int().describe('Total completed items across all queues'),
  totalFailed: z.number().int().describe('Total failed items across all queues'),
  avgProcessingTime: z.number().describe('Average processing time in milliseconds'),
})
export type QueueStatsDto = z.infer<typeof QueueStatsSchema>

export type QueueDatabaseDto = {
  id: number
  key: string
  name: string
  folder_key: string
  description: string
  status: QueueStatusType
  concurrency: number
  retry_limit: number
  retry_delay: number
  priority: number
  is_active: boolean
  tags: string[]
  metadata: Record<string, any>
  created_by: number
  updated_by: number
  created_at: Date
  updated_at: Date
}