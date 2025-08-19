import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { commonValidations } from '@/common/utils/commonValidation'

extendZodWithOpenApi(z)

export const TenantBaseSchema = z.object({
  name: z
    .string({ description: 'The name of the tenant' })
    .nonempty()
    .trim()
    .min(1)
    .max(100)
    .describe('The name of the tenant')
    .openapi({
      example: 'My Organization',
    }),
  subdomain: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      'Subdomain must be lowercase, without spaces, and only contain letters, numbers, and hyphens',
    )
    .min(1)
    .max(50)
    .describe('The subdomain of the tenant')
    .optional(),
  description: z.string().max(2500).describe('The description of the tenant').optional().default(''),
  enabled: z.boolean().describe('Whether the tenant is enabled').optional().default(true),
  settings: z.record(z.any()).describe('Additional tenant settings').optional().default({}),
})

export const TenantSchema = TenantBaseSchema.extend({
  id: commonValidations.id,
  key: commonValidations.key.describe('The unique identifier of the tenant'),
  createdBy: commonValidations.id.describe('The user id of the creator of the tenant'),
  updatedBy: commonValidations.id.describe('The user id of the last user to update the tenant'),
  createdAt: commonValidations.timestamp.describe('The timestamp when the tenant was created'),
  updatedAt: commonValidations.timestamp.describe('The timestamp of the last tenant update'),
})

export type Tenant = z.infer<typeof TenantSchema>
export type CreateTenantDto = z.infer<typeof TenantBaseSchema>

// Input Validation for 'GET tenants/:id' endpoint
export const GetTenantSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})

// Input Validation for 'POST tenants' endpoint
export const CreateTenantSchema = z.object({
  body: TenantBaseSchema,
})

// Input Validation for 'PUT tenants/:id' endpoint
export const UpdateTenantSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: TenantBaseSchema.partial(),
})

export type TenantDatabaseDto = {
  id: number
  key: string
  name: string
  subdomain: string | null
  description: string
  created_by: number
  updated_by: number
  created_at: Date
  updated_at: Date
  enabled: boolean
  settings: Record<string, any>
}