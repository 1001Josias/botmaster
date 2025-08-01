import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const workerId = commonValidations.id.describe('The unique identifier of the worker')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

export const workerPriority = {
  trivial: 0,
  lowest: 1,
  veryLow: 2,
  low: 3,
  mediumLow: 4,
  medium: 5,
  mediumHigh: 6,
  high: 7,
  veryHigh: 8,
  highest: 9,
  critical: 10,
} as const

export type WorkerPriority = (typeof workerPriority)[keyof typeof workerPriority]

export const Scopes = z
  .enum(['folder', 'tenant', 'organization', 'public'])
  .describe('The scope where the worker is available. See the documentation: https://docs.botmaster.dev/workers#scopes')
export type Scope = z.infer<typeof Scopes>

export const WorkerBaseSchema = z.object({
  name: z
    .string({ description: 'The name of the worker' })
    .nonempty()
    .trim()
    .min(1)
    .max(50)
    .describe('The name of the worker')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Name must contain only alphanumeric characters, dashes, or underscores')
    .openapi({
      example: 'example-worker',
    }),
  scope: Scopes.optional().default('folder'),
  scopeRef: commonValidations.key
    .describe('The reference to the scope. See the documentation: https://docs.botmaster.dev/workers#scope-reference')
    .nullable()
    .optional()
    .default(null),
  status: z.enum(['active', 'inactive', 'archived']).describe('The status of the worker').optional().default('active'),
  description: z.string().max(2500).describe('The description of the worker').optional().default(''),
  tags: z.array(z.string()).describe('The tags associated with the worker').optional().default([]),
})

export const WorkerResponseSchema = WorkerBaseSchema.extend({
  id: workerId,
  key: commonValidations.key.describe('The unique identifier of the worker'),
  folderKey: commonValidations.key.describe('The unique identifier of the folder'),
  createdBy: userIdSchema.describe('The user id of the creator of the worker'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the worker'),
  createdAt: timestamp.describe('The timestamp when the worker was created'),
  updatedAt: timestamp.describe('The timestamp of the last worker update'),
})
export type WorkerResponseDto = z.infer<typeof WorkerResponseSchema>

export const CreateWorkerSchema = WorkerBaseSchema
export type CreateWorkerDto = z.infer<typeof CreateWorkerSchema>

export const UpdateWorkerSchema = WorkerBaseSchema.partial().omit({ scope: true, scopeRef: true })
export type UpdateWorkerDto = z.infer<typeof UpdateWorkerSchema>

export const UpdateWorkerStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'archived']).describe('The new status of the worker')
})
export type UpdateWorkerStatusDto = z.infer<typeof UpdateWorkerStatusSchema>

export const WorkerRouteParamsSchema = z.object({
  id: workerId,
})

export const WorkerKeyRouteParamsSchema = z.object({
  key: commonValidations.key,
})

export const GetWorkersRouteQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).describe('The page number to retrieve'),
  limit: z.coerce.number().int().positive().max(100).default(20).describe('The number of items per page'),
  search: z.string().optional().describe('Search term to filter workers by name or description'),
  status: z.enum(['active', 'inactive', 'archived']).optional().describe('Filter workers by status'),
  scope: z.enum(['folder', 'tenant', 'organization', 'public']).optional().describe('Filter workers by scope'),
  folderKey: commonValidations.key.optional().describe('Filter workers by folder key'),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'status']).default('createdAt').describe('Field to sort by'),
  sortOrder: z.enum(['asc', 'desc']).default('desc').describe('Sort order'),
})

export type WorkerDatabaseDto = {
  id: number
  key: string
  name: string
  folder_key: string
  description: string
  created_by: number
  updated_by: number
  created_at: Date
  updated_at: Date
  tags: string[]
  status: 'active' | 'inactive' | 'archived'
  scope: Scope
  scope_ref: string | null
}
