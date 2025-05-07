import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const workerId = commonValidations.id.describe('The unique identifier of the worker')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

export const WorkerSchema = z.object({
  id: workerId.optional(),
  key: z.string().uuid().optional(),
  name: z.string({ description: 'The name of the worker' }),
  description: z.string({ description: 'The description of the worker' }).max(2500).optional(),
  createdBy: userIdSchema.describe('The user id of the creator of the worker'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the worker'),
  createdAt: timestamp.describe('The timestamp when the worker was created').optional(),
  updatedAt: timestamp.describe('The timestamp of the last worker update').optional(),
})

export type Worker = z.infer<typeof WorkerSchema>

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
