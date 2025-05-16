import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const workerId = commonValidations.id.describe('The unique identifier of the worker')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

const parametersSchema = z.object({
  schema: z.object({}).describe('The schema of the worker'),
  values: z.object({}).describe('The values of the worker'),
})

const propertiesSchema = z.object({
  parameters: parametersSchema.describe('The parameters of the worker').optional(),
  settings: z.object({}).describe('The settings of the worker').optional(),
  options: z
    .object({
      maxConcurrent: z
        .number()
        .int()
        .positive()
        .describe(
          'The maximum number of concurrent jobs the worker can process. If not specified, it will default to 1.'
        )
        .optional()
        .default(1),
    })
    .describe('The options of the worker')
    .optional(),
  retryPolicy: z
    .object({
      maxRetries: z.number().int().positive().describe('The maximum number of retries'),
      retryDelay: z.number().int().positive().describe('The delay between retries in seconds'),
      estrategy: z.enum(['exponential', 'linear']).describe('The strategy for retrying'),
    })
    .describe('The retry policy of the worker'),
  timeout: z.number().int().positive().describe('The timeout for the worker in seconds').optional(),
  language: z.enum(['javascript', 'python', 'nodejs', 'shell']).describe('The language of the worker').optional(),
  processingMode: z.enum(['single', 'batch']).describe('The queue processing mode of the worker by job').optional(),
  release: z
    .object({
      version: z.string().describe('The version of the worker'),
      releaseNotes: z.string().describe('The release notes of the worker'),
      releaseDate: z.string().describe('The release date of the worker'),
      releaseType: z.enum(['major', 'minor', 'patch']).describe('The type of the release'),
    })
    .describe('The release of the worker')
    .optional(),
})

export const WorkerBaseSchema = z.object({
  name: z.string({ description: 'The name of the worker' }),
  tenantKey: z.string().uuid().describe('The unique identifier of the tenant'),
  folderKey: z.string().uuid().describe('The unique identifier of the folder'),
  status: z.enum(['active', 'inactive', 'archived']).describe('The status of the worker').optional(),
  description: z.string().max(2500).describe('The description of the worker').optional(),
  priority: z.enum(['low', 'medium', 'high']).describe('The priority of the worker').optional(),
  properties: propertiesSchema.describe('The properties of the worker'),
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
