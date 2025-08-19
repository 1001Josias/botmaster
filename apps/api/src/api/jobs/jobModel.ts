import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const jobId = commonValidations.id.describe('The unique identifier of the job')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

export const jobStatus = {
  pending: 'pending',
  running: 'running',
  completed: 'completed',
  failed: 'failed',
} as const

export type JobStatus = (typeof jobStatus)[keyof typeof jobStatus]

export const JobStatusSchema = z
  .enum(['pending', 'running', 'completed', 'failed'])
  .describe('The current status of the job')

export const JobBaseSchema = z.object({
  name: z
    .string({ description: 'The name of the job' })
    .nonempty()
    .trim()
    .min(1)
    .max(200)
    .describe('The name of the job')
    .openapi({
      example: 'Processamento de Email #1245',
    }),
  workerKey: commonValidations.key
    .describe('The unique identifier of the worker that will execute this job')
    .openapi({
      example: 'email-worker',
    }),
  flowKey: commonValidations.key
    .describe('The unique identifier of the flow this job belongs to')
    .nullable()
    .optional()
    .default(null)
    .openapi({
      example: 'order-processing-flow',
    }),
  status: JobStatusSchema.optional().default('pending'),
  description: z.string().max(2500).describe('The description of the job').optional().default(''),
  parameters: z.record(z.any()).describe('The input parameters for the job').optional().default({}),
  result: z.record(z.any()).describe('The output result of the job').nullable().optional().default(null),
  progress: z.number().min(0).max(100).describe('The progress percentage of the job').optional().default(0),
  duration: z.number().describe('The duration of the job in milliseconds').nullable().optional().default(null),
  startedAt: timestamp.describe('The timestamp when the job started').nullable().optional().default(null),
  completedAt: timestamp.describe('The timestamp when the job completed').nullable().optional().default(null),
  error: z.string().describe('The error message if the job failed').nullable().optional().default(null),
})

export const JobResponseSchema = JobBaseSchema.extend({
  id: jobId,
  key: commonValidations.key.describe('The unique identifier of the job'),
  createdBy: userIdSchema.describe('The user id of the creator of the job'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the job'),
  createdAt: timestamp.describe('The timestamp when the job was created'),
  updatedAt: timestamp.describe('The timestamp of the last job update'),
})
export type JobResponseDto = z.infer<typeof JobResponseSchema>

export const CreateJobSchema = JobBaseSchema
export type CreateJobDto = z.infer<typeof CreateJobSchema>

export const UpdateJobSchema = JobBaseSchema.partial().extend({
  status: JobStatusSchema.optional(),
  progress: z.number().min(0).max(100).optional(),
  result: z.record(z.any()).nullable().optional(),
  error: z.string().nullable().optional(),
  completedAt: timestamp.nullable().optional(),
})
export type UpdateJobDto = z.infer<typeof UpdateJobSchema>

export const JobRouteParamsSchema = z.object({
  params: z.object({ id: jobId }),
})

export const JobKeyRouteParamsSchema = z.object({
  key: commonValidations.key,
})

export const GetJobsRouteQuerySchema = z.object({
  query: z.object({
    page: z.number().int().positive().describe('The page number to retrieve').optional().default(1),
    limit: z.number().int().positive().max(100).describe('The number of jobs per page').optional().default(20),
    status: JobStatusSchema.optional().describe('Filter jobs by status'),
    workerKey: commonValidations.key.optional().describe('Filter jobs by worker key'),
    flowKey: commonValidations.key.optional().describe('Filter jobs by flow key'),
  }),
})

export const JobStatsResponseSchema = z.object({
  completed: z.number().describe('Number of completed jobs'),
  running: z.number().describe('Number of running jobs'),
  failed: z.number().describe('Number of failed jobs'),
  pending: z.number().describe('Number of pending jobs'),
  total: z.number().describe('Total number of jobs'),
  averageDuration: z.number().nullable().describe('Average duration in milliseconds'),
})
export type JobStatsResponseDto = z.infer<typeof JobStatsResponseSchema>

export type JobDatabaseDto = {
  id: number
  key: string
  name: string
  worker_key: string
  flow_key: string | null
  description: string
  created_by: number
  updated_by: number
  created_at: Date
  updated_at: Date
  status: JobStatus
  parameters: Record<string, any>
  result: Record<string, any> | null
  progress: number
  duration: number | null
  started_at: Date | null
  completed_at: Date | null
  error: string | null
}