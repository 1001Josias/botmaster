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
