import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const workerId = commonValidations.id.describe('The unique identifier of the worker')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

const optionsSchema = z.object({
  maxConcurrent: z
    .number()
    .int()
    .positive()
    .describe('The maximum number of concurrent jobs the worker can process. If not specified, it will default to 1.')
    .optional()
    .default(1),
  retryPolicy: z
    .object({
      maxRetries: z.number().int().positive().describe('The maximum number of retries').default(3),
      retryDelay: z.number().int().positive().describe('The delay between retries in seconds').default(5),
      strategy: z.enum(['exponential', 'linear']).describe('The strategy for retrying').default('linear'),
    })
    .describe('The retry policy of the worker')
    .optional(),
  timeout: z
    .number()
    .int()
    .positive()
    .describe('The timeout for the worker execution in seconds')
    .optional()
    .default(60),
  processingMode: z
    .enum(['single', 'batch'])
    .describe('The queue processing mode of the worker by job')
    .optional()
    .default('single'),
})

const propertiesSchema = z.object({
  parameters: z
    .object({})
    .describe('The parameters of the worker. If not specified, it will default to an empty object.')
    .optional(),
  settings: z
    .object({})
    .describe(
      'Customized and specific settings for each worker, containing information necessary for the worker to function according to its logic.'
    )
    .optional(),
  options: optionsSchema
    .describe(
      'Configurable operational options of the worker that allow you to control the execution behavior of the worker.'
    )
    .optional(),
})

export const WorkerPriority = {
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

export const WorkerBaseSchema = z.object({
  name: z.string({ description: 'The name of the worker' }),
  tenantKey: z.string().uuid().describe('The unique identifier of the tenant'),
  folderKey: z.string().uuid().describe('The unique identifier of the folder'),
  status: z.enum(['active', 'inactive', 'archived']).describe('The status of the worker').optional(),
  description: z.string().max(2500).describe('The description of the worker').optional(),
  priority: z
    .nativeEnum(WorkerPriority)
    .describe('The priority level of the worker, from trivial (0) to critical (10)')
    .optional(),
  properties: propertiesSchema.describe('The properties of the worker').optional(),
  allowedMachines: z.array(z.string()).describe('The machines allowed to run the worker').optional(),
  tags: z.array(z.string()).describe('The tags associated with the worker').optional(),
})

export const WorkerResponseSchema = WorkerBaseSchema.extend({
  id: workerId,
  key: z.string().uuid().describe('The unique identifier of the worker'),
  createdBy: userIdSchema.describe('The user id of the creator of the worker'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the worker'),
  createdAt: timestamp.describe('The timestamp when the worker was created'),
  updatedAt: timestamp.describe('The timestamp of the last worker update'),
})
export type WorkerResponseDto = z.infer<typeof WorkerResponseSchema>

export const WorkerCreateSchema = WorkerSchema.omit({ id: true, key: true, createdAt: true, updatedAt: true })

export const WorkerRouteParamsSchema = z.object({
  params: z.object({ id: workerId }),
})

export const GetWorkersRouteQuerySchema = z.object({
  query: z.object({
    page: z.number().int().positive().describe('The page number to retrieve'),
    limit: z.number().int().positive(),
  }),
})
