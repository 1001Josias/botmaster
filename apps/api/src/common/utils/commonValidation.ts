import { z } from 'zod'

export const commonValidations = {
  id: z.number().int().positive("'ID must be a positive number'"),
  key: z.string().uuid(),
  timestamp: z.date().describe('Timestamp'),
  params: z.object({
    id: z
      .string()
      .refine((data) => !Number.isNaN(Number(data)), 'ID must be a numeric value')
      .transform(Number)
      .refine((num) => num > 0, 'ID must be a positive number'),
  }),
}

export const contextSchema = z.object({
  folderKey: z.string({ required_error: 'x-folder-key header is required' }).uuid(),
  tenantKey: z.string({ required_error: 'x-tenant-key is required' }).uuid().optional(),
  organization: z.string({ required_error: 'x-organization is required' }).default('community'),
})
export type ContextDto = z.infer<typeof contextSchema>
