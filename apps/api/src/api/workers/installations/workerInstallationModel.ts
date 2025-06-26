import { z } from 'zod'
import { commonValidations } from '../../../common/utils/commonValidation'
import { workerParametersSchema, workerSettingsSchema } from '@/api/workers/releases/releaseModel'

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

const optionsSchema = z.object({
  maxConcurrent: z
    .number()
    .int()
    .min(1)
    .describe('The maximum number of jobs the worker can run simultaneously')
    .optional()
    .default(1),
  retryPolicy: z
    .object({
      maxRetries: z.number().int().max(10).describe('The maximum number of retries').default(0),
      retryDelay: z.number().int().max(60).describe('The delay between retries in seconds').default(0),
      strategy: z.enum(['exponential', 'linear']).describe('The strategy for retrying').default('linear'),
    })
    .describe('The retry policy of the worker')
    .optional()
    .default({}),
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

export const propertiesSchema = z.object({
  settings: workerSettingsSchema,
  parameters: workerParametersSchema,
  options: optionsSchema
    .describe(
      'Configurable operational options of the worker that allow you to control the execution behavior of the worker.'
    )
    .optional()
    .default({}),
})
export type PropertiesSchema = z.infer<typeof propertiesSchema>

export const WorkerInstallationBaseSchema = z.object({
  workerKey: commonValidations.key.describe('The unique identifier of the worker to be installed'),
  priority: z
    .nativeEnum(workerPriority)
    .describe('The priority level of the worker, from trivial (0) to critical (10)')
    .optional()
    .default(workerPriority.medium),
  folderKey: commonValidations.key.describe('The unique identifier of the folder where the worker is installed'),
  defaultVersion: z
    .string()
    .describe(
      'The default worker version to use when a version is not provided when creating a job. If latest, to be used the fixed with the latest version on available on moment of installation'
    )
    .optional()
    .default('latest'),
  installedBy: commonValidations.id.describe('The unique identifier of the user who installed the worker'),
  defaultProperties: propertiesSchema
    .describe('The default properties of the worker, including settings, parameters, and options')
    .optional()
    .default({})
    .openapi({
      example: propertiesSchema.parse({}),
    }),
})

export const WorkerInstallationSchema = WorkerInstallationBaseSchema
export type WorkerInstallationDto = z.infer<typeof WorkerInstallationSchema>

export const WorkerInstallationResponseSchema = WorkerInstallationBaseSchema.extend({
  installedAt: commonValidations.timestamp.describe('The timestamp when the worker was installed'),
})
export type WorkerInstallationResponseDto = z.infer<typeof WorkerInstallationResponseSchema>

export type WorkerInstallationDatabaseResponseDto = {
  worker_key: string
  priority: WorkerPriority
  folder_key: string
  default_version: string
  installed_by: number
  default_properties: PropertiesSchema
  installed_at: Date
}
