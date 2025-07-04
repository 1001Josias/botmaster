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
  .describe('The scope of the worker, determining its visibility and accessibility in the marketplace')
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
  folderKey: commonValidations.key.describe('The unique identifier of the folder'),
  scope: Scopes.optional().default('folder'),
  scopeRef: commonValidations.key
    .describe('The reference to the scope, such as a folder key, tenant key, or organization key')
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
  createdBy: userIdSchema.describe('The user id of the creator of the worker'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the worker'),
  createdAt: timestamp.describe('The timestamp when the worker was created'),
  updatedAt: timestamp.describe('The timestamp of the last worker update'),
})
export type WorkerResponseDto = z.infer<typeof WorkerResponseSchema>

export const CreateWorkerSchema = WorkerBaseSchema
export type CreateWorkerDto = z.infer<typeof CreateWorkerSchema>

export const WorkerRouteParamsSchema = z.object({
  params: z.object({ id: workerId }),
})

export const GetWorkersRouteQuerySchema = z.object({
  query: z.object({
    page: z.number().int().positive().describe('The page number to retrieve'),
    limit: z.number().int().positive(),
  }),
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
