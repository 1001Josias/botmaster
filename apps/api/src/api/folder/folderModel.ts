import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { commonValidations } from '@/common/utils/commonValidation'

extendZodWithOpenApi(z)

export const FolderBaseSchema = z.object({
  name: z
    .string({ description: 'The name of the folder' })
    .nonempty()
    .trim()
    .min(1)
    .max(100)
    .describe('The name of the folder')
    .openapi({
      example: 'My Folder',
    }),
  tenantKey: commonValidations.key.describe('The unique identifier of the tenant'),
  description: z.string().max(2500).describe('The description of the folder').optional().default(''),
  parentFolderKey: commonValidations.key.describe('The unique identifier of the parent folder').optional(),
  path: z.string().max(500).describe('The full path of the folder').optional(),
  enabled: z.boolean().describe('Whether the folder is enabled').optional().default(true),
  settings: z.record(z.any()).describe('Additional folder settings').optional().default({}),
})

export const FolderSchema = FolderBaseSchema.extend({
  id: commonValidations.id,
  key: commonValidations.key.describe('The unique identifier of the folder'),
  createdBy: commonValidations.id.describe('The user id of the creator of the folder'),
  updatedBy: commonValidations.id.describe('The user id of the last user to update the folder'),
  createdAt: commonValidations.timestamp.describe('The timestamp when the folder was created'),
  updatedAt: commonValidations.timestamp.describe('The timestamp of the last folder update'),
})

export type Folder = z.infer<typeof FolderSchema>
export type CreateFolderDto = z.infer<typeof FolderBaseSchema>

// Input Validation for 'GET folders/:id' endpoint
export const GetFolderSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})

// Input Validation for 'POST folders' endpoint
export const CreateFolderSchema = z.object({
  body: FolderBaseSchema,
})

// Input Validation for 'PUT folders/:id' endpoint
export const UpdateFolderSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: FolderBaseSchema.partial(),
})

export type FolderDatabaseDto = {
  id: number
  key: string
  name: string
  tenant_key: string
  description: string
  created_by: number
  updated_by: number
  created_at: Date
  updated_at: Date
  parent_folder_key: string | null
  path: string
  enabled: boolean
  settings: Record<string, any>
}