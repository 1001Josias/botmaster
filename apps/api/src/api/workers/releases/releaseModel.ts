import { z } from 'zod'

export const workerParametersSchema = z
  .object({})
  .describe('The parameters of the worker. If not specified, it will default to an empty object.')
  .optional()
  .default({})

export const workerSettingsSchema = z
  .object({})
  .describe(
    'Customized and specific settings for each worker, containing information necessary for the worker to function according to its logic.'
  )
  .optional()
  .default({})

export const ReleaseBaseSchema = z.object({
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 1.0.0)')
    .describe('The version of the release')
    .openapi({
      example: '1.0.0',
    }),
})

export type ReleaseBase = z.infer<typeof ReleaseBaseSchema>

export const ReleaseSchema = ReleaseBaseSchema.extend({
  id: z.string().uuid(),
  workerId: z.string().describe('The id of the worker'),
  releaseType: z.enum(['major', 'minor', 'patch']).describe('The type of the release'),
  language: z.string().describe('The programming language of the worker'),
  customVersion: z.string().describe('The custom version of the worker').optional(),
  releaseNotes: z.string().describe('The release notes of the worker').optional(),
  settingsSchema: workerSettingsSchema,
  parametersSchema: workerParametersSchema,
  createdAt: z.string().describe('The date of the release'),
  createdBy: z.string().uuid().describe('The user id of the creator of the release'),
}).describe('The release of the worker')
export type Release = z.infer<typeof ReleaseSchema>
