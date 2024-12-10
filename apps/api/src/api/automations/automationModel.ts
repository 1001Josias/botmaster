import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const automationId = commonValidations.id.describe('The unique identifier of the automation')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

export const AutomationSchema = z.object({
  id: automationId.optional(),
  key: z.string().uuid().optional(),
  name: z.string({ description: 'The name of the automation' }),
  description: z.string({ description: 'The description of the automation' }),
  createdBy: userIdSchema.describe('The user id of the creator of the automation'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the automation'),
  createdAt: timestamp.describe('The timestamp when the automation was created').optional(),
  updatedAt: timestamp.describe('The timestamp of the last automation update').optional(),
})

export const AutomationCreateSchema = AutomationSchema.omit({ id: true, key: true, createdAt: true, updatedAt: true })

export const AutomationRouteParamsSchema = z.object({
  params: z.object({ id: automationId }),
})

export const GetAutomationsRouteQuerySchema = z.object({
  query: z.object({
    page: z.number().int().positive().describe('The page number to retrieve'),
    limit: z.number().int().positive(),
  }),
})
