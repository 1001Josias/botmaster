import { z } from 'zod'
import { commonValidations } from '../../common/utils/commonValidation'

const automationId = commonValidations.id.describe('The unique identifier of the automation')
const userIdSchema = commonValidations.id.describe('The unique identifier of the user')
const timestamp = commonValidations.timestamp

export type Automation = z.infer<typeof AutomationSchema>

export const AutomationSchema = z.object({
  id: automationId,
  key: z.string().uuid(),
  name: z.string({ description: 'The name of the automation' }),
  description: z.string({ description: 'The description of the automation' }),
  createdBy: userIdSchema.describe('The user id of the creator of the automation'),
  updatedBy: userIdSchema.describe('The user id of the last user to update the automation'),
  createdAt: timestamp.describe('The timestamp when the automation was created'),
  updatedAt: timestamp.describe('The timestamp of the last automation update'),
})

export const AutomationRouteParamsSchema = z.object({
  params: z.object({ id: automationId }),
})

